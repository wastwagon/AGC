"use client";

import { useFormStatus } from "react-dom";
import { createEvent, updateEvent } from "./actions";

type EventFormProps = {
  item?: {
    id: number;
    title: string;
    slug: string | null;
    description: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    image: string | null;
    link: string | null;
    category: string | null;
    eventType: string | null;
    venueName: string | null;
    venueAddress: string | null;
    capacity: number | null;
    registrationDeadline: Date | null;
    status: string;
  };
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-lg bg-accent-500 px-6 py-3 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Update" : "Create"}
    </button>
  );
}

export function EventForm({ item }: EventFormProps) {
  const isEdit = !!item;
  const action = isEdit ? updateEvent.bind(null, item.id) : createEvent;

  const formatDate = (d: Date) => d.toISOString().slice(0, 16);
  const formatDateOnly = (d: Date) => d.toISOString().slice(0, 10);

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
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Slug (optional, auto-generated)</label>
        <input
          id="slug"
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="my-event-slug"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={item?.description ?? ""}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">Start date *</label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            defaultValue={item ? formatDate(item.startDate) : ""}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">End date</label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={item?.endDate ? formatDate(item.endDate) : ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
          <input
            id="location"
            name="location"
            defaultValue={item?.location ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <input
            id="category"
            name="category"
            defaultValue={item?.category ?? ""}
            placeholder="e.g. summit, conference"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-slate-700">Venue name</label>
          <input
            id="venueName"
            name="venueName"
            defaultValue={item?.venueName ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="venueAddress" className="block text-sm font-medium text-slate-700">Venue address</label>
          <input
            id="venueAddress"
            name="venueAddress"
            defaultValue={item?.venueAddress ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
          <input
            id="image"
            name="image"
            defaultValue={item?.image ?? ""}
            placeholder="/uploads/event.jpg"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-slate-700">External link</label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={item?.link ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700">Capacity</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="0"
            defaultValue={item?.capacity ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="registrationDeadline" className="block text-sm font-medium text-slate-700">Registration deadline</label>
          <input
            id="registrationDeadline"
            name="registrationDeadline"
            type="date"
            defaultValue={item?.registrationDeadline ? formatDateOnly(item.registrationDeadline) : ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
          />
        </div>
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
          href="/admin/events"
          className="min-h-[44px] rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
