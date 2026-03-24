"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { ImagePicker, type MediaItem } from "@/components/ImagePicker";
import { updateAboutSettings } from "./actions";

type AboutSettings = {
  title: string;
  hero: { subtitle: string };
  intro: string;
  description: string;
  mission: string;
  strategicObjectives: {
    title: string;
    content: string;
    principles: string;
    agenda2063: string;
  };
  heroImage?: string;
  sectionImage?: string;
};

export function AboutSettingsForm({ content, saved = false }: { content: AboutSettings; saved?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = "agc:admin:about-settings:draft:v1";
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
  const [heroImage, setHeroImage] = useState(
    initialDraft?.heroImage ?? content.heroImage ?? ""
  );
  const [sectionImage, setSectionImage] = useState(
    initialDraft?.sectionImage ?? content.sectionImage ?? ""
  );
  const [pickerTarget, setPickerTarget] = useState<"heroImage" | "sectionImage" | null>(null);
  const [mediaMap, setMediaMap] = useState<Record<string, string>>({});
  const [draftRestored] = useState(!!initialDraft);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const res = await fetch("/api/media");
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, string> = {};
        for (const item of (data.items || []) as MediaItem[]) {
          map[item.id] = item.url;
        }
        if (mounted) setMediaMap(map);
      } catch {
        // ignore preview fetch failures; picker still works
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const heroPreview = useMemo(() => {
    const raw = heroImage.trim();
    if (!raw) return "";
    if (raw.startsWith("media-")) return mediaMap[raw] || "";
    return raw;
  }, [heroImage, mediaMap]);

  const sectionPreview = useMemo(() => {
    const raw = sectionImage.trim();
    if (!raw) return "";
    if (raw.startsWith("media-")) return mediaMap[raw] || "";
    return raw;
  }, [sectionImage, mediaMap]);

  function onSelectMedia(media: MediaItem) {
    if (pickerTarget === "heroImage") setHeroImage(media.id);
    if (pickerTarget === "sectionImage") setSectionImage(media.id);
  }

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
    <form ref={formRef} action={updateAboutSettings} onInput={saveDraft} className="space-y-6">
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
        <h2 className="font-serif text-lg font-semibold text-slate-900">Core copy</h2>
        <div className="mt-4 grid gap-4">
          <input name="title" defaultValue={initialDraft?.title ?? content.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Page title" />
          <input name="heroSubtitle" defaultValue={initialDraft?.heroSubtitle ?? content.hero.subtitle} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Hero subtitle" />
          <textarea name="intro" defaultValue={initialDraft?.intro ?? content.intro} rows={3} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Intro" />
          <textarea name="description" defaultValue={initialDraft?.description ?? content.description} rows={5} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Description" />
          <textarea name="mission" defaultValue={initialDraft?.mission ?? content.mission} rows={4} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Mission" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Strategic objectives</h2>
        <div className="mt-4 grid gap-4">
          <input name="strategicTitle" defaultValue={initialDraft?.strategicTitle ?? content.strategicObjectives.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Section title" />
          <textarea name="strategicContent" defaultValue={initialDraft?.strategicContent ?? content.strategicObjectives.content} rows={5} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Strategic content" />
          <textarea name="strategicPrinciples" defaultValue={initialDraft?.strategicPrinciples ?? content.strategicObjectives.principles} rows={4} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Principles" />
          <textarea name="strategicAgenda2063" defaultValue={initialDraft?.strategicAgenda2063 ?? content.strategicObjectives.agenda2063} rows={4} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Agenda 2063 alignment" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Images</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex gap-2">
              <input name="heroImage" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2" placeholder="Hero image media-id/url/path" />
              <button type="button" onClick={() => setPickerTarget("heroImage")} className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50" title="Pick from Media Library">
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
            {heroPreview ? (
              <div className="mt-2 relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image src={heroPreview} alt="Hero preview" fill className="object-cover" unoptimized={heroPreview.endsWith(".svg")} />
              </div>
            ) : null}
          </div>
          <div>
            <div className="flex gap-2">
              <input name="sectionImage" value={sectionImage} onChange={(e) => setSectionImage(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2" placeholder="Section image media-id/url/path" />
              <button type="button" onClick={() => setPickerTarget("sectionImage")} className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50" title="Pick from Media Library">
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
            {sectionPreview ? (
              <div className="mt-2 relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image src={sectionPreview} alt="Section preview" fill className="object-cover" unoptimized={sectionPreview.endsWith(".svg")} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <button type="submit" className="rounded-lg bg-accent-600 px-6 py-2 font-medium text-white hover:bg-accent-700">Save About Settings</button>

      <ImagePicker open={pickerTarget !== null} onClose={() => setPickerTarget(null)} onSelect={onSelectMedia} />
    </form>
  );
}
