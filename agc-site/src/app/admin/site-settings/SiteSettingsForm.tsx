"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "./actions";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { ImagePicker } from "@/components/ImagePicker";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-lg bg-accent-500 px-6 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save settings"}
    </button>
  );
}

export function SiteSettingsForm({ settings, saved = false }: { settings: SiteSettings; saved?: boolean }) {
  const languagesText = settings.languages.map((x) => `${x.code}|${x.label}`).join("\n");
  const [logo, setLogo] = useState(settings.logo || "");
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = "agc:admin:site-settings:draft:v1";
  const initialDraft = useMemo(() => {
    if (typeof window === "undefined") return null as Record<string, string> | null;
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { values?: Record<string, string> };
      return parsed.values || null;
    } catch {
      return null;
    }
  }, []);
  const [draftRestored] = useState(!!initialDraft);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  function saveDraft() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const values: Record<string, string> = {};
    for (const [k, v] of fd.entries()) values[k] = String(v ?? "");
    const payload = { values, savedAt: new Date().toISOString() };
    window.localStorage.setItem(draftKey, JSON.stringify(payload));
    setLastSavedAt(payload.savedAt);
  }

  function clearDraft() {
    window.localStorage.removeItem(draftKey);
    window.location.reload();
  }

  useEffect(() => {
    if (!saved) return;
    window.localStorage.removeItem(draftKey);
  }, [saved, draftKey]);

  return (
    <form ref={formRef} action={updateSiteSettings} onInput={saveDraft} className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {draftRestored && !saved ? (
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
            Restored unsaved local draft.
          </span>
        ) : null}
        {lastSavedAt ? <span>Autosaved locally: {new Date(lastSavedAt).toLocaleTimeString()}</span> : null}
        <button type="button" onClick={clearDraft} className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-100">
          Clear local draft
        </button>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Organization profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Site name</label>
            <input id="name" name="name" defaultValue={initialDraft?.name ?? settings.name} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tagline" className="block text-sm font-medium text-slate-700">Tagline</label>
            <textarea id="tagline" name="tagline" defaultValue={initialDraft?.tagline ?? settings.tagline} required rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="logo" className="block text-sm font-medium text-slate-700">
              Header &amp; footer logo
            </label>
            <p className="mt-0.5 text-xs text-slate-500">Leave empty to use the default site logo file. Use a Media Library id or upload path.</p>
            <div className="mt-1 flex gap-2">
              <input
                id="logo"
                name="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="e.g. media-… or /uploads/logo.png"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
              />
              <button
                type="button"
                onClick={() => setLogoPickerOpen(true)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                title="Pick from Media Library"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
            <ImagePicker open={logoPickerOpen} onClose={() => setLogoPickerOpen(false)} onSelect={(item) => setLogo(item.id)} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
            <input id="phone" name="phone" defaultValue={initialDraft?.phone ?? settings.phone} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="officeHours" className="block text-sm font-medium text-slate-700">Office hours</label>
            <input id="officeHours" name="officeHours" defaultValue={initialDraft?.officeHours ?? settings.officeHours} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
            <input id="address" name="address" defaultValue={initialDraft?.address ?? settings.address} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Email inboxes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="emailPrograms" className="block text-sm font-medium text-slate-700">Programs</label>
            <input id="emailPrograms" type="email" name="emailPrograms" defaultValue={initialDraft?.emailPrograms ?? settings.email.programs} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="emailMedia" className="block text-sm font-medium text-slate-700">Media</label>
            <input id="emailMedia" type="email" name="emailMedia" defaultValue={initialDraft?.emailMedia ?? settings.email.media} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="emailInfo" className="block text-sm font-medium text-slate-700">Info</label>
            <input id="emailInfo" type="email" name="emailInfo" defaultValue={initialDraft?.emailInfo ?? settings.email.info} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Social links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="socialLinkedin" className="block text-sm font-medium text-slate-700">LinkedIn</label>
            <input id="socialLinkedin" type="url" name="socialLinkedin" defaultValue={initialDraft?.socialLinkedin ?? settings.social.linkedin} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="socialTwitter" className="block text-sm font-medium text-slate-700">Twitter / X</label>
            <input id="socialTwitter" type="url" name="socialTwitter" defaultValue={initialDraft?.socialTwitter ?? settings.social.twitter} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="socialInstagram" className="block text-sm font-medium text-slate-700">Instagram</label>
            <input id="socialInstagram" type="url" name="socialInstagram" defaultValue={initialDraft?.socialInstagram ?? settings.social.instagram} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
          <div>
            <label htmlFor="socialFacebook" className="block text-sm font-medium text-slate-700">Facebook</label>
            <input id="socialFacebook" type="url" name="socialFacebook" defaultValue={initialDraft?.socialFacebook ?? settings.social.facebook} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Languages</h2>
        <label htmlFor="languages" className="mt-3 block text-sm font-medium text-slate-700">
          One per line as <code>code|label</code> (example: <code>en|English</code>)
        </label>
        <textarea id="languages" name="languages" defaultValue={initialDraft?.languages ?? languagesText} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm" />
      </section>

      <AdminFormStickyActions>
        <SubmitButton />
      </AdminFormStickyActions>
    </form>
  );
}
