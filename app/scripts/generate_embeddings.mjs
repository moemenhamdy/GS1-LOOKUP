/**
 * Generate Embeddings Script
 * Run once to pre-compute Jina AI embeddings for all GS1 items.
 * Usage: node scripts/generate_embeddings.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'gs1_data.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'gs1_embeddings.json');

const JINA_API_KEY = 'jina_07be8fc6a3514c65b0f4e4253b056d69cp38lFNMzfywf-AfqYfp1TcMCrBU';
const JINA_API_URL = 'https://api.jina.ai/v1/embeddings';
const MODEL = 'jina-embeddings-v3';
const DIMENSIONS = 512;
const BATCH_SIZE = 100;

async function getEmbeddings(texts) {
  const response = await fetch(JINA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: texts,
      task: 'text-matching',
      dimensions: DIMENSIONS,
      embedding_type: 'float',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Jina API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data.map(item => item.embedding);
}

async function main() {
  console.log('Loading data...');
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(rawData);
  const items = data.allItems;
  
  console.log(`Total items to embed: ${items.length}`);
  
  // Prepare search texts
  const searchTexts = items.map(item => item.searchText);
  
  // Process in batches
  const allEmbeddings = [];
  const totalBatches = Math.ceil(searchTexts.length / BATCH_SIZE);
  
  for (let i = 0; i < searchTexts.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = searchTexts.slice(i, i + BATCH_SIZE);
    
    console.log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} items)...`);
    
    try {
      const embeddings = await getEmbeddings(batch);
      allEmbeddings.push(...embeddings);
      console.log(`  ✓ Batch ${batchNum} complete`);
    } catch (err) {
      console.error(`  ✗ Batch ${batchNum} failed:`, err.message);
      // Retry once after a delay
      console.log('  Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const embeddings = await getEmbeddings(batch);
        allEmbeddings.push(...embeddings);
        console.log(`  ✓ Batch ${batchNum} retry successful`);
      } catch (retryErr) {
        console.error(`  ✗ Batch ${batchNum} retry failed:`, retryErr.message);
        process.exit(1);
      }
    }
    
    // Rate limiting — small delay between batches
    if (i + BATCH_SIZE < searchTexts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\nTotal embeddings generated: ${allEmbeddings.length}`);
  
  // Build output
  const output = {
    model: MODEL,
    dimensions: DIMENSIONS,
    generatedAt: new Date().toISOString(),
    items: items.map((item, idx) => ({
      id: item.id,
      embedding: allEmbeddings[idx],
    })),
  };
  
  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output), 'utf-8');
  
  const fileSizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✓ Embeddings written to ${OUTPUT_PATH}`);
  console.log(`  File size: ${fileSizeMB} MB`);
  console.log(`  Items: ${output.items.length}`);
  console.log(`  Dimensions: ${DIMENSIONS}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
