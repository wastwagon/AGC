"use client";

import { useFormStatus } from "react-dom";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { createNews, updateNews } from "./actions";
import { newsCategories, newsTags } from "@/data/content";

type NewsFormProps = {
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
      {pending ? "Saving…" : isEdit ? "Update" : "Create"}
    </button>
  );
}

export function NewsForm({ item }: NewsFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updateNews.bind(null, item.id) : createNews;

  const categories = (item?.categories as string[] | null) || [];
  const tags = (item?.tags as string[] | null) || [];

  return (
    <form action={action} className="space-y-6">

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title *</label>
        <input
          id="title"
          name="title"
          defaultValue={item?.title}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Slug (optional, auto-generated from title)</label>
        <input
          id="slug"
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="my-article-slug"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          id="image"
          name="image"
          defaultValue={item?.image ?? ""}
          placeholder="/uploads/news.jpg or full URL"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">Upload at Media, then use path like /uploads/filename.jpg</p>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={item?.excerpt ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700">Content (HTML allowed - sanitized on display)</label>
        <textarea
          id="content"
          name="content"
          defaultValue={item?.content ?? ""}
          rows={12}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-slate-700">Author</label>
        <input
          id="author"
          name="author"
          defaultValue={item?.author ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="categories" className="block text-sm font-medium text-slate-700">Categories (comma-separated slugs)</label>
        <input
          id="categories"
          name="categories"
          defaultValue={categories.join(", ")}
          placeholder="appi, events, announcements"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          Available: {newsCategories.map((c) => c.slug).join(", ")}
        </p>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags (comma-separated slugs)</label>
        <input
          id="tags"
          name="tags"
          defaultValue={tags.join(", ")}
          placeholder="governance, ghana"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          Available: {newsTags.map((t) => t.slug).join(", ")}
        </p>
      </div>

      <div>
        <label htmlFor="datePublished" className="block text-sm font-medium text-slate-700">Date Published</label>
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
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
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
        <a
          href="/admin/news"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>
    </form>
  );
}
