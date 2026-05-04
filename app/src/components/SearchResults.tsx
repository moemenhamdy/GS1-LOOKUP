"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Folder,
  ChevronLeft,
  SearchX,
  Zap,
  CheckCircle2,
  Circle,
  Copy,
  Check,
} from "lucide-react";

interface SearchResultItem {
  item: {
    id: string;
    code: string;
    name: string;
    categoryPath: string[];
  };
  similarity: number;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  queryTimeMs: number;
  isLoading: boolean;
  hasSearched: boolean;
}

// ── Similarity Badge ───────────────────────────────────────────────────

function SimilarityBadge({ score }: { score: number }) {
  let variant: "default" | "secondary" | "outline" = "secondary";
  let className = "";
  let Icon = Circle;

  if (score >= 80) {
    variant = "default";
    className = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0";
    Icon = CheckCircle2;
  } else if (score >= 60) {
    variant = "default";
    className = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0";
    Icon = CheckCircle2;
  } else {
    variant = "secondary";
    className = "";
    Icon = Circle;
  }

  return (
    <Badge variant={variant} className={`mono-numbers gap-1 ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {score.toFixed(1)}%
    </Badge>
  );
}

// ── Skeleton Card ──────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────────────

export function SearchResults({
  results,
  queryTimeMs,
  isLoading,
  hasSearched,
}: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = async (code: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`تم نسخ الكود ${code}`);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(`تم نسخ الكود ${code}`);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!hasSearched && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          جاري البحث الذكي...
        </div>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 text-center py-12">
        <SearchX className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          مفيش نتائج
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          جرب تبحث بكلمات تانية أو استخدم اسم المنتج بالعربي
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">جرب:</span>
          {["أغذية", "إلكترونيات", "ملابس", "مستحضرات تجميل"].map((term) => (
            <Badge key={term} variant="outline" className="text-xs">
              {term}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  const isTopResultHighScore = results[0]?.similarity >= 90;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in-up">
      {/* Results meta */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-muted-foreground">
          <span className="mono-numbers font-semibold text-foreground">
            {results.length}
          </span>{" "}
          نتيجة
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span className="mono-numbers">{queryTimeMs}ms</span>
          </span>
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-3 stagger-children">
        {results.map((result, idx) => (
          <Card
            key={result.item.id}
            className={`transition-all duration-200 hover:shadow-lg group ${
              idx === 0 && isTopResultHighScore
                ? "border-primary/50 highlight-pulse ring-1 ring-primary/20"
                : "hover:border-border/80"
            }`}
          >
            <CardContent className="p-5">
              {/* Top result badge */}
              {idx === 0 && isTopResultHighScore && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    أفضل نتيجة
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Category path */}
                  {result.item.categoryPath.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                      {result.item.categoryPath.map((cat, catIdx) => (
                        <span key={catIdx} className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {cat}
                          </span>
                          {catIdx < result.item.categoryPath.length - 1 && (
                            <ChevronLeft className="w-3 h-3 text-muted-foreground/40" />
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Item name */}
                  <h3 className="text-base font-semibold text-foreground mb-2 leading-relaxed">
                    {result.item.name}
                  </h3>

                  {/* Code with copy button */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      كود GS1:
                    </span>
                    <button
                      onClick={() => handleCopyCode(result.item.code, result.item.id)}
                      className="inline-flex items-center gap-1.5 mono-numbers text-sm font-semibold text-primary bg-primary/10 px-3 py-0.5 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer group/code"
                      title="انسخ الكود"
                    >
                      {result.item.code}
                      <span className="opacity-0 group-hover/code:opacity-100 transition-opacity">
                        {copiedId === result.item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-primary" />
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Similarity score */}
                <SimilarityBadge score={result.similarity} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
