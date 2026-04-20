"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";

interface SearchResultItem {
  item: {
    id: string;
    code: string;
    name: string;
    categoryPath: string[];
  };
  similarity: number;
}


export default function HomePage() {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [queryTimeMs, setQueryTimeMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gs1-client": "true"
        },
        body: JSON.stringify({ query, topK: 10 }),
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setResults([]);
      } else {
        setResults(data.results);
        setQueryTimeMs(data.queryTimeMs);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-200/30 to-primary-50/10 dark:from-primary-900/20 dark:to-transparent blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-accent-400/10 to-transparent blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-6">
            <span className="material-icons-round text-primary-600 dark:text-primary-400 text-[16px]">
              verified
            </span>
            <span className="text-xs font-medium text-primary-700 dark:text-primary-300 mono-numbers">
              5,306 كود GS1 متاح
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight">
            ابحث عن كود المنتج
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary-600 to-primary-400">
              للفاتورة الإلكترونية
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            محرك بحث ذكي بيساعدك تلاقي كود أي منتج أو خدمة في المنظومة
            الضريبية المصرية بسهولة وسرعة
          </p>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Quick tips */}
          {!hasSearched && (
            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                جرب:
              </span>
              {["هاتف محمول", "أرز", "ملابس", "لابتوب", "عطور"].map(
                (tip) => (
                  <button
                    key={tip}
                    onClick={() => handleSearch(tip)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer"
                  >
                    {tip}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <SearchResults
          results={results}
          queryTimeMs={queryTimeMs}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </section>
    </div>
  );
}
