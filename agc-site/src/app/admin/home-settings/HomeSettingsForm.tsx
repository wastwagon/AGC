"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { ImagePicker, type MediaItem } from "@/components/ImagePicker";
import type { HomePageCms } from "@/lib/home-page-data";
import { updateHomeSettings } from "./actions";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { useImageFieldPreview } from "@/hooks/useImageFieldPreview";

function textAreaLines(arr: string[]) {
  return arr.join("\n");
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

type MediaPickerTarget = "heroSlider" | "spotlightPortrait";

export function HomeSettingsForm({ home, saved = false }: { home: HomePageCms; saved?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = "agc:admin:home-settings:draft:v1";
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
  const [heroSliderImages, setHeroSliderImages] = useState(initialDraft?.heroSliderImages ?? textAreaLines(home.heroSliderImages));
  const [spotlightImage, setSpotlightImage] = useState(
    initialDraft?.spotlightImage ?? home.homeSpotlightStory.image ?? ""
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<MediaPickerTarget | null>(null);
  const { previewUrl: spotlightPreviewUrl, loading: spotlightPreviewLoading } = useImageFieldPreview(spotlightImage);
  const [mediaMap, setMediaMap] = useState<Record<string, string>>({});
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
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
        // preview lookup is optional
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function onSelectMedia(media: MediaItem) {
    if (pickerTarget === "heroSlider") {
      setHeroSliderImages((prev) => (prev.trim() ? `${prev}\n${media.id}` : media.id));
    } else if (pickerTarget === "spotlightPortrait") {
      setSpotlightImage(media.id);
    }
    setPickerOpen(false);
    setPickerTarget(null);
  }

  function setLines(next: string[]) {
    setHeroSliderImages(next.join("\n"));
  }

  function moveLine(index: number, direction: -1 | 1) {
    const lines = parseLines(heroSliderImages);
    const to = index + direction;
    if (to < 0 || to >= lines.length) return;
    const copy = [...lines];
    [copy[index], copy[to]] = [copy[to], copy[index]];
    setLines(copy);
  }

  function removeLine(index: number) {
    const lines = parseLines(heroSliderImages).filter((_, i) => i !== index);
    setLines(lines);
  }

  function reorderLines(from: number, to: number) {
    if (from === to) return;
    const lines = parseLines(heroSliderImages);
    if (from < 0 || to < 0 || from >= lines.length || to >= lines.length) return;
    const copy = [...lines];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setLines(copy);
  }

  const sliderPreviews = useMemo(() => {
    const lines = parseLines(heroSliderImages).slice(0, 12);
    return lines
      .map((line, index) => {
        if (line.startsWith("media-")) return { raw: line, url: mediaMap[line] || "" };
        return { raw: line, url: line, index };
      })
      .map((x, i) => ({ ...x, index: i }))
      .filter((x) => !!x.url);
  }, [heroSliderImages, mediaMap]);

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
    <form ref={formRef} action={updateHomeSettings} onInput={saveDraft} className="space-y-6">
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
        <h2 className="font-serif text-lg font-semibold text-slate-900">Hero</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="heroEyebrow" defaultValue={initialDraft?.heroEyebrow ?? home.heroContent.eyebrow} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Eyebrow" />
          <input name="heroTitle" defaultValue={initialDraft?.heroTitle ?? home.heroContent.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Title" />
          <textarea name="heroSubtitle" defaultValue={initialDraft?.heroSubtitle ?? home.heroContent.subtitle} rows={3} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Subtitle" />
          <input name="heroCta" defaultValue={initialDraft?.heroCta ?? home.heroContent.cta} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Primary CTA label" />
          <input name="heroCtaHref" defaultValue={initialDraft?.heroCtaHref ?? home.heroContent.ctaHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Primary CTA href" />
          <input name="heroCtaSecondary" defaultValue={initialDraft?.heroCtaSecondary ?? home.heroContent.ctaSecondary} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Secondary CTA label" />
          <input name="heroCtaSecondaryHref" defaultValue={initialDraft?.heroCtaSecondaryHref ?? home.heroContent.ctaSecondaryHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Secondary CTA href" />
          <div className="sm:col-span-2">
            <label htmlFor="heroBackgroundVideoSrc" className="mb-1 block text-sm font-medium text-slate-700">
              Hero background video (MP4 path)
            </label>
            <input
              id="heroBackgroundVideoSrc"
              name="heroBackgroundVideoSrc"
              defaultValue={initialDraft?.heroBackgroundVideoSrc ?? home.heroBackgroundVideoSrc ?? ""}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm"
              placeholder="/media/hero-video-background.mp4"
            />
            <p className="mt-1 text-xs text-slate-500">
              File must live under <code className="rounded bg-slate-100 px-1">public</code>. Clear the field to use the image slider only (no video).
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Hero slider images (one per line)</label>
            <div className="flex gap-2">
              <textarea
                name="heroSliderImages"
                value={heroSliderImages}
                onChange={(e) => setHeroSliderImages(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm"
                placeholder="media-id/url/path"
              />
              <button
                type="button"
                onClick={() => {
                  setPickerTarget("heroSlider");
                  setPickerOpen(true);
                }}
                className="inline-flex h-fit items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                title="Pick from Media Library"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
            {sliderPreviews.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sliderPreviews.map((item) => (
                  <div
                    key={`${item.raw}-${item.index}`}
                    draggable
                    onDragStart={() => {
                      setDragFrom(item.index);
                      setDragOver(item.index);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOver !== item.index) setDragOver(item.index);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFrom !== null) reorderLines(dragFrom, item.index);
                      setDragFrom(null);
                      setDragOver(null);
                    }}
                    onDragEnd={() => {
                      setDragFrom(null);
                      setDragOver(null);
                    }}
                    className={`rounded-lg border bg-slate-50 p-2 transition ${
                      dragOver === item.index ? "border-accent-400 ring-1 ring-accent-200" : "border-slate-200"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                      <Image
                        src={item.url}
                        alt={item.raw}
                        fill
                        className="object-cover"
                        unoptimized={preferUnoptimizedImage(item.url)}
                      />
                    </div>
                    <p className="mt-2 truncate text-xs text-slate-600">{item.raw}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="mr-1 text-[10px] uppercase tracking-wide text-slate-400">Drag</span>
                      <button
                        type="button"
                        onClick={() => moveLine(item.index, -1)}
                        className="inline-flex items-center rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLine(item.index, 1)}
                        className="inline-flex items-center rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLine(item.index)}
                        className="ml-auto inline-flex items-center rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Impact and newsletter band</h2>
        <div className="mt-4 grid gap-4">
          <input name="homeReachTitle" defaultValue={initialDraft?.homeReachTitle ?? home.homeReach.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Section title" />
          <textarea name="homeReachIntro" defaultValue={initialDraft?.homeReachIntro ?? home.homeReach.intro} rows={2} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Section intro" />
          <textarea name="homeImpactMethodology" defaultValue={initialDraft?.homeImpactMethodology ?? home.homeImpactMethodology} rows={2} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Impact methodology" />
          <textarea name="impactStats" defaultValue={initialDraft?.impactStats ?? home.homeImpactStats.map((s) => `${s.value}|${s.label}|${s.note}`).join("\n")} rows={5} className="rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm" placeholder="Impact stats lines: value|label|note" />
          <textarea name="heroPartnerStrip" defaultValue={initialDraft?.heroPartnerStrip ?? textAreaLines(home.heroPartnerStrip)} rows={4} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Partner lines (archival; not shown on homepage band)" />
          <textarea name="homePartnerBlurb" defaultValue={initialDraft?.homePartnerBlurb ?? home.homePartnerBlurb} rows={2} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="e.g. Stay up to date with our research and events >" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Testimonial and spotlight</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <textarea name="testimonialQuote" defaultValue={initialDraft?.testimonialQuote ?? home.homeTestimonial.quote} rows={4} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Quote" />
          <input name="testimonialName" defaultValue={initialDraft?.testimonialName ?? home.homeTestimonial.name} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Name" />
          <input name="testimonialInitials" defaultValue={initialDraft?.testimonialInitials ?? home.homeTestimonial.initials} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Initials" />
          <input name="testimonialTitle" defaultValue={initialDraft?.testimonialTitle ?? home.homeTestimonial.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Title" />
          <input name="testimonialOrganization" defaultValue={initialDraft?.testimonialOrganization ?? home.homeTestimonial.organization} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Organization" />
          <input name="spotlightLabel" defaultValue={initialDraft?.spotlightLabel ?? home.homeSpotlightStory.label} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight label" />
          <input name="spotlightHeadline" defaultValue={initialDraft?.spotlightHeadline ?? home.homeSpotlightStory.headline} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight headline" />
          <textarea name="spotlightParagraphs" defaultValue={initialDraft?.spotlightParagraphs ?? textAreaLines(home.homeSpotlightStory.paragraphs)} rows={4} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight paragraphs (one per line)" />
          <input name="spotlightName" defaultValue={initialDraft?.spotlightName ?? home.homeSpotlightStory.name} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight name" />
          <input name="spotlightRole" defaultValue={initialDraft?.spotlightRole ?? home.homeSpotlightStory.role} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight role" />
          <div className="sm:col-span-2">
            <label htmlFor="spotlightImage" className="mb-1 block text-sm font-medium text-slate-700">
              Spotlight portrait
            </label>
            <div className="flex gap-2">
              <input
                id="spotlightImage"
                name="spotlightImage"
                value={spotlightImage}
                onChange={(e) => setSpotlightImage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="media-… or /uploads/… (square)"
              />
              <button
                type="button"
                onClick={() => {
                  setPickerTarget("spotlightPortrait");
                  setPickerOpen(true);
                }}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                title="Pick or upload from Media Library"
              >
                <ImagePlus className="h-4 w-4" />
                Library
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Use <strong>Library</strong> to pick or upload. You can still paste a path manually.
            </p>
            {spotlightPreviewLoading ? (
              <p className="mt-2 text-xs text-slate-500">Loading preview…</p>
            ) : spotlightPreviewUrl ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-600">Preview</p>
                <div className="relative mt-1 h-40 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={spotlightPreviewUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={preferUnoptimizedImage(spotlightPreviewUrl)}
                  />
                </div>
              </div>
            ) : spotlightImage.trim() ? (
              <p className="mt-2 text-xs text-amber-800">
                No preview — for <code className="rounded bg-amber-100 px-1">media-…</code> IDs the file must exist in{" "}
                <Link href="/admin/media" className="font-medium underline">
                  Media Library
                </Link>
                .
              </p>
            ) : null}
          </div>
          <input
            name="spotlightInitials"
            defaultValue={initialDraft?.spotlightInitials ?? home.homeSpotlightStory.initials}
            className="rounded-lg border border-slate-300 px-4 py-2"
            placeholder="Initials (optional, legacy — not shown if image set)"
          />
          <input name="spotlightCtaLabel" defaultValue={initialDraft?.spotlightCtaLabel ?? home.homeSpotlightStory.ctaLabel} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight CTA label" />
          <input name="spotlightCtaHref" defaultValue={initialDraft?.spotlightCtaHref ?? home.homeSpotlightStory.ctaHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Spotlight CTA href" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Mid-page CTA band</h2>
        <p className="mt-1 text-sm text-slate-500">Accent section above events (formerly hard-coded on the homepage).</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="ctaBandEyebrow" defaultValue={home.homeCtaBand.eyebrow} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Eyebrow" />
          <input name="ctaBandTitle" defaultValue={home.homeCtaBand.title} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Headline" />
          <textarea name="ctaBandBody" defaultValue={home.homeCtaBand.body} rows={4} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Body" />
          <input name="ctaBandPrimaryCta" defaultValue={home.homeCtaBand.primaryCta} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Primary button label" />
          <input name="ctaBandPrimaryHref" defaultValue={home.homeCtaBand.primaryHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Primary href" />
          <input name="ctaBandSecondaryCta" defaultValue={home.homeCtaBand.secondaryCta} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Secondary button label" />
          <input name="ctaBandSecondaryHref" defaultValue={home.homeCtaBand.secondaryHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Secondary href" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Homepage — news teaser</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="homeNewsTitle" defaultValue={home.homeNewsTeaser.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Section title" />
          <input name="homeNewsSubtitle" defaultValue={home.homeNewsTeaser.subtitle} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Subtitle" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Homepage — APP Summit teaser</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="homeAppSummitTitle" defaultValue={home.homeAppSummitTeaser.title} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Title" />
          <input name="homeAppSummitDescription" defaultValue={home.homeAppSummitTeaser.description} className="sm:col-span-2 rounded-lg border border-slate-300 px-4 py-2" placeholder="Description" />
          <input name="homeAppSummitCtaLabel" defaultValue={home.homeAppSummitTeaser.ctaLabel} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Button label" />
          <input name="homeAppSummitCtaHref" defaultValue={home.homeAppSummitTeaser.ctaHref} className="rounded-lg border border-slate-300 px-4 py-2" placeholder="Button href" />
        </div>
      </section>

      <button type="submit" className="rounded-lg bg-accent-600 px-6 py-2 font-medium text-white hover:bg-accent-700">Save Home Settings</button>

      <ImagePicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setPickerTarget(null);
        }}
        onSelect={onSelectMedia}
      />
    </form>
  );
}
