"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Copy, Trash2, Check, ImagePlus } from "lucide-react";
import { AdminPageHeader } from "../_components/AdminPageHeader";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  title?: string;
  size?: number;
  uploadedAt: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
      else setError(data.error || "Failed to load");
    } catch {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-slate-500">Loading media library…</div>
      </div>
    );
  }

  const handleUpload = async (files: FileList | File[]) => {
    const fileList = Array.isArray(files) ? files : Array.from(files);
    const imageFiles = fileList.filter((f) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"].includes(f.type)
    );
    if (imageFiles.length === 0) {
      setError("Please select image files (JPEG, PNG, GIF, WebP, SVG)");
      return;
    }
    setUploading(true);
    setError(null);
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.item) {
          setItems((prev) => [data.item, ...prev]);
        } else {
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed");
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fullUrl = (url: string) =>
    typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload images and reuse them across news, events, and pages. Select an image to copy its URL or media ID."
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-6 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver ? "border-accent-500 bg-accent-50" : "border-slate-200 bg-white"
        }`}
      >
        <input
          type="file"
          id="media-upload"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) handleUpload(files);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="media-upload"
          className={`cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 font-medium text-slate-700">
            {uploading ? "Uploading…" : "Drop images here or click to upload"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            JPEG, PNG, GIF, WebP, SVG. Images can be reused across the site.
          </p>
        </label>
      </div>

      {/* Grid */}
      <div className="mt-10">
        <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
          Library ({items.length} {items.length === 1 ? "image" : "images"})
        </h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No images yet. Upload some to get started.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || item.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                    unoptimized={item.url.endsWith(".svg")}
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-slate-900" title={item.filename}>
                    {item.title || item.filename}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(fullUrl(item.url), item.id)}
                      className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.id, item.id)}
                      className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      ID
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="ml-auto flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
