"use client";

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

function SimilarityBadge({ score }: { score: number }) {
  let bgColor: string;
  let textColor: string;

  if (score >= 80) {
    bgColor = "bg-emerald-100 dark:bg-emerald-900/40";
    textColor = "text-emerald-700 dark:text-emerald-300";
  } else if (score >= 60) {
    bgColor = "bg-amber-100 dark:bg-amber-900/40";
    textColor = "text-amber-700 dark:text-amber-300";
  } else {
    bgColor = "bg-slate-100 dark:bg-slate-700";
    textColor = "text-slate-600 dark:text-slate-300";
  }

  return (
    <span
      className={`mono-numbers inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${bgColor} ${textColor}`}
    >
      <span className="material-icons-round text-[14px]">
        {score >= 80 ? "verified" : score >= 60 ? "check_circle" : "circle"}
      </span>
      {score.toFixed(1)}%
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="shimmer h-3 w-32 rounded-lg" />
          <div className="shimmer h-5 w-48 rounded-lg" />
          <div className="shimmer h-3 w-24 rounded-lg" />
        </div>
        <div className="shimmer h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function SearchResults({
  results,
  queryTimeMs,
  isLoading,
  hasSearched,
}: SearchResultsProps) {
  if (!hasSearched && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="material-icons-round text-lg animate-spin">
            progress_activity
          </span>
          جاري البحث...
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
        <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
          search_off
        </span>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          مفيش نتائج
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          جرب تبحث بكلمات تانية أو استخدم اسم المنتج بالعربي
        </p>
      </div>
    );
  }

  const isTopResultHighScore = results[0]?.similarity >= 90;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in-up">
      {/* Results meta */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="mono-numbers font-semibold text-slate-700 dark:text-slate-200">
            {results.length}
          </span>{" "}
          نتيجة
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mono-numbers">
          {queryTimeMs}ms
        </p>
      </div>

      {/* Results list */}
      <div className="space-y-3 stagger-children">
        {results.map((result, idx) => (
          <div
            key={result.item.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 cursor-default group ${
              idx === 0 && isTopResultHighScore
                ? "border-primary-300 dark:border-primary-700 highlight-pulse ring-1 ring-primary-200 dark:ring-primary-800"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            {/* Top result badge */}
            {idx === 0 && isTopResultHighScore && (
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-icons-round text-primary-500 text-[16px]">
                  star
                </span>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  أفضل نتيجة
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Category path */}
                {result.item.categoryPath.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span className="material-icons-round text-slate-400 text-[14px]">
                      folder
                    </span>
                    {result.item.categoryPath.map((cat, catIdx) => (
                      <span key={catIdx} className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                          {cat}
                        </span>
                        {catIdx < result.item.categoryPath.length - 1 && (
                          <span className="material-icons-round text-slate-300 dark:text-slate-600 text-[12px]">
                            chevron_left
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Item name */}
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-relaxed">
                  {result.item.name}
                </h3>

                {/* Code */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    كود GS1:
                  </span>
                  <span className="mono-numbers text-sm font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-0.5 rounded-lg select-all">
                    {result.item.code}
                  </span>
                </div>
              </div>

              {/* Similarity score */}
              <SimilarityBadge score={result.similarity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
