import "server-only";

import {
  loadData,
  getEmbeddingMap,
  getNormMap,
  type GS1Item,
} from "./data-loader";

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const JINA_MODEL = "jina-embeddings-v5-text-small";

export interface SearchResult {
  item: GS1Item;
  similarity: number;
}

// ── Arabic Text Normalization ──────────────────────────────────────────

const TASHKEEL_REGEX = /[\u064B-\u065F\u0670]/g; // Fathatan through Hamza below

function normalizeArabic(text: string): string {
  let normalized = text.toLowerCase();
  // Remove tashkeel/diacritics
  normalized = normalized.replace(TASHKEEL_REGEX, "");
  // Normalize hamza variants → ا
  normalized = normalized.replace(/[أإآٱ]/g, "ا");
  // Normalize taa marbuta → ه
  normalized = normalized.replace(/ة/g, "ه");
  // Normalize alef maqsura → ي
  normalized = normalized.replace(/ى/g, "ي");
  // Normalize waw with hamza
  normalized = normalized.replace(/ؤ/g, "و");
  // Normalize yaa with hamza
  normalized = normalized.replace(/ئ/g, "ي");
  // Collapse multiple spaces
  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
}

// ── Trigram Index for Fuzzy Matching ────────────────────────────────────

function extractTrigrams(text: string): Set<string> {
  const trigrams = new Set<string>();
  const padded = `  ${text} `;
  for (let i = 0; i < padded.length - 2; i++) {
    trigrams.add(padded.substring(i, i + 3));
  }
  return trigrams;
}

function trigramSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const trigram of setA) {
    if (setB.has(trigram)) intersection++;
  }
  return (2 * intersection) / (setA.size + setB.size);
}

// Cached trigram index (built once on first autocomplete)
let trigramIndex: Map<string, { trigrams: Set<string>; normalizedName: string }> | null = null;

function getTrigramIndex(): Map<string, { trigrams: Set<string>; normalizedName: string }> {
  if (trigramIndex) return trigramIndex;

  const data = loadData();
  trigramIndex = new Map();

  for (const item of data.allItems) {
    const normalizedName = normalizeArabic(item.name);
    const trigrams = extractTrigrams(normalizedName);
    trigramIndex.set(item.id, { trigrams, normalizedName });
  }

  return trigramIndex;
}

// ── Autocomplete Query Cache ───────────────────────────────────────────

const autocompleteCache = new Map<string, { results: GS1Item[]; cachedAt: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCachedAutocomplete(key: string): GS1Item[] | null {
  const entry = autocompleteCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    autocompleteCache.delete(key);
    return null;
  }
  return entry.results;
}

function setCachedAutocomplete(key: string, results: GS1Item[]): void {
  // Limit cache size
  if (autocompleteCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of autocompleteCache.entries()) {
      if (now - v.cachedAt > CACHE_TTL_MS) autocompleteCache.delete(k);
    }
  }
  autocompleteCache.set(key, { results, cachedAt: Date.now() });
}

// ── Core Search Functions ──────────────────────────────────────────────

function cosineSimilarity(
  vecA: number[],
  normA: number,
  vecB: number[],
  normB: number
): number {
  if (normA === 0 || normB === 0) return 0;

  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  return dotProduct / (normA * normB);
}

