"use client";

import { useState, useEffect } from "react";
import { CategoryTree } from "@/components/CategoryTree";

interface Stats {
  totalItems: number;
  totalCategories: number;
  totalSubcategories: number;
}

export default function BrowsePage() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/browse", {
        headers: {
          "x-gs1-client": "true"
        }
      });
      const data = await res.json();
      setCategories(data.categories);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    const a = document.createElement("a");
    const filename = format === "excel" ? "gs1-codes-egypt.xlsx" : "gs1-codes-egypt.pdf";
    a.href = `/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              تصفح الأكواد
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              استعرض كل أكواد المنظومة الضريبية مصنفة ومنظمة
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-medium transition-colors shadow-lg shadow-red-600/20"
              id="export-pdf-btn"
            >
              <span className="material-icons-round text-[18px]">
                {isExporting ? "progress_activity" : "picture_as_pdf"}
              </span>
              تحميل PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-600/20"
              id="export-excel-btn"
            >
              <span className="material-icons-round text-[18px]">
                {isExporting ? "progress_activity" : "table_chart"}
              </span>
              تحميل Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-4 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <span className="material-icons-round text-primary-500 text-[16px]">
                inventory_2
              </span>
              <span className="text-xs text-primary-700 dark:text-primary-300 mono-numbers">
                {stats.totalItems.toLocaleString()} منتج
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <span className="material-icons-round text-amber-500 text-[16px]">
                folder
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-300 mono-numbers">
                {stats.totalCategories} تصنيف رئيسي
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
              <span className="material-icons-round text-slate-500 text-[16px]">
                subdirectory_arrow_left
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 mono-numbers">
                {stats.totalSubcategories} تصنيف فرعي
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="shimmer h-16 rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <CategoryTree categories={categories} />
      )}
    </div>
  );
}
