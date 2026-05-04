"use client";

import { useState, useEffect } from "react";
import { CategoryTree } from "@/components/CategoryTree";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, FileText, Package, Folder, GitFork } from "lucide-react";

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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              تصفح الأكواد
            </h1>
            <p className="text-sm text-muted-foreground">
              استعرض كل أكواد المنظومة الضريبية مصنفة ومنظمة
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              variant="destructive"
              className="gap-2 shadow-lg shadow-red-600/20"
              id="export-pdf-btn"
            >
              <FileText className="w-4 h-4" />
              تحميل PDF
            </Button>
            <Button
              onClick={() => handleExport("excel")}
              disabled={isExporting}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              id="export-excel-btn"
            >
              <FileSpreadsheet className="w-4 h-4" />
              تحميل Excel
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <Badge variant="outline" className="gap-2 py-1.5 border-primary/30 bg-primary/5">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary mono-numbers">
                {stats.totalItems.toLocaleString()} منتج
              </span>
            </Badge>
            <Badge variant="outline" className="gap-2 py-1.5 border-amber-400/30 bg-amber-50 dark:bg-amber-900/20">
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-amber-700 dark:text-amber-300 mono-numbers">
                {stats.totalCategories} تصنيف رئيسي
              </span>
            </Badge>
            <Badge variant="outline" className="gap-2 py-1.5">
              <GitFork className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mono-numbers">
                {stats.totalSubcategories} تصنيف فرعي
              </span>
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : (
        <CategoryTree categories={categories} />
      )}
    </div>
  );
}
