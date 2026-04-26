"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

interface Stats {
  totalItems: number;
  totalCategories: number;
  totalSubcategories: number;
}

function AnimatedCounter({ value, label, icon, color }: { value: number; label: string; icon: string; color: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    primary: {
      bg: "bg-primary-50 dark:bg-primary-900/20",
      icon: "text-primary-500",
      text: "text-primary-700 dark:text-primary-300",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "text-amber-500",
      text: "text-amber-700 dark:text-amber-300",
    },
    slate: {
      bg: "bg-slate-100 dark:bg-slate-800",
      icon: "text-slate-500",
      text: "text-slate-700 dark:text-slate-300",
    },
  };

  const c = colorClasses[color] || colorClasses.primary;

  return (
    <div
      ref={ref}
      className={`${c.bg} rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.02]`}
    >
      <span className={`material-icons-round ${c.icon} text-2xl mb-2 block`}>
        {icon}
      </span>
      <p className={`mono-numbers text-2xl font-bold ${c.text} animate-count-up`}>
        {count.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [queryTimeMs, setQueryTimeMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch stats on mount
  useEffect(() => {
    fetch("/api/browse", { headers: { "x-gs1-client": "true" } })
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
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
  }, []);

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-200/30 to-primary-50/10 dark:from-primary-900/20 dark:to-transparent blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-accent-400/10 to-transparent blur-3xl" />
          {/* Floating decorative elements */}
          <div className="absolute top-32 left-[15%] w-3 h-3 rounded-full bg-primary-400/20 animate-float" />
          <div className="absolute top-48 right-[20%] w-2 h-2 rounded-full bg-primary-300/30 animate-float-delayed" />
          <div className="absolute top-64 left-[60%] w-4 h-4 rounded-full bg-accent-400/15 animate-float-slow" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-6">
            <span className="material-icons-round text-primary-600 dark:text-primary-400 text-[16px]">
              verified
            </span>
            <span className="text-xs font-medium text-primary-700 dark:text-primary-300 mono-numbers">
              {stats ? `${stats.totalItems.toLocaleString()} كود GS1 متاح` : "5,306 كود GS1 متاح"}
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
          <SearchBar onSearch={handleSearch} isLoading={isLoading} inputRef={searchInputRef} />

          {/* Quick tips & keyboard hint */}
          {!hasSearched && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  جرب:
                </span>
                {["هاتف محمول", "أرز", "ملابس", "لابتوب", "عطور"].map(
                  (tip) => (
                    <button
                      key={tip}
                      onClick={() => handleSearch(tip)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer hover:shadow-sm"
                    >
                      {tip}
                    </button>
                  )
                )}
              </div>
              {/* Keyboard shortcut hint */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  اضغط
                </span>
                <kbd className="kbd-badge">/</kbd>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  للبحث السريع
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <SearchResults
          results={results}
          queryTimeMs={queryTimeMs}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </section>

      {/* Stats Section */}
      {!hasSearched && stats && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <AnimatedCounter
                value={stats.totalItems}
                label="كود منتج"
                icon="inventory_2"
                color="primary"
              />
              <AnimatedCounter
                value={stats.totalCategories}
                label="تصنيف رئيسي"
                icon="folder"
                color="amber"
              />
              <AnimatedCounter
                value={stats.totalSubcategories}
                label="تصنيف فرعي"
                icon="subdirectory_arrow_left"
                color="slate"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
