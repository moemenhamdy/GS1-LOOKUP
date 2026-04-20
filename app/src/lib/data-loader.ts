import "server-only";

import fs from "fs";
import path from "path";

export interface GS1Item {
  id: string;
  code: string;
  name: string;
  categoryPath: string[];
  searchText: string;
}

export interface GS1Subcategory {
  id: string;
  name: string;
  items: GS1Item[];
}

export interface GS1Category {
  id: string;
  name: string;
  code: string;
  subcategories: GS1Subcategory[];
  items: GS1Item[];
}

export interface GS1Data {
  categories: GS1Category[];
  allItems: GS1Item[];
  stats: {
    totalItems: number;
    totalCategories: number;
    totalSubcategories: number;
  };
}

export interface GS1Embeddings {
  model: string;
  dimensions: number;
  generatedAt: string;
  items: {
    id: string;
    embedding: number[];
  }[];
}

// Singleton cache
let cachedData: GS1Data | null = null;
let cachedEmbeddings: GS1Embeddings | null = null;
let cachedEmbeddingMap: Map<string, number[]> | null = null;
let cachedNorms: Map<string, number> | null = null;

function getDataPath(filename: string): string {
  return path.join(process.cwd(), "data", filename);
}

export function loadData(): GS1Data {
  if (cachedData) return cachedData;

  const dataPath = getDataPath("gs1_data.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  cachedData = JSON.parse(raw) as GS1Data;
  return cachedData;
}

export function loadEmbeddings(): GS1Embeddings {
  if (cachedEmbeddings) return cachedEmbeddings;

  const embPath = getDataPath("gs1_embeddings.json");
  const raw = fs.readFileSync(embPath, "utf-8");
  cachedEmbeddings = JSON.parse(raw) as GS1Embeddings;
  return cachedEmbeddings;
}

export function getEmbeddingMap(): Map<string, number[]> {
  if (cachedEmbeddingMap) return cachedEmbeddingMap;

  const embeddings = loadEmbeddings();
  cachedEmbeddingMap = new Map();

  for (const item of embeddings.items) {
    cachedEmbeddingMap.set(item.id, item.embedding);
  }

  return cachedEmbeddingMap;
}

function computeNorm(vec: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

export function getNormMap(): Map<string, number> {
  if (cachedNorms) return cachedNorms;

  const embMap = getEmbeddingMap();
  cachedNorms = new Map();

  for (const [id, emb] of embMap) {
    cachedNorms.set(id, computeNorm(emb));
  }

  return cachedNorms;
}
