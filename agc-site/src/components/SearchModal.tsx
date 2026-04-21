"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, Calendar, FileText, BookOpen } from "lucide-react";
import type { SearchItem } from "@/app/api/search/route";
import type { SiteSearchChrome } from "@/data/site-chrome";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  copy: SiteSearchChrome;
};

const typeIcons = {
  event: Calendar,
  news: FileText,
  publication: BookOpen,
};

export function SearchModal({ isOpen, onClose, copy }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const typeLabels = useMemo(
    () => ({
      event: copy.typeEvent,
      news: copy.typeNews,
      publication: copy.typePublication,
    }),
    [copy.typeEvent, copy.typeNews, copy.typePublication]
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      setQuery("");
      inputRef.current?.focus();
    }
  }, [isOpen, fetchItems]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(items.slice(0, 8));
      return;
    }
    const fuse = new Fuse(items, {
      keys: ["title", "excerpt"],
      threshold: 0.4,
    });
    setResults(fuse.search(query).map((r) => r.item));
  }, [query, items]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] px-4">
      <div
        className="w-full max-w-xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogAriaLabel}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.placeholder}
            className="flex-1 bg-transparent py-2 text-slate-900 placeholder-slate-400 outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label={copy.closeAriaLabel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <p className="py-8 text-center text-slate-500">{copy.loading}</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              {query ? copy.emptyNoResults : copy.emptyNoQuery}
            </p>
          ) : (
            <ul className="space-y-1">
              {results.slice(0, 12).map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent-50 text-accent-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{typeLabels[item.type]}</p>
                        {item.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-hidden
      />
    </div>
  );
}
