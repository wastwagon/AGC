"use client";

import { useFormStatus } from "react-dom";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { updatePageContent } from "./actions";

type PageContentFormProps = {
  item: {
    slug: string;
    title: string | null;
    status: string;
    heroSubtitle: string | null;
    heroTitle: string | null;
    intro: string | null;
    description: string | null;
    mission: string | null;
    objectivesTitle: string | null;
    objectivesContent: string | null;
    objectivesPrinciples: string | null;
    objectivesAgenda2063: string | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-lg bg-accent-500 px-6 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Update"}
    </button>
  );
}

export function PageContentForm({ item }: PageContentFormProps) {
  const action = updatePageContent.bind(null, item.slug);

  return (
    <form action={action} className="space-y-6">
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Slug *</label>
        <input
          id="slug"
          name="slug"
          defaultValue={item.slug}
          required
          readOnly
          className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-600"
        />
        <p className="mt-1 text-xs text-slate-500">Slug cannot be changed after creation.</p>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={item.title ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="heroTitle" className="block text-sm font-medium text-slate-700">Hero Title</label>
        <input
          id="heroTitle"
          name="heroTitle"
          defaultValue={item.heroTitle ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="heroSubtitle" className="block text-sm font-medium text-slate-700">Hero Subtitle</label>
        <textarea
          id="heroSubtitle"
          name="heroSubtitle"
          defaultValue={item.heroSubtitle ?? ""}
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="intro" className="block text-sm font-medium text-slate-700">Intro</label>
        <textarea
          id="intro"
          name="intro"
          defaultValue={item.intro ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={item.description ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="mission" className="block text-sm font-medium text-slate-700">Mission</label>
        <textarea
          id="mission"
          name="mission"
          defaultValue={item.mission ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="objectivesTitle" className="block text-sm font-medium text-slate-700">Objectives Title</label>
        <input
          id="objectivesTitle"
          name="objectivesTitle"
          defaultValue={item.objectivesTitle ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="objectivesContent" className="block text-sm font-medium text-slate-700">Objectives Content</label>
        <textarea
          id="objectivesContent"
          name="objectivesContent"
          defaultValue={item.objectivesContent ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="objectivesPrinciples" className="block text-sm font-medium text-slate-700">Objectives Principles</label>
        <textarea
          id="objectivesPrinciples"
          name="objectivesPrinciples"
          defaultValue={item.objectivesPrinciples ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="objectivesAgenda2063" className="block text-sm font-medium text-slate-700">Objectives Agenda 2063</label>
        <textarea
          id="objectivesAgenda2063"
          name="objectivesAgenda2063"
          defaultValue={item.objectivesAgenda2063 ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
        <select
          id="status"
          name="status"
          defaultValue={item.status ?? "published"}
          className="mt-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <AdminFormStickyActions>
        <SubmitButton />
        <a
          href="/admin/pages"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>
    </form>
  );
}
