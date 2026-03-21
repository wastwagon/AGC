"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  title?: string;
};

type ImagePickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
};

export function ImagePicker({ open, onClose, onSelect }: ImagePickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchMedia();
  }, [open, fetchMedia]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-slate-900">Select from Media Library</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No images in library. Upload some first.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-slate-100 transition-all hover:border-accent-500 hover:shadow-md"
                >
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || item.filename}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized={item.url.endsWith(".svg")}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                    <span className="rounded-full bg-white p-2 text-accent-600">
                      <Check className="h-6 w-6" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
