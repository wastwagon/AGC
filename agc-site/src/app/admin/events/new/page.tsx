import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default function AdminEventsNewPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">Add Event</h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <EventForm />
      </div>
    </div>
  );
}
