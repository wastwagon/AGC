"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { AdminFormPreviewLink } from "../_components/AdminFormPreviewLink";
import { createNews, updateNews } from "./actions";
import { newsTags } from "@/data/content";
import type { TaxonomyOption } from "@/data/taxonomy-defaults";
import { ImagePicker, type MediaItem } from "@/components/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useImageFieldPreview } from "@/hooks/useImageFieldPreview";
import { sanitizeHtml } from "@/lib/sanitize";

type NewsFormProps = {
  categoryOptions: TaxonomyOption[];
  item?: {
    id: number;
    title: string;
    slug: string | null;
    image: string | null;
    excerpt: string | null;
    content: string | null;
    author: string | null;
    categories: unknown;
    tags: unknown;
    status: string;
    datePublished: Date | null;
  };
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent-500 px-6 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Save changes" : "Create"}
    </button>
  );
}

export function NewsForm({ categoryOptions, item }: NewsFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updateNews.bind(null, item.id) : createNews;
  const [image, setImage] = useState(item?.image ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [contentHtml, setContentHtml] = useState(item?.content ?? "");
  const [showContentPreview, setShowContentPreview] = useState(false);
  const { previewUrl: imagePreviewUrl, loading: imagePreviewLoading } = useImageFieldPreview(image);

  const selectedCategories = new Set((item?.categories as string[] | null) || []);

  const tags = (item?.tags as string[] | null) || [];

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="content" value={contentHtml} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Title *
        </label>
        <input
          id="title"
          name="title"
          defaultValue={item?.title}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
          Slug (optional, auto-generated from title)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="my-article-slug"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">
          Image URL
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="image"
            name="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="media-... or /uploads/news.jpg"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            title="Pick from Media Library"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Use Media ID (`media-...`) or a path like `/uploads/filename.jpg`.</p>
        {imagePreviewLoading ? (
          <p className="mt-2 text-xs text-slate-500">Loading preview…</p>
        ) : imagePreviewUrl ? (
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-600">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- Admin preview; bypass optimizer for /uploads */}
            <img
              src={imagePreviewUrl}
              alt=""
              className="mt-1 max-h-44 max-w-full rounded-lg border border-slate-200 bg-slate-50 object-contain object-left"
            />
          </div>
        ) : image.trim() ? (
          <p className="mt-2 text-xs text-amber-800">
            No preview — for <code className="rounded bg-amber-100 px-1">media-…</code> IDs the file must exist in{" "}
            <Link href="/admin/media" className="font-medium underline">
              Media Library
            </Link>
            . You can also paste a <code className="rounded bg-amber-100 px-1">/uploads/…</code> URL.
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={item?.excerpt ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="news-content-editor" className="block text-sm font-medium text-slate-700">
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowContentPreview((v) => !v)}
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            {showContentPreview ? "Hide preview" : "Preview content"}
          </button>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Rich text (headings, lists, links). Output is sanitized on the public article page.
        </p>
        <div className="mt-2">
          <RichTextEditor
            key={item?.id ?? "new"}
            editorId="news-content-editor"
            initialHtml={item?.content ?? ""}
            onHtmlChange={setContentHtml}
            placeholder="Write the article…"
          />
        </div>
        {showContentPreview ? (
          <div
            className="mt-3 rounded-lg border border-slate-200 bg-[#fffcf7] p-4 text-slate-800 [&_a]:text-accent-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:mt-2 [&_h4]:font-semibold [&_ol]:ml-6 [&_ol]:list-decimal [&_ul]:ml-6 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentHtml) }}
          />
        ) : null}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-slate-700">
          Author
        </label>
        <input
          id="author"
          name="author"
          defaultValue={item?.author ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">Categories (select any that apply)</legend>
        <p className="mb-3 text-xs text-slate-500">
          Options are defined in <strong>Admin → Taxonomy</strong>. You can select multiple categories.
        </p>
        <ul className="space-y-2">
          {categoryOptions.map((c) => (
            <li key={c.slug} className="flex items-start gap-3">
              <input
                id={`cat-${c.slug}`}
                name="categories"
                type="checkbox"
                value={c.slug}
                defaultChecked={selectedCategories.has(c.slug)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
              />
              <label htmlFor={`cat-${c.slug}`} className="text-sm text-slate-800">
                <span className="font-medium">{c.label}</span>
                {c.description && <span className="block text-xs text-slate-500">{c.description}</span>}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
          Tags (comma-separated slugs)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={tags.join(", ")}
          placeholder="governance, ghana"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">Available: {newsTags.map((t) => t.slug).join(", ")}</p>
      </div>

      <div>
        <label htmlFor="datePublished" className="block text-sm font-medium text-slate-700">
          Date Published
        </label>
        <input
          id="datePublished"
          name="datePublished"
          type="date"
          defaultValue={
            item?.datePublished
              ? new Date(item.datePublished).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10)
          }
          className="mt-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={item?.status ?? "draft"}
          className="mt-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <AdminFormStickyActions>
        <SubmitButton isEdit={!!isEdit} />
        {isEdit && item.slug ? (
          <AdminFormPreviewLink href={`/news/${encodeURIComponent(item.slug)}`}>Preview on site</AdminFormPreviewLink>
        ) : null}
        <Link
          href="/admin/news"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </AdminFormStickyActions>
      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(m: MediaItem) => setImage(m.id)}
      />
    </form>
  );
}
