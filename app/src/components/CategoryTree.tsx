"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronLeft, Tag, Filter, FolderOpen } from "lucide-react";

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full text-right px-5 py-4 flex items-center gap-3 bg-card hover:bg-muted/50 transition-colors rounded-xl border border-border">
        <ChevronLeft
          className={`w-5 h-5 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-[-90deg]" : ""
          }`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {category.name}
          </h3>
          {category.code && (
            <span className="mono-numbers text-xs text-muted-foreground">
              {category.code}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="mono-numbers text-xs">
            {totalItems} عنصر
          </Badge>
          {category.subcategories.length > 0 && (
            <Badge variant="outline" className="mono-numbers text-xs text-primary border-primary/30">
              {category.subcategories.length} تصنيف فرعي
            </Badge>
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-5 pb-4 pt-2 bg-muted/30 rounded-b-xl border-x border-b border-border -mt-1">
          {/* Direct items */}
          {category.items && category.items.length > 0 && (
            <div className="mt-2">
              <ItemsList items={category.items} />
            </div>
          )}

          {/* Subcategories */}
          {category.subcategories.map((sub) => (
            <SubcategorySection key={sub.id} subcategory={sub} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SubcategorySection({ subcategory }: { subcategory: Subcategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger className="w-full text-right px-3 py-2.5 flex items-center gap-2 rounded-lg hover:bg-card transition-colors">
        <ChevronLeft
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-[-90deg]" : ""
          }`}
        />
        <span className="text-sm text-foreground/80 flex-1 text-right truncate">
          {subcategory.name}
        </span>
        <span className="text-xs text-muted-foreground mono-numbers shrink-0">
          {subcategory.items?.length || 0}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="pr-8 mt-1">
          <ItemsList items={subcategory.items || []} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="space-y-0.5">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card transition-colors group"
        >
          <Tag className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          <span className="flex-1 text-sm text-foreground/80 truncate">
            {item.name}
          </span>
          <span className="mono-numbers text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-lg font-medium shrink-0 select-all">
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
        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="فلتر التصنيفات..."
          className="pr-12 rounded-xl"
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
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
            مفيش تصنيفات بالفلتر ده
          </div>
        )}
      </div>
    </div>
  );
}
