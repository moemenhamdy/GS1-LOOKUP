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
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const RECENT_SEARCHES_KEY = "gs1-recent-searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentSearches().filter((s) => s !== query);
    recent.unshift(query);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT))
    );
  } catch {
    // Ignore storage errors
  }
}

export function SearchBar({ onSearch, isLoading, inputRef: externalInputRef }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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
      setShowRecent(false);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (recentSearches.length > 0) {
        setShowRecent(true);
      }
      return;
    }

    setShowRecent(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 150);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length >= 2) {
      setShowSuggestions(false);
      setShowRecent(false);
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setShowRecent(false);
    saveRecentSearch(suggestion.name);
    setRecentSearches(getRecentSearches());
    onSearch(suggestion.name);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    setShowRecent(false);
    onSearch(term);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setShowRecent(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isShowingSuggestions = showSuggestions && suggestions.length > 0;
    const isShowingRecent = showRecent && recentSearches.length > 0;

    if (!isShowingSuggestions && !isShowingRecent) {
      if (e.key === "Enter") handleSubmit();
      return;
    }

    const totalItems = isShowingSuggestions
      ? suggestions.length
      : recentSearches.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev < totalItems - 1 ? prev + 1 : 0;
          // Scroll into view
          requestAnimationFrame(() => {
            itemRefs.current[next]?.scrollIntoView({ block: "nearest" });
          });
          return next;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : totalItems - 1;
          requestAnimationFrame(() => {
            itemRefs.current[next]?.scrollIntoView({ block: "nearest" });
          });
          return next;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (isShowingSuggestions) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (isShowingRecent) {
            handleRecentClick(recentSearches[selectedIndex]);
          }
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setShowRecent(false);
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
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef]);

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

  const showDropdown =
    (showSuggestions && suggestions.length > 0) ||
    (showRecent && recentSearches.length > 0 && !query.trim());

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
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            } else if (!query.trim() && recentSearches.length > 0) {
              setShowRecent(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن اسم المنتج أو الكود..."
          className="w-full pr-12 pl-28 sm:pl-32 py-4 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-all duration-200"
          dir="rtl"
          autoComplete="off"
          id="search-input"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {/* Clear button */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-24 sm:left-28 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
            aria-label="مسح البحث"
          >
            <span className="material-icons-round text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg">
              close
            </span>
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || query.trim().length < 2}
          className="absolute left-2 top-1/2 -translate-y-1/2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-l from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-primary-500/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
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

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden z-50 animate-fade-in-up max-h-[400px] overflow-y-auto"
          role="listbox"
        >
          {/* Recent searches */}
          {showRecent && recentSearches.length > 0 && !query.trim() && (
            <>
              <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50">
                <span className="material-icons-round text-slate-400 text-sm">
                  history
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  عمليات بحث سابقة
                </span>
              </div>
              {recentSearches.map((term, idx) => (
                <button
                  key={`recent-${idx}`}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  type="button"
                  onClick={() => handleRecentClick(term)}
                  className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors ${
                    idx === selectedIndex
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  } ${idx !== recentSearches.length - 1 ? "border-b border-slate-100 dark:border-slate-700/50" : ""}`}
                  role="option"
                  aria-selected={idx === selectedIndex}
                >
                  <span className="material-icons-round text-slate-400 text-lg shrink-0">
                    history
                  </span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
                    {term}
                  </span>
                  <span className="material-icons-round text-slate-300 dark:text-slate-600 text-sm">
                    north_west
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Autocomplete suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={suggestion.id}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors ${
                    idx === selectedIndex
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  } ${idx !== suggestions.length - 1 ? "border-b border-slate-100 dark:border-slate-700/50" : ""}`}
                  role="option"
                  aria-selected={idx === selectedIndex}
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

              {/* Semantic search hint */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  اضغط
                </span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 shadow-sm">
                  Enter
                </kbd>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  للبحث الذكي
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
