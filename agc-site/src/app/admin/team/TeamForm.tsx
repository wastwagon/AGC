"use client";

import { useFormStatus } from "react-dom";
import { createTeam, updateTeam } from "./actions";

type TeamFormProps = {
  item?: {
    id: number;
    name: string;
    role: string | null;
    bio: string | null;
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

export function TeamForm({ item }: TeamFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updateTeam.bind(null, item.id) : createTeam;

  return (
    <form action={action} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
        <input
          id="name"
          name="name"
          defaultValue={item?.name}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
        <input
          id="role"
          name="role"
          defaultValue={item?.role ?? ""}
          placeholder="e.g. Director"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={item?.bio ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          id="image"
          name="image"
          defaultValue={item?.image ?? ""}
          placeholder="/uploads/team.jpg"
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

      <div className="flex gap-4">
        <SubmitButton isEdit={!!isEdit} />
        <a
          href="/admin/team"
          className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