function computeNorm(vec: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

async function getQueryEmbedding(query: string): Promise<number[]> {
  const apiKey = process.env.JINA_API_KEY;
  if (!apiKey) {
    throw new Error("JINA_API_KEY is not configured");
  }

  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: JINA_MODEL,
      input: [query],
      embedding_type: "float",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Jina API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function semanticSearch(
  query: string,
  topK: number = 10
): Promise<{ results: SearchResult[]; queryTimeMs: number }> {
  const start = Date.now();

  const queryEmbedding = await getQueryEmbedding(query);
  const queryNorm = computeNorm(queryEmbedding);

  const data = loadData();
  const embMap = getEmbeddingMap();
  const normMap = getNormMap();

  const similarities: { itemId: string; score: number }[] = [];

  // Stage 1: Dense Retrieval
  for (const item of data.allItems) {
    const itemEmb = embMap.get(item.id);
    const itemNorm = normMap.get(item.id);

    if (!itemEmb || itemNorm === undefined) continue;

    let score = cosineSimilarity(
      queryEmbedding,
      queryNorm,
      itemEmb,
      itemNorm
    );
    similarities.push({ itemId: item.id, score });
  }

  similarities.sort((a, b) => b.score - a.score);
  
  // Cut Candidates for Stage 2
  const candidateDocs = similarities.slice(0, 50);
  const itemMap = new Map(data.allItems.map((item) => [item.id, item]));
  
  const documents = candidateDocs.map(c => itemMap.get(c.itemId)!.name);

  const apiKey = process.env.JINA_API_KEY;
  if (!apiKey) {
    throw new Error("JINA_API_KEY is not configured");
  }

  // Stage 2: Cross-Encoder Reranking
  const rerankResponse = await fetch("https://api.jina.ai/v1/rerank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "jina-reranker-v3",
      query: query,
      documents: documents,
      top_n: topK,
    }),
  });

  if (!rerankResponse.ok) {
    const err = await rerankResponse.text();
    console.error("Reranker failed, falling back to dense only:", err);
    
    // Fallback logic
    const topResults = candidateDocs.slice(0, topK);
    const results: SearchResult[] = topResults.map((s) => {
      let boosted = s.score > 0 ? Math.pow(s.score, 0.5) : 0;
      if (boosted > 1.0) boosted = 1.0;
      
      return {
        item: itemMap.get(s.itemId)!,
        similarity: Math.round(boosted * 10000) / 100,
      };
    });
    const queryTimeMs = Date.now() - start;
    return { results, queryTimeMs };
  }

  const rerankData = await rerankResponse.json();
  const rerankResultsList = rerankData.results || [];

  const results: SearchResult[] = rerankResultsList.map((r: any) => {
    const originalCandidate = candidateDocs[r.index];
    const item = itemMap.get(originalCandidate.itemId)!;
    
    // Reranker scores typically fall in [-0.5, 0.7] range.
    // We map this score to [0, 1] using a shifting factor.
    let normalized = Math.max(0, Math.min(1, r.relevance_score * 1.5 + 0.3));
    let boosted = Math.pow(normalized, 0.4); // slightly stronger boost curve for reranker confidence
    if (boosted > 1.0) boosted = 1.0;
    
    // Hardcode an exact match check to guarantee visually 99% if user types the exact word
    if (item.name.toLowerCase() === query.toLowerCase().trim()) {
      boosted = Math.max(boosted, 0.99);
    }

    return {
      item,
      similarity: Math.round(boosted * 10000) / 100,
    };
  });

  const queryTimeMs = Date.now() - start;

  return { results, queryTimeMs };
}

// ── Enhanced Autocomplete ──────────────────────────────────────────────

export function autocompleteSearch(query: string, limit: number = 8): GS1Item[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = normalizeArabic(query.trim());

  // Check cache first
  const cached = getCachedAutocomplete(normalizedQuery);
  if (cached) return cached;

  const data = loadData();
  const tIndex = getTrigramIndex();
  const queryTrigrams = extractTrigrams(normalizedQuery);
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

  const results: { item: GS1Item; priority: number; score: number }[] = [];

  for (const item of data.allItems) {
    const indexEntry = tIndex.get(item.id);
    if (!indexEntry) continue;

    const { normalizedName, trigrams: itemTrigrams } = indexEntry;
    const codeMatch = item.code.includes(normalizedQuery);

    if (codeMatch) {
      // Exact code match = highest priority
      results.push({ item, priority: 0, score: 1 });
    } else if (normalizedName === normalizedQuery) {
      // Exact name match
      results.push({ item, priority: 0, score: 0.99 });
    } else if (normalizedName.startsWith(normalizedQuery)) {
      // Starts with query
      results.push({ item, priority: 1, score: 0.9 });
    } else if (normalizedName.includes(normalizedQuery)) {
      // Contains query as substring
      results.push({ item, priority: 2, score: 0.8 });
    } else if (queryWords.length > 1) {
      // Multi-word: check if ALL query words appear in the name
      const allWordsMatch = queryWords.every(w => normalizedName.includes(w));
      if (allWordsMatch) {
        results.push({ item, priority: 2, score: 0.75 });
      } else {
        // Check how many words match
        const matchCount = queryWords.filter(w => normalizedName.includes(w)).length;
        if (matchCount > 0) {
          const ratio = matchCount / queryWords.length;
          if (ratio >= 0.5) {
            results.push({ item, priority: 3, score: 0.5 + ratio * 0.2 });
          }
        }
      }
    } else {
      // Trigram fuzzy matching for single words / typo tolerance
      const similarity = trigramSimilarity(queryTrigrams, itemTrigrams);
      if (similarity >= 0.3) {
        results.push({ item, priority: 4, score: similarity });
      } else {
        // Check category path as last resort
        const pathNorm = normalizeArabic(item.categoryPath.join(" "));
        if (pathNorm.includes(normalizedQuery)) {
          results.push({ item, priority: 5, score: 0.3 });
        }
      }
    }
  }

  // Sort by priority first, then by score within same priority
  results.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.score - a.score;
  });

  const finalResults = results.slice(0, limit).map((r) => r.item);

  // Cache the results
  setCachedAutocomplete(normalizedQuery, finalResults);

  return finalResults;
}
