"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Package, Folder, GitFork } from "lucide-react";

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

function AnimatedCounter({ value, label, icon: Icon, color }: { value: number; label: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
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
      bg: "bg-primary/10",
      icon: "text-primary",
      text: "text-primary",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "text-amber-500",
      text: "text-amber-700 dark:text-amber-300",
    },
    slate: {
      bg: "bg-muted",
      icon: "text-muted-foreground",
      text: "text-foreground",
    },
  };

  const c = colorClasses[color] || colorClasses.primary;

  return (
    <div ref={ref} className="transition-all duration-300 hover:scale-[1.02]">
      <div className={`${c.bg} rounded-2xl p-6 text-center`}>
        <Icon className={`w-6 h-6 ${c.icon} mx-auto mb-2`} />
        <p className={`mono-numbers text-2xl font-bold ${c.text} animate-count-up`}>
          {count.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-400/10 to-transparent blur-3xl" />
          {/* Floating decorative elements */}
          <div className="absolute top-32 left-[15%] w-3 h-3 rounded-full bg-primary/20 animate-float" />
          <div className="absolute top-48 right-[20%] w-2 h-2 rounded-full bg-primary/30 animate-float-delayed" />
          <div className="absolute top-64 left-[60%] w-4 h-4 rounded-full bg-amber-400/15 animate-float-slow" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="outline" className="gap-2 px-4 py-1.5 mb-6 border-primary/30 bg-primary/5">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary mono-numbers">
              {stats ? `${stats.totalItems.toLocaleString()} كود GS1 متاح` : "5,306 كود GS1 متاح"}
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            ابحث عن كود المنتج
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-teal-400">
              للفاتورة الإلكترونية
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            محرك بحث ذكي بيساعدك تلاقي كود أي منتج أو خدمة في المنظومة
            الضريبية المصرية بسهولة وسرعة
          </p>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} inputRef={searchInputRef} />

          {/* Quick tips */}
          {!hasSearched && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  جرب:
                </span>
                {["هاتف محمول", "أرز", "ملابس", "لابتوب", "عطور"].map(
                  (tip) => (
                    <Button
                      key={tip}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(tip)}
                      className="text-xs h-8 rounded-lg hover:border-primary/50 hover:text-primary"
                    >
                      {tip}
                    </Button>
                  )
                )}
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
                icon={Package}
                color="primary"
              />
              <AnimatedCounter
                value={stats.totalCategories}
                label="تصنيف رئيسي"
                icon={Folder}
                color="amber"
              />
              <AnimatedCounter
                value={stats.totalSubcategories}
                label="تصنيف فرعي"
                icon={GitFork}
                color="slate"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
