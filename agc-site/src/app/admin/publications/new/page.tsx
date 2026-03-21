import { PublicationForm } from "../PublicationForm";

export const dynamic = "force-dynamic";

export default function AdminPublicationsNewPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">Add Publication</h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <PublicationForm />
      </div>
    </div>
  );
}
