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

export function autocompleteSearch(query: string, limit: number = 8): GS1Item[] {
  if (!query || query.length < 2) return [];

  const data = loadData();
  const normalizedQuery = query.trim().toLowerCase();

  const results: { item: GS1Item; priority: number }[] = [];

  for (const item of data.allItems) {
    const nameNorm = item.name.toLowerCase();
    const codeMatch = item.code.includes(normalizedQuery);

    if (codeMatch) {
      results.push({ item, priority: 0 }); // Exact code match = highest priority
    } else if (nameNorm.includes(normalizedQuery)) {
      const startsWithQuery = nameNorm.startsWith(normalizedQuery);
      results.push({ item, priority: startsWithQuery ? 1 : 2 });
    } else {
      // Check category path
      const pathText = item.categoryPath.join(" ").toLowerCase();
      if (pathText.includes(normalizedQuery)) {
        results.push({ item, priority: 3 });
      }
    }
  }

  results.sort((a, b) => a.priority - b.priority);
  return results.slice(0, limit).map((r) => r.item);
}
