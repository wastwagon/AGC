"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Check, Upload, Loader2 } from "lucide-react";
import { MAX_MEDIA_UPLOAD_BYTES, formatMaxUploadBytes } from "@/lib/media-limits";
import { rasterDimensionsFromFile } from "@/lib/media-upload-client";
export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
};

type ImagePickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
};

export function ImagePicker({ open, onClose, onSelect }: ImagePickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
      else setError(data?.error || "Failed to load media library.");
    } catch {
      setError("Failed to load media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileList = Array.isArray(files) ? files : Array.from(files);
      const imageFiles = fileList.filter((f) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"].includes(f.type)
      );
      if (imageFiles.length === 0) {
        setError("Please select image files (JPEG, PNG, GIF, WebP, SVG).");
        return;
      }

      setUploading(true);
      setError(null);
      try {
        for (const file of imageFiles) {
          if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
            setError(`"${file.name}" is too large. Maximum size is ${formatMaxUploadBytes()}.`);
            continue;
          }
          const formData = new FormData();
          formData.append("file", file);
          const dims = await rasterDimensionsFromFile(file);
          if (dims.width) formData.append("width", dims.width);
          if (dims.height) formData.append("height", dims.height);
          const res = await fetch("/api/media", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok && data.item) {
            setItems((prev) => [data.item as MediaItem, ...prev]);
          } else {
            setError(data?.error || `Upload failed for ${file.name}`);
          }
        }
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open) {
      setError(null);
      fetchMedia();
    }
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
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="picker-upload"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload from computer"}
              </label>
              <input
                id="picker-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.length) void handleUpload(files);
                  e.target.value = "";
                }}
              />
              <Link href="/admin/media" className="text-sm font-medium text-accent-700 hover:underline">
                Open full Media Library
              </Link>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Max {formatMaxUploadBytes()} per file. Upload then click an image to use it in this form.
            </p>
            {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
          </div>
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No images in library yet. Upload from your computer above.</div>
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
                  {/* eslint-disable-next-line @next/next/no-img-element -- Picker thumbs: bypass optimizer (dev 400 on /uploads). */}
                  <img
                    src={item.url}
                    alt={item.alt || item.title || item.filename}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
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
