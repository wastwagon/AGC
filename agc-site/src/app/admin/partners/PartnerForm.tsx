"use client";

import { useFormStatus } from "react-dom";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { createPartner, updatePartner } from "./actions";

type PartnerFormProps = {
  item?: {
    id: number;
    name: string;
    logo: string | null;
    url: string | null;
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

export function PartnerForm({ item }: PartnerFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updatePartner.bind(null, item.id) : createPartner;

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
        <label htmlFor="logo" className="block text-sm font-medium text-slate-700">Logo URL</label>
        <input
          id="logo"
          name="logo"
          defaultValue={item?.logo ?? ""}
          placeholder="/uploads/partner-logo.png"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-700">Website URL</label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={item?.url ?? ""}
          placeholder="https://example.com"
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
          href="/admin/partners"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>
    </form>
  );
}
