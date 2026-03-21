"use client";

import { useFormStatus } from "react-dom";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { createPublication, updatePublication } from "./actions";

type PublicationFormProps = {
  item?: {
    id: number;
    title: string;
    slug: string | null;
    excerpt: string | null;
    type: string | null;
    file: string | null;
    image: string | null;
    datePublished: Date | null;
    author: string | null;
    status: string;
  };
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-lg bg-accent-500 px-6 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Update" : "Create"}
    </button>
  );
}

export function PublicationForm({ item }: PublicationFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updatePublication.bind(null, item.id) : createPublication;

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
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Slug (optional)</label>
        <input
          id="slug"
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="auto-generated from title"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
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
        <label htmlFor="type" className="block text-sm font-medium text-slate-700">Type</label>
        <input
          id="type"
          name="type"
          defaultValue={item?.type ?? ""}
          placeholder="e.g. Report, Policy Brief"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-slate-700">File URL</label>
        <input
          id="file"
          name="file"
          defaultValue={item?.file ?? ""}
          placeholder="/uploads/publication.pdf"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          id="image"
          name="image"
          defaultValue={item?.image ?? ""}
          placeholder="/uploads/cover.jpg"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
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
        <label htmlFor="author" className="block text-sm font-medium text-slate-700">Author</label>
        <input
          id="author"
          name="author"
          defaultValue={item?.author ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
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
          href="/admin/publications"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>
    </form>
  );
}
