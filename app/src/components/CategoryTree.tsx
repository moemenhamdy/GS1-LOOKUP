"use client";

import { useState } from "react";

interface Item {
  id: string;
  code: string;
  name: string;
  categoryPath: string[];
}

interface Subcategory {
  id: string;
  name: string;
  items: Item[];
}

interface Category {
  id: string;
  name: string;
  code: string;
  subcategories: Subcategory[];
  items: Item[];
}

interface CategoryTreeProps {
  categories: Category[];
}

function CategoryAccordion({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems =
    (category.items?.length || 0) +
    category.subcategories.reduce(
      (sum, sub) => sum + (sub.items?.length || 0),
      0
    );

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right px-5 py-4 flex items-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
      >
        <span
          className={`material-icons-round text-primary-500 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          chevron_left
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {category.name}
          </h3>
          {category.code && (
            <span className="mono-numbers text-xs text-slate-400 dark:text-slate-500">
              {category.code}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg mono-numbers">
            {totalItems} عنصر
          </span>
          {category.subcategories.length > 0 && (
            <span className="text-xs text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-lg mono-numbers">
              {category.subcategories.length} تصنيف فرعي
            </span>
          )}
        </div>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[5000px]" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-4 bg-slate-50/50 dark:bg-slate-800/50">
          {/* Direct items */}
          {category.items && category.items.length > 0 && (
            <div className="mt-3">
              <ItemsList items={category.items} />
            </div>
          )}

          {/* Subcategories */}
          {category.subcategories.map((sub) => (
            <SubcategorySection key={sub.id} subcategory={sub} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubcategorySection({ subcategory }: { subcategory: Subcategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right px-3 py-2.5 flex items-center gap-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 transition-colors"
      >
        <span
          className={`material-icons-round text-slate-400 text-[18px] transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          chevron_left
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 text-right truncate">
          {subcategory.name}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mono-numbers shrink-0">
          {subcategory.items?.length || 0}
        </span>
      </button>

      <div
        className={`transition-all duration-200 overflow-hidden ${
          isOpen ? "max-h-[3000px]" : "max-h-0"
        }`}
      >
        <div className="pr-8 mt-1">
          <ItemsList items={subcategory.items || []} />
        </div>
      </div>
    </div>
  );
}

function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/30 transition-colors group"
        >
          <span className="material-icons-round text-slate-300 dark:text-slate-600 text-[16px] group-hover:text-primary-400 transition-colors">
            label
          </span>
          <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
            {item.name}
          </span>
          <span className="mono-numbers text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-lg font-medium shrink-0 select-all">
            {item.code}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const [filter, setFilter] = useState("");

  const filteredCategories = filter
    ? categories.filter(
        (cat) =>
          cat.name.includes(filter) ||
          cat.code.includes(filter) ||
          cat.subcategories.some(
            (sub) =>
              sub.name.includes(filter) ||
              sub.items.some(
                (item) =>
                  item.name.includes(filter) || item.code.includes(filter)
              )
          ) ||
          (cat.items &&
            cat.items.some(
              (item) =>
                item.name.includes(filter) || item.code.includes(filter)
            ))
      )
    : categories;

  return (
    <div>
      {/* Filter input */}
      <div className="mb-6 relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-xl">
          filter_list
        </span>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="فلتر التصنيفات..."
          className="w-full pr-12 pl-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none transition-colors"
          id="browse-filter"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryAccordion key={category.id} category={category} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <span className="material-icons-round text-4xl block mb-2">
              folder_off
            </span>
            مفيش تصنيفات بالفلتر ده
          </div>
        )}
      </div>
    </div>
  );
}
