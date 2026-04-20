"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Suggestion {
  id: string;
  code: string;
  name: string;
  categoryPath: string[];
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`, {
        headers: {
          "x-gs1-client": "true"
        }
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length >= 2) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") handleSubmit();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 px-0.5 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? "search-focus-glow" : ""
        }`}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <span className="material-icons-round text-primary-500 text-2xl">
            search
          </span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن اسم المنتج أو الكود..."
          className="w-full pr-12 pl-24 sm:pl-28 py-4 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-all duration-200"
          dir="rtl"
          autoComplete="off"
          id="search-input"
        />

        <button
          type="submit"
          disabled={isLoading || query.trim().length < 2}
          className="absolute left-2 top-1/2 -translate-y-1/2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-l from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-primary-500/20 disabled:shadow-none"
          id="search-button"
        >
          {isLoading ? (
            <>
              <span className="material-icons-round text-lg animate-spin">
                progress_activity
              </span>
              جاري البحث
            </>
          ) : (
            <>
              <span className="material-icons-round text-lg">search</span>
              ابحث
            </>
          )}
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden z-50 animate-fade-in-up"
        >
          {suggestions.map((suggestion, idx) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors ${
                idx === selectedIndex
                  ? "bg-primary-50 dark:bg-primary-900/30"
                  : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
              } ${idx !== suggestions.length - 1 ? "border-b border-slate-100 dark:border-slate-700/50" : ""}`}
            >
              <span className="material-icons-round text-slate-400 text-lg shrink-0">
                search
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {highlightMatch(suggestion.name, query)}
                </p>
                {suggestion.categoryPath.length > 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate" dir="rtl">
                    {suggestion.categoryPath.join(" / ")}
                  </p>
                )}
              </div>
              <span className="mono-numbers text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-lg font-medium shrink-0">
                {suggestion.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
