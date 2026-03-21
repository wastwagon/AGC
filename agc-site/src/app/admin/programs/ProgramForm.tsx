"use client";

import { useFormStatus } from "react-dom";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { createProgram, updateProgram } from "./actions";

type ProgramFormProps = {
  item?: {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    order: number;
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

export function ProgramForm({ item }: ProgramFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updateProgram.bind(null, item.id) : createProgram;

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
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={item?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          id="image"
          name="image"
          defaultValue={item?.image ?? ""}
          placeholder="/uploads/program.jpg"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-slate-700">Order</label>
        <input
          id="order"
          name="order"
          type="number"
          min={0}
          defaultValue={item?.order ?? 0}
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
          href="/admin/programs"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>
    </form>
  );
}
