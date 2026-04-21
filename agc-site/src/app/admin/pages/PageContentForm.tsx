"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical, ImagePlus } from "lucide-react";
import { ImagePicker, type MediaItem } from "@/components/ImagePicker";
import { AdminFormStickyActions } from "../_components/AdminFormStickyActions";
import { AdminFormPreviewLink } from "../_components/AdminFormPreviewLink";
import { publicPathForPageSlug } from "@/lib/admin-public-preview";
import { updatePageContent } from "./actions";

/** Root keys use the quick editor; nested paths support Get Involved sub-page heroes. */
type PickerTarget = null | "heroImage" | "sectionImage" | { nested: string[] };

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
    contentJson?: unknown;
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
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function PageContentForm({ item }: PageContentFormProps) {
  const action = updatePageContent.bind(null, item.slug);
  const initialJson = useMemo(
    () => (item.contentJson ? JSON.stringify(item.contentJson, null, 2) : ""),
    [item.contentJson]
  );
  const draftStorageKey = useMemo(
    () => `agc:page-content:draft:${item.slug}:contentJson`,
    [item.slug]
  );
  /** Server and first client paint must match — restore local draft in useEffect only (avoids hydration mismatch). */
  const [jsonText, setJsonText] = useState(initialJson);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [dragDayIdx, setDragDayIdx] = useState<number | null>(null);
  const [dragLegalIdx, setDragLegalIdx] = useState<number | null>(null);
  const [dragSession, setDragSession] = useState<{ dayIdx: number; sessionIdx: number } | null>(null);
  const [collapsedDays, setCollapsedDays] = useState<number[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<number[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { value?: string; savedAt?: string };
      if (typeof parsed.savedAt === "string") {
        setLastSavedAt(parsed.savedAt);
      }
      if (typeof parsed.value === "string" && parsed.value !== initialJson) {
        setJsonText(parsed.value);
        setDraftRestored(true);
      }
    } catch {
      // ignore invalid draft
    }
  }, [draftStorageKey, initialJson]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const payload = JSON.stringify({
          value: jsonText,
          savedAt: new Date().toISOString(),
        });
        window.localStorage.setItem(draftStorageKey, payload);
        setLastSavedAt(new Date().toISOString());
      } catch {
        // Best effort only; avoid blocking editing.
      }
    }, 500);
    return () => window.clearTimeout(t);
  }, [draftStorageKey, jsonText]);

  const { parsedJson, jsonError } = useMemo(() => {
    if (!jsonText.trim()) {
      return { parsedJson: {} as Record<string, unknown>, jsonError: null as string | null };
    }
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {
          parsedJson: {} as Record<string, unknown>,
          jsonError:
            "Use one `{ … }` block for all fields here—not a list that starts with `[`." as string | null,
        };
      }
      return { parsedJson: parsed as Record<string, unknown>, jsonError: null as string | null };
    } catch {
      return {
        parsedJson: {} as Record<string, unknown>,
        jsonError:
          "We couldn’t read that text. Check brackets, commas, and quotes—or use the fields above instead." as string | null,
      };
    }
  }, [jsonText]);

  const quickValues = {
    heroImage: typeof parsedJson.heroImage === "string" ? parsedJson.heroImage : "",
    sectionImage: typeof parsedJson.sectionImage === "string" ? parsedJson.sectionImage : "",
    subtitle: typeof parsedJson.subtitle === "string" ? parsedJson.subtitle : "",
    applyIntro: typeof parsedJson.applyIntro === "string" ? parsedJson.applyIntro : "",
  };

  function updateJsonObject(next: Record<string, unknown>) {
    setJsonText(JSON.stringify(next, null, 2));
  }

  function updateJsonField(key: string, value: string) {
    const next = { ...parsedJson };
    if (value.trim().length === 0) delete next[key];
    else next[key] = value;
    updateJsonObject(next);
  }

  function updateJsonFieldBoolean(key: string, value: boolean) {
    const next = { ...parsedJson };
    next[key] = value;
    updateJsonObject(next);
  }

  function getNestedString(path: string[]): string {
    let cur: unknown = parsedJson;
    for (const p of path) {
      if (!cur || typeof cur !== "object" || Array.isArray(cur)) return "";
      cur = (cur as Record<string, unknown>)[p];
    }
    return typeof cur === "string" ? cur : "";
  }

  function updateNestedString(path: string[], value: string) {
    const next = structuredClone(parsedJson) as Record<string, unknown>;
    let cur: Record<string, unknown> = next;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const existing = cur[p];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        cur[p] = {};
      }
      cur = cur[p] as Record<string, unknown>;
    }
    const leaf = path[path.length - 1];
    /** Persist `""` so CMS JSON overrides deepMerge fallbacks; omitting keys would keep repo defaults. */
    cur[leaf] = value.trim() === "" ? "" : value;
    updateJsonObject(next);
  }

  function getNestedArray(path: string[]): Record<string, unknown>[] {
    let cur: unknown = parsedJson;
    for (const p of path) {
      if (!cur || typeof cur !== "object" || Array.isArray(cur)) return [];
      cur = (cur as Record<string, unknown>)[p];
    }
    return Array.isArray(cur) ? (cur.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x))) : [];
  }

  function updateNestedArray(path: string[], updater: (arr: Record<string, unknown>[]) => Record<string, unknown>[]) {
    const next = structuredClone(parsedJson) as Record<string, unknown>;
    let cur: Record<string, unknown> = next;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const existing = cur[p];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        cur[p] = {};
      }
      cur = cur[p] as Record<string, unknown>;
    }
    const leaf = path[path.length - 1];
    const existingLeaf = cur[leaf];
    const arr = Array.isArray(existingLeaf)
      ? existingLeaf.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x))
      : [];
    cur[leaf] = updater(arr);
    updateJsonObject(next);
  }

  function reorderNestedArray(path: string[], from: number, to: number) {
    if (from === to) return;
    updateNestedArray(path, (arr) => {
      if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
      const copy = [...arr];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  function toggleCollapsedDay(index: number) {
    setCollapsedDays((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  }

  function toggleCollapsedSection(index: number) {
    setCollapsedSections((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  }

  function clearLocalDraft() {
    try {
      window.localStorage.removeItem(draftStorageKey);
    } catch {
      // Ignore localStorage failures.
    }
    setJsonText(initialJson);
    setDraftRestored(false);
    setLastSavedAt(null);
  }

  function getNestedStringArray(path: string[]): string[] {
    let cur: unknown = parsedJson;
    for (const p of path) {
      if (!cur || typeof cur !== "object" || Array.isArray(cur)) return [];
      cur = (cur as Record<string, unknown>)[p];
    }
    return Array.isArray(cur) ? cur.filter((x): x is string => typeof x === "string") : [];
  }

  function updateNestedStringArray(path: string[], values: string[]) {
    const next = structuredClone(parsedJson) as Record<string, unknown>;
    let cur: Record<string, unknown> = next;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const existing = cur[p];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        cur[p] = {};
      }
      cur = cur[p] as Record<string, unknown>;
    }
    const leaf = path[path.length - 1];
    cur[leaf] = values;
    updateJsonObject(next);
  }

  const legalSections = getNestedArray(["sections"]);
  const summitDays = getNestedArray(["agenda", "days"]);
  const ourWorkAdvisoryCards = getNestedArray(["advisory", "cards"]);
  const getInvolvedOpportunities = getNestedArray(["opportunities"]);
  const getInvolvedEvents = getNestedArray(["bottomSection", "upcomingEvents", "events"]);

  function onSelectMedia(media: MediaItem) {
    if (!pickerTarget) return;
    if (pickerTarget === "heroImage" || pickerTarget === "sectionImage") {
      updateJsonField(pickerTarget, media.id);
    } else {
      updateNestedString(pickerTarget.nested, media.id);
    }
    setPickerTarget(null);
  }

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

      <div>
        <label htmlFor="contentJson" className="block text-sm font-medium text-slate-700">
          Structured page data (advanced)
        </label>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {draftRestored ? (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
              Restored unsaved local draft for this page.
            </span>
          ) : null}
          {lastSavedAt ? (
            <span>Autosaved locally: {new Date(lastSavedAt).toLocaleTimeString()}</span>
          ) : null}
          <button
            type="button"
            onClick={clearLocalDraft}
            className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-100"
          >
            Clear local draft
          </button>
        </div>
        {item.slug.startsWith("our-work-") && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Our Work helper</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Section title</label>
                <input
                  type="text"
                  value={typeof parsedJson.title === "string" ? parsedJson.title : ""}
                  onChange={(e) => updateJsonField("title", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Section subtitle</label>
                <input
                  type="text"
                  value={typeof parsedJson.subtitle === "string" ? parsedJson.subtitle : ""}
                  onChange={(e) => updateJsonField("subtitle", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Section description</label>
              <textarea
                value={typeof parsedJson.description === "string" ? parsedJson.description : ""}
                onChange={(e) => updateJsonField("description", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
        {item.slug === "our-work" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Our Work main page helper</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Hero title</label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Large heading on the hero image (defaults to the breadcrumb “Our Work” label if left empty).
                </p>
                <input
                  type="text"
                  value={getNestedString(["hero", "title"])}
                  onChange={(e) => updateNestedString(["hero", "title"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Hero subtitle</label>
                <input
                  type="text"
                  value={getNestedString(["hero", "subtitle"])}
                  onChange={(e) => updateNestedString(["hero", "subtitle"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">Tab label: Programs</label>
                <input
                  type="text"
                  value={getNestedString(["tabs", "programs"])}
                  onChange={(e) => updateNestedString(["tabs", "programs"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Tab label: Projects</label>
                <input
                  type="text"
                  value={getNestedString(["tabs", "projects"])}
                  onChange={(e) => updateNestedString(["tabs", "projects"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Tab label: Advisory</label>
                <input
                  type="text"
                  value={getNestedString(["tabs", "advisory"])}
                  onChange={(e) => updateNestedString(["tabs", "advisory"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Homepage pillar cards</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Three cards under the hero overlap the hero visually (higher z-index). Titles and descriptions come from the{" "}
                <strong className="font-medium text-slate-700">programs</strong>, <strong className="font-medium text-slate-700">projects</strong>, and{" "}
                <strong className="font-medium text-slate-700">advisory</strong> blocks on this page. Use Media Library IDs or{" "}
                <code className="rounded bg-white px-0.5">/uploads/…</code> paths for images.
              </p>
              <label className="mt-2 block text-xs font-medium text-slate-600">Intro line (optional)</label>
              <input
                type="text"
                value={typeof parsedJson.homePillarIntro === "string" ? parsedJson.homePillarIntro : ""}
                onChange={(e) => updateJsonField("homePillarIntro", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="e.g. Three ways we show up alongside partners"
              />
              <label className="mt-2 block text-xs font-medium text-slate-600">Card link label (optional)</label>
              <input
                type="text"
                value={typeof parsedJson.pillarReadMoreLabel === "string" ? parsedJson.pillarReadMoreLabel : ""}
                onChange={(e) => updateJsonField("pillarReadMoreLabel", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="e.g. Read more"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Programs card image</label>
                  <input
                    type="text"
                    value={getNestedString(["pillarCardImages", "programs"])}
                    onChange={(e) => updateNestedString(["pillarCardImages", "programs"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                    placeholder="media-… or /uploads/…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Projects card image</label>
                  <input
                    type="text"
                    value={getNestedString(["pillarCardImages", "projects"])}
                    onChange={(e) => updateNestedString(["pillarCardImages", "projects"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                    placeholder="media-… or /uploads/…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Advisory card image</label>
                  <input
                    type="text"
                    value={getNestedString(["pillarCardImages", "advisory"])}
                    onChange={(e) => updateNestedString(["pillarCardImages", "advisory"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                    placeholder="media-… or /uploads/…"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Approach section</p>
              <div className="mt-2 grid gap-2">
                <input
                  type="text"
                  value={getNestedString(["approach", "title"])}
                  onChange={(e) => updateNestedString(["approach", "title"], e.target.value)}
                  placeholder="Approach title"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                />
                <textarea
                  value={getNestedString(["approach", "intro"])}
                  onChange={(e) => updateNestedString(["approach", "intro"], e.target.value)}
                  rows={3}
                  placeholder="Approach intro"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                />
                <input
                  type="text"
                  value={getNestedString(["approach", "objectivesLead"])}
                  onChange={(e) => updateNestedString(["approach", "objectivesLead"], e.target.value)}
                  placeholder="Objectives lead text"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                />
                <textarea
                  value={getNestedStringArray(["approach", "objectives"]).join("\n")}
                  onChange={(e) =>
                    updateNestedStringArray(
                      ["approach", "objectives"],
                      e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={5}
                  placeholder="Objectives (one line per objective)"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Advisory cards</p>
                <button
                  type="button"
                  onClick={() => updateNestedArray(["advisory", "cards"], (arr) => [...arr, { title: "", description: "" }])}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  + Add card
                </button>
              </div>
              <div className="space-y-2">
                {ourWorkAdvisoryCards.map((card, idx) => (
                  <div key={idx} className="rounded-md border border-slate-200 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={typeof card.title === "string" ? card.title : ""}
                        onChange={(e) =>
                          updateNestedArray(["advisory", "cards"], (arr) =>
                            arr.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                          )
                        }
                        placeholder="Card title"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => updateNestedArray(["advisory", "cards"], (arr) => arr.filter((_, i) => i !== idx))}
                        className="justify-self-end rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={typeof card.description === "string" ? card.description : ""}
                      onChange={(e) =>
                        updateNestedArray(["advisory", "cards"], (arr) =>
                          arr.map((c, i) => (i === idx ? { ...c, description: e.target.value } : c))
                        )
                      }
                      rows={3}
                      placeholder="Card description"
                      className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {item.slug === "site-settings" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Global site settings</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Site name</label>
                <input
                  type="text"
                  value={typeof parsedJson.name === "string" ? parsedJson.name : ""}
                  onChange={(e) => updateJsonField("name", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Phone</label>
                <input
                  type="text"
                  value={typeof parsedJson.phone === "string" ? parsedJson.phone : ""}
                  onChange={(e) => updateJsonField("phone", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Tagline</label>
              <textarea
                value={typeof parsedJson.tagline === "string" ? parsedJson.tagline : ""}
                onChange={(e) => updateJsonField("tagline", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Address</label>
              <input
                type="text"
                value={typeof parsedJson.address === "string" ? parsedJson.address : ""}
                onChange={(e) => updateJsonField("address", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Office hours</label>
              <input
                type="text"
                value={typeof parsedJson.officeHours === "string" ? parsedJson.officeHours : ""}
                onChange={(e) => updateJsonField("officeHours", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">Programs email</label>
                <input
                  type="email"
                  value={getNestedString(["email", "programs"])}
                  onChange={(e) => updateNestedString(["email", "programs"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Media email</label>
                <input
                  type="email"
                  value={getNestedString(["email", "media"])}
                  onChange={(e) => updateNestedString(["email", "media"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Info email</label>
                <input
                  type="email"
                  value={getNestedString(["email", "info"])}
                  onChange={(e) => updateNestedString(["email", "info"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">LinkedIn</label>
                <input
                  type="url"
                  value={getNestedString(["social", "linkedin"])}
                  onChange={(e) => updateNestedString(["social", "linkedin"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Twitter/X</label>
                <input
                  type="url"
                  value={getNestedString(["social", "twitter"])}
                  onChange={(e) => updateNestedString(["social", "twitter"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Instagram</label>
                <input
                  type="url"
                  value={getNestedString(["social", "instagram"])}
                  onChange={(e) => updateNestedString(["social", "instagram"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Facebook</label>
                <input
                  type="url"
                  value={getNestedString(["social", "facebook"])}
                  onChange={(e) => updateNestedString(["social", "facebook"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}
        {item.slug === "get-involved" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Get Involved helper</p>
            <div>
              <label className="block text-xs font-medium text-slate-600">Page intro</label>
              <textarea
                value={typeof parsedJson.intro === "string" ? parsedJson.intro : ""}
                onChange={(e) => updateJsonField("intro", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Sub-page hero images</p>
              <p className="mt-1 text-xs text-slate-500">
                Backgrounds for <code className="text-[0.7rem]">/get-involved/join-us</code>,{" "}
                <code className="text-[0.7rem]">/get-involved/partnership</code>, and{" "}
                <code className="text-[0.7rem]">/get-involved/volunteer</code>. Use a media id (e.g.{" "}
                <code className="text-[0.7rem]">media-…</code>) or <code className="text-[0.7rem]">/uploads/…</code>.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { label: "Work with us (join-us)", path: ["joinUs", "heroImage"] as const },
                    { label: "Partnership", path: ["partnership", "heroImage"] as const },
                    { label: "Volunteer", path: ["volunteer", "heroImage"] as const },
                  ] as const
                ).map(({ label, path }) => (
                  <div key={path.join(".")}>
                    <label className="block text-xs font-medium text-slate-600">{label}</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={getNestedString([...path])}
                        onChange={(e) => updateNestedString([...path], e.target.value)}
                        placeholder="media-… or /uploads/…"
                        className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setPickerTarget({ nested: [...path] })}
                        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                        title="Pick from Media Library"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Sub-page text</p>
              <p className="mt-1 text-xs text-slate-500">
                Copy for the three detail routes below. The main hub cards are edited in <strong>Opportunities</strong>{" "}
                further down.
              </p>
              <div className="mt-3 space-y-2">
                {(
                  [
                    { key: "joinUs", label: "Work with us (/get-involved/join-us)", ctaHrefKey: "contactHref" as const },
                    { key: "partnership", label: "Partnership (/get-involved/partnership)", ctaHrefKey: "contactHref" as const },
                    { key: "volunteer", label: "Volunteer (/get-involved/volunteer)", ctaHrefKey: "applicationHref" as const },
                  ] as const
                ).map(({ key, label, ctaHrefKey }) => (
                  <details key={key} className="group rounded-md border border-slate-200 bg-slate-50/80 open:bg-white">
                    <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90" />
                        {label}
                      </span>
                    </summary>
                    <div className="space-y-2 border-t border-slate-200 px-3 pb-3 pt-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Hero title</label>
                          <input
                            type="text"
                            value={getNestedString([key, "title"])}
                            onChange={(e) => updateNestedString([key, "title"], e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Hero subtitle</label>
                          <input
                            type="text"
                            value={getNestedString([key, "subtitle"])}
                            onChange={(e) => updateNestedString([key, "subtitle"], e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">Intro</label>
                        <textarea
                          value={getNestedString([key, "intro"])}
                          onChange={(e) => updateNestedString([key, "intro"], e.target.value)}
                          rows={3}
                          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">Description</label>
                        <textarea
                          value={getNestedString([key, "description"])}
                          onChange={(e) => updateNestedString([key, "description"], e.target.value)}
                          rows={4}
                          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">Bullet list (one line per item)</label>
                        <textarea
                          value={getNestedStringArray([key, "items"]).join("\n")}
                          onChange={(e) =>
                            updateNestedStringArray(
                              [key, "items"],
                              e.target.value
                                .split("\n")
                                .map((line) => line.trim())
                                .filter(Boolean)
                            )
                          }
                          rows={5}
                          placeholder="One bullet per line"
                          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Primary button label (CTA)</label>
                          <input
                            type="text"
                            value={getNestedString([key, "cta"])}
                            onChange={(e) => updateNestedString([key, "cta"], e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">
                            {ctaHrefKey === "applicationHref" ? "Apply / primary link (href)" : "Contact / primary link (href)"}
                          </label>
                          <input
                            type="text"
                            value={getNestedString([key, ctaHrefKey])}
                            onChange={(e) => updateNestedString([key, ctaHrefKey], e.target.value)}
                            placeholder="/contact or /applications"
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Get In Touch title</label>
                <input
                  type="text"
                  value={getNestedString(["bottomSection", "getInTouch", "title"])}
                  onChange={(e) => updateNestedString(["bottomSection", "getInTouch", "title"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Upcoming Events title</label>
                <input
                  type="text"
                  value={getNestedString(["bottomSection", "upcomingEvents", "title"])}
                  onChange={(e) => updateNestedString(["bottomSection", "upcomingEvents", "title"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Opportunities</p>
                <button
                  type="button"
                  onClick={() =>
                    updateNestedArray(["opportunities"], (arr) => [
                      ...arr,
                      { id: `item-${arr.length + 1}`, title: "", description: "", items: [], cta: "", href: "", pageHref: "" },
                    ])
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  + Add opportunity
                </button>
              </div>
              <div className="space-y-2">
                {getInvolvedOpportunities.map((opp, idx) => (
                  <div key={idx} className="rounded-md border border-slate-200 p-3">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <input
                        value={typeof opp.id === "string" ? opp.id : ""}
                        onChange={(e) =>
                          updateNestedArray(["opportunities"], (arr) =>
                            arr.map((o, i) => (i === idx ? { ...o, id: e.target.value } : o))
                          )
                        }
                        placeholder="id"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <input
                        value={typeof opp.title === "string" ? opp.title : ""}
                        onChange={(e) =>
                          updateNestedArray(["opportunities"], (arr) =>
                            arr.map((o, i) => (i === idx ? { ...o, title: e.target.value } : o))
                          )
                        }
                        placeholder="title"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => updateNestedArray(["opportunities"], (arr) => arr.filter((_, i) => i !== idx))}
                        className="justify-self-end rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={typeof opp.description === "string" ? opp.description : ""}
                      onChange={(e) =>
                        updateNestedArray(["opportunities"], (arr) =>
                          arr.map((o, i) => (i === idx ? { ...o, description: e.target.value } : o))
                        )
                      }
                      rows={2}
                      placeholder="Description"
                      className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <input
                        value={typeof opp.cta === "string" ? opp.cta : ""}
                        onChange={(e) =>
                          updateNestedArray(["opportunities"], (arr) =>
                            arr.map((o, i) => (i === idx ? { ...o, cta: e.target.value } : o))
                          )
                        }
                        placeholder="CTA label"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <input
                        value={typeof opp.href === "string" ? opp.href : ""}
                        onChange={(e) =>
                          updateNestedArray(["opportunities"], (arr) =>
                            arr.map((o, i) => (i === idx ? { ...o, href: e.target.value } : o))
                          )
                        }
                        placeholder="CTA href"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <input
                        value={typeof opp.pageHref === "string" ? opp.pageHref : ""}
                        onChange={(e) =>
                          updateNestedArray(["opportunities"], (arr) =>
                            arr.map((o, i) => (i === idx ? { ...o, pageHref: e.target.value } : o))
                          )
                        }
                        placeholder="Detail page href"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Upcoming events list</p>
                <button
                  type="button"
                  onClick={() =>
                    updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) => [
                      ...arr,
                      { startDate: "", endDate: "", label: "", registerHref: "/events" },
                    ])
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  + Add event
                </button>
              </div>
              <div className="space-y-2">
                {getInvolvedEvents.map((evt, idx) => (
                  <div key={idx} className="grid gap-2 rounded-md border border-slate-200 p-3 sm:grid-cols-4">
                    <input
                      value={typeof evt.startDate === "string" ? evt.startDate : ""}
                      onChange={(e) =>
                        updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) =>
                          arr.map((x, i) => (i === idx ? { ...x, startDate: e.target.value } : x))
                        )
                      }
                      placeholder="Start date"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    <input
                      value={typeof evt.endDate === "string" ? evt.endDate : ""}
                      onChange={(e) =>
                        updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) =>
                          arr.map((x, i) => (i === idx ? { ...x, endDate: e.target.value } : x))
                        )
                      }
                      placeholder="End date"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    <input
                      value={typeof evt.label === "string" ? evt.label : ""}
                      onChange={(e) =>
                        updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) =>
                          arr.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x))
                        )
                      }
                      placeholder="Label"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        value={typeof evt.registerHref === "string" ? evt.registerHref : ""}
                        onChange={(e) =>
                          updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) =>
                            arr.map((x, i) => (i === idx ? { ...x, registerHref: e.target.value } : x))
                          )
                        }
                        placeholder="Register href"
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateNestedArray(["bottomSection", "upcomingEvents", "events"], (arr) => arr.filter((_, i) => i !== idx))
                        }
                        className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {item.slug === "events" && (
          <div className="mb-3 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Past events archive (public /events/past)
            </p>
            <p className="text-xs text-slate-600">
              Copy for the archive filters, search, and list UI. Stored in{" "}
              <code className="rounded bg-white px-1 ring-1 ring-slate-200">content_json.pastArchive</code> and the
              empty-state line in{" "}
              <code className="rounded bg-white px-1 ring-1 ring-slate-200">content_json.gridEmpty.past</code>. The
              route hero uses the main Hero fields on this page when set.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["title", "In-page archive heading"],
                  ["subtitle", "In-page archive intro"],
                  ["searchPlaceholder", "Search placeholder"],
                  ["filterBy", "Filter section title"],
                  ["eventCheckboxLabel", "Event checkbox label"],
                  ["topicLabel", "Topic filter (dropdown label)"],
                  ["regionLabel", "Region filter (dropdown label)"],
                  ["listFilterPlaceholder", "Placeholder: topic/region list filter"],
                  ["dateHeading", "Date filter heading"],
                  ["dateAll", "Date option: All dates"],
                  ["date30d", "Date option: Past 30 days"],
                  ["date6m", "Date option: Past 6 months"],
                  ["date1y", "Date option: Last year"],
                  ["resultsFoundSuffix", "Suffix after result count"],
                  ["showMore", "“Show more” button label"],
                  ["resultsAtATime", "Pagination helper (e.g. results at a time)"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-600">{label}</label>
                  <input
                    type="text"
                    value={getNestedString(["pastArchive", key])}
                    onChange={(e) => updateNestedString(["pastArchive", key], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Topic empty state</label>
                <textarea
                  value={getNestedString(["pastArchive", "topicEmpty"])}
                  onChange={(e) => updateNestedString(["pastArchive", "topicEmpty"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Region modal empty state (no location/venue on events)
                </label>
                <textarea
                  value={getNestedString(["pastArchive", "filterComingSoon"])}
                  onChange={(e) => updateNestedString(["pastArchive", "filterComingSoon"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Empty results (no matching past events)</label>
              <textarea
                value={getNestedString(["gridEmpty", "past"])}
                onChange={(e) => updateNestedString(["gridEmpty", "past"], e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
        {item.slug === "app-summit" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">APP Summit helper</p>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
                checked={parsedJson.programmeAgendaVisible !== false}
                onChange={(e) => updateJsonFieldBoolean("programmeAgendaVisible", e.target.checked)}
              />
              <span>
                <span className="font-medium text-slate-900">Show Programme / APPS agenda</span>
                <span className="mt-1 block text-xs font-normal text-slate-600">
                  Uncheck to hide the day tabs and schedule block on the public site. The rest of the APP Summit page
                  stays visible.
                </span>
              </span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">About section eyebrow</label>
                <input
                  type="text"
                  value={typeof parsedJson.aboutSectionEyebrow === "string" ? parsedJson.aboutSectionEyebrow : ""}
                  onChange={(e) => updateJsonField("aboutSectionEyebrow", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">About section heading</label>
                <input
                  type="text"
                  value={typeof parsedJson.aboutSectionHeading === "string" ? parsedJson.aboutSectionHeading : ""}
                  onChange={(e) => updateJsonField("aboutSectionHeading", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Label: Date (detail row)</label>
                <input
                  type="text"
                  value={typeof parsedJson.detailLabelDate === "string" ? parsedJson.detailLabelDate : ""}
                  onChange={(e) => updateJsonField("detailLabelDate", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Label: Location</label>
                <input
                  type="text"
                  value={typeof parsedJson.detailLabelLocation === "string" ? parsedJson.detailLabelLocation : ""}
                  onChange={(e) => updateJsonField("detailLabelLocation", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Label: Participants</label>
                <input
                  type="text"
                  value={typeof parsedJson.detailLabelParticipants === "string" ? parsedJson.detailLabelParticipants : ""}
                  onChange={(e) => updateJsonField("detailLabelParticipants", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Programme section eyebrow</label>
                <input
                  type="text"
                  value={typeof parsedJson.programmeEyebrow === "string" ? parsedJson.programmeEyebrow : ""}
                  onChange={(e) => updateJsonField("programmeEyebrow", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Day tab prefix</label>
                <input
                  type="text"
                  value={typeof parsedJson.dayTabPrefix === "string" ? parsedJson.dayTabPrefix : ""}
                  onChange={(e) => updateJsonField("dayTabPrefix", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Day (space after if needed)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Contact section CTA label</label>
                <input
                  type="text"
                  value={typeof parsedJson.contactSectionCtaLabel === "string" ? parsedJson.contactSectionCtaLabel : ""}
                  onChange={(e) => updateJsonField("contactSectionCtaLabel", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Hero image alt text</label>
                <input
                  type="text"
                  value={typeof parsedJson.heroImageAlt === "string" ? parsedJson.heroImageAlt : ""}
                  onChange={(e) => updateJsonField("heroImageAlt", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">About intro (APPS vision & aims)</label>
              <textarea
                value={typeof parsedJson.intro === "string" ? parsedJson.intro : ""}
                onChange={(e) => updateJsonField("intro", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Inaugural edition paragraph</label>
              <textarea
                value={typeof parsedJson.inauguralParagraph === "string" ? parsedJson.inauguralParagraph : ""}
                onChange={(e) => updateJsonField("inauguralParagraph", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">Date</label>
                <input
                  type="text"
                  value={getNestedString(["details", "date"])}
                  onChange={(e) => updateNestedString(["details", "date"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Location</label>
                <input
                  type="text"
                  value={getNestedString(["details", "location"])}
                  onChange={(e) => updateNestedString(["details", "location"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Participants</label>
                <input
                  type="text"
                  value={getNestedString(["details", "participants"])}
                  onChange={(e) => updateNestedString(["details", "participants"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Registration CTA label</label>
                <input
                  type="text"
                  value={getNestedString(["registration", "cta"])}
                  onChange={(e) => updateNestedString(["registration", "cta"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Registration CTA href</label>
                <input
                  type="text"
                  value={getNestedString(["registration", "href"])}
                  onChange={(e) => updateNestedString(["registration", "href"], e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Contact note</label>
              <textarea
                value={typeof parsedJson.contactNote === "string" ? parsedJson.contactNote : ""}
                onChange={(e) => updateJsonField("contactNote", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Agenda days</p>
                <button
                  type="button"
                  onClick={() =>
                    updateNestedArray(["agenda", "days"], (arr) => [
                      ...arr,
                      { day: String(arr.length + 1), date: "", sessions: [] },
                    ])
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  + Add day
                </button>
              </div>
              <div className="space-y-3">
                {summitDays.map((day, dayIdx) => {
                  const isCollapsed = collapsedDays.includes(dayIdx);
                  const sessionsRaw = Array.isArray(day.sessions) ? day.sessions : [];
                  const sessions = sessionsRaw.filter(
                    (s): s is Record<string, unknown> => !!s && typeof s === "object" && !Array.isArray(s)
                  );
                  return (
                    <div
                      key={dayIdx}
                      draggable
                      onDragStart={() => setDragDayIdx(dayIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragDayIdx !== null) reorderNestedArray(["agenda", "days"], dragDayIdx, dayIdx);
                        setDragDayIdx(null);
                      }}
                      onDragEnd={() => setDragDayIdx(null)}
                      className="rounded-md border border-slate-200 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleCollapsedDay(dayIdx)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                          Day {typeof day.day === "string" && day.day ? day.day : dayIdx + 1}
                        </button>
                        <span className="text-[11px] text-slate-500">{sessions.length} sessions</span>
                      </div>
                      {!isCollapsed && (
                      <>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 sm:col-span-3">
                          <GripVertical className="h-3.5 w-3.5" /> Drag day to reorder
                        </div>
                        <input
                          value={typeof day.day === "string" ? day.day : ""}
                          onChange={(e) =>
                            updateNestedArray(["agenda", "days"], (arr) =>
                              arr.map((d, i) => (i === dayIdx ? { ...d, day: e.target.value } : d))
                            )
                          }
                          placeholder="Day number"
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        />
                        <input
                          value={typeof day.date === "string" ? day.date : ""}
                          onChange={(e) =>
                            updateNestedArray(["agenda", "days"], (arr) =>
                              arr.map((d, i) => (i === dayIdx ? { ...d, date: e.target.value } : d))
                            )
                          }
                          placeholder="Date label"
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs sm:col-span-2"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[11px] font-medium text-slate-600">Sessions</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateNestedArray(["agenda", "days"], (arr) =>
                                arr.map((d, i) =>
                                  i === dayIdx
                                    ? {
                                        ...d,
                                        sessions: [...(Array.isArray(d.sessions) ? d.sessions : []), { time: "", title: "", topic: "" }],
                                      }
                                    : d
                                )
                              )
                            }
                            className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                          >
                            + Add session
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderNestedArray(["agenda", "days"], dayIdx, dayIdx - 1)}
                            className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                            title="Move day up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderNestedArray(["agenda", "days"], dayIdx, dayIdx + 1)}
                            className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                            title="Move day down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateNestedArray(["agenda", "days"], (arr) => arr.filter((_, i) => i !== dayIdx))
                            }
                            className="rounded-md border border-red-200 px-2 py-1 text-[11px] text-red-700 hover:bg-red-50"
                          >
                            Remove day
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 space-y-2">
                        {sessions.map((s, sIdx) => (
                          <div
                            key={sIdx}
                            draggable
                            onDragStart={() => setDragSession({ dayIdx, sessionIdx: sIdx })}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (!dragSession || dragSession.dayIdx !== dayIdx) return;
                              updateNestedArray(["agenda", "days"], (arr) =>
                                arr.map((d, i) => {
                                  if (i !== dayIdx) return d;
                                  const list = (Array.isArray(d.sessions) ? [...d.sessions] : []) as Record<string, unknown>[];
                                  if (dragSession.sessionIdx < 0 || dragSession.sessionIdx >= list.length || sIdx < 0 || sIdx >= list.length) return d;
                                  const [moved] = list.splice(dragSession.sessionIdx, 1);
                                  list.splice(sIdx, 0, moved);
                                  return { ...d, sessions: list };
                                })
                              );
                              setDragSession(null);
                            }}
                            onDragEnd={() => setDragSession(null)}
                            className="grid gap-2 sm:grid-cols-12"
                          >
                            <div className="inline-flex items-center text-[10px] text-slate-500 sm:col-span-12">
                              <GripVertical className="mr-1 h-3.5 w-3.5" /> Drag session to reorder
                            </div>
                            <input
                              value={typeof s.time === "string" ? s.time : ""}
                              onChange={(e) =>
                                updateNestedArray(["agenda", "days"], (arr) =>
                                  arr.map((d, i) => {
                                    if (i !== dayIdx) return d;
                                    const list = (Array.isArray(d.sessions) ? [...d.sessions] : []) as Record<string, unknown>[];
                                    const cur = (list[sIdx] && typeof list[sIdx] === "object" ? list[sIdx] : {}) as Record<string, unknown>;
                                    list[sIdx] = { ...cur, time: e.target.value };
                                    return { ...d, sessions: list };
                                  })
                                )
                              }
                              placeholder="Time"
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs sm:col-span-3"
                            />
                            <input
                              value={typeof s.title === "string" ? s.title : ""}
                              onChange={(e) =>
                                updateNestedArray(["agenda", "days"], (arr) =>
                                  arr.map((d, i) => {
                                    if (i !== dayIdx) return d;
                                    const list = (Array.isArray(d.sessions) ? [...d.sessions] : []) as Record<string, unknown>[];
                                    const cur = (list[sIdx] && typeof list[sIdx] === "object" ? list[sIdx] : {}) as Record<string, unknown>;
                                    list[sIdx] = { ...cur, title: e.target.value };
                                    return { ...d, sessions: list };
                                  })
                                )
                              }
                              placeholder="Session title"
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs sm:col-span-5"
                            />
                            <input
                              value={typeof s.topic === "string" ? s.topic : ""}
                              onChange={(e) =>
                                updateNestedArray(["agenda", "days"], (arr) =>
                                  arr.map((d, i) => {
                                    if (i !== dayIdx) return d;
                                    const list = (Array.isArray(d.sessions) ? [...d.sessions] : []) as Record<string, unknown>[];
                                    const cur = (list[sIdx] && typeof list[sIdx] === "object" ? list[sIdx] : {}) as Record<string, unknown>;
                                    list[sIdx] = { ...cur, topic: e.target.value };
                                    return { ...d, sessions: list };
                                  })
                                )
                              }
                              placeholder="Topic (optional)"
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs sm:col-span-3"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateNestedArray(["agenda", "days"], (arr) =>
                                  arr.map((d, i) =>
                                    i === dayIdx
                                      ? {
                                          ...d,
                                          sessions: (Array.isArray(d.sessions) ? d.sessions : []).filter((_, idx) => idx !== sIdx),
                                        }
                                      : d
                                  )
                                )
                              }
                              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 sm:col-span-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {item.slug === "aypf" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">AYPF helper</p>
            <p className="text-xs text-slate-500">
              Hero image uses the shared field below. List fields: one item per line.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Breadcrumb label (last segment)</label>
                <input
                  type="text"
                  value={typeof parsedJson.breadcrumbLabel === "string" ? parsedJson.breadcrumbLabel : ""}
                  onChange={(e) => updateJsonField("breadcrumbLabel", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Hero image alt</label>
                <input
                  type="text"
                  value={typeof parsedJson.heroImageAlt === "string" ? parsedJson.heroImageAlt : ""}
                  onChange={(e) => updateJsonField("heroImageAlt", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Page title (hero)</label>
                <input
                  type="text"
                  value={typeof parsedJson.title === "string" ? parsedJson.title : ""}
                  onChange={(e) => updateJsonField("title", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Hero subtitle</label>
                <textarea
                  value={typeof parsedJson.subtitle === "string" ? parsedJson.subtitle : ""}
                  onChange={(e) => updateJsonField("subtitle", e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Lead paragraph</label>
              <textarea
                value={typeof parsedJson.leadParagraph === "string" ? parsedJson.leadParagraph : ""}
                onChange={(e) => updateJsonField("leadParagraph", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Launch paragraph</label>
              <textarea
                value={typeof parsedJson.launchParagraph === "string" ? parsedJson.launchParagraph : ""}
                onChange={(e) => updateJsonField("launchParagraph", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Theme (quoted)</label>
              <textarea
                value={typeof parsedJson.themeQuote === "string" ? parsedJson.themeQuote : ""}
                onChange={(e) => updateJsonField("themeQuote", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Inaugural paragraph</label>
              <textarea
                value={typeof parsedJson.inauguralParagraph === "string" ? parsedJson.inauguralParagraph : ""}
                onChange={(e) => updateJsonField("inauguralParagraph", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Purpose section</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Eyebrow</label>
                  <input
                    type="text"
                    value={getNestedString(["purposeSection", "eyebrow"])}
                    onChange={(e) => updateNestedString(["purposeSection", "eyebrow"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Heading</label>
                  <input
                    type="text"
                    value={getNestedString(["purposeSection", "heading"])}
                    onChange={(e) => updateNestedString(["purposeSection", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Intro</label>
                <textarea
                  value={getNestedString(["purposeSection", "intro"])}
                  onChange={(e) => updateNestedString(["purposeSection", "intro"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Focus areas (one per line)</label>
                <textarea
                  value={getNestedStringArray(["purposeSection", "focusAreas"]).join("\n")}
                  onChange={(e) =>
                    updateNestedStringArray(
                      ["purposeSection", "focusAreas"],
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={6}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Legitimacy paragraph</label>
              <textarea
                value={typeof parsedJson.legitimacyParagraph === "string" ? parsedJson.legitimacyParagraph : ""}
                onChange={(e) => updateJsonField("legitimacyParagraph", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">From dialogue to action</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Eyebrow</label>
                  <input
                    type="text"
                    value={getNestedString(["actionSection", "eyebrow"])}
                    onChange={(e) => updateNestedString(["actionSection", "eyebrow"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Heading</label>
                  <input
                    type="text"
                    value={getNestedString(["actionSection", "heading"])}
                    onChange={(e) => updateNestedString(["actionSection", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Intro</label>
                <textarea
                  value={getNestedString(["actionSection", "intro"])}
                  onChange={(e) => updateNestedString(["actionSection", "intro"], e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Discussion points (one per line)</label>
                <textarea
                  value={getNestedStringArray(["actionSection", "discussionPoints"]).join("\n")}
                  onChange={(e) =>
                    updateNestedStringArray(
                      ["actionSection", "discussionPoints"],
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={5}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-xs"
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Looking ahead</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Eyebrow</label>
                  <input
                    type="text"
                    value={getNestedString(["lookingAheadSection", "eyebrow"])}
                    onChange={(e) => updateNestedString(["lookingAheadSection", "eyebrow"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Heading</label>
                  <input
                    type="text"
                    value={getNestedString(["lookingAheadSection", "heading"])}
                    onChange={(e) => updateNestedString(["lookingAheadSection", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Intro</label>
                <textarea
                  value={getNestedString(["lookingAheadSection", "intro"])}
                  onChange={(e) => updateNestedString(["lookingAheadSection", "intro"], e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Topics (one per line)</label>
                <textarea
                  value={getNestedStringArray(["lookingAheadSection", "topics"]).join("\n")}
                  onChange={(e) =>
                    updateNestedStringArray(
                      ["lookingAheadSection", "topics"],
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={5}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-xs"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-600">Invitation note</label>
                <textarea
                  value={getNestedString(["lookingAheadSection", "invitationNote"])}
                  onChange={(e) => updateNestedString(["lookingAheadSection", "invitationNote"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Register</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Heading</label>
                  <input
                    type="text"
                    value={getNestedString(["registerSection", "heading"])}
                    onChange={(e) => updateNestedString(["registerSection", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Intro</label>
                  <textarea
                    value={getNestedString(["registerSection", "intro"])}
                    onChange={(e) => updateNestedString(["registerSection", "intro"], e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">CTA label</label>
                  <input
                    type="text"
                    value={getNestedString(["registerSection", "ctaLabel"])}
                    onChange={(e) => updateNestedString(["registerSection", "ctaLabel"], e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Registration URL</label>
                  <input
                    type="url"
                    value={getNestedString(["registerSection", "registrationHref"])}
                    onChange={(e) => updateNestedString(["registerSection", "registrationHref"], e.target.value)}
                    placeholder="https://…"
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Benefits list (one per line)</label>
                  <textarea
                    value={getNestedStringArray(["registerSection", "benefits"]).join("\n")}
                    onChange={(e) =>
                      updateNestedStringArray(
                        ["registerSection", "benefits"],
                        e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    rows={4}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {item.slug === "applications" && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Applications page helper</p>
            <p className="text-xs text-slate-500">
              Hero and intro also live here. Optional <code className="rounded bg-white px-1">fieldLabelOverrides</code> in the JSON
              below: object mapping field <code className="rounded bg-white px-1">name</code> to custom labels (e.g.{" "}
              <code className="rounded bg-white px-1">{`{"fullName":"Your name"}`}</code>).
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Hero image alt</label>
                <input
                  type="text"
                  value={typeof parsedJson.heroImageAlt === "string" ? parsedJson.heroImageAlt : ""}
                  onChange={(e) => updateJsonField("heroImageAlt", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Breadcrumb: Home</label>
                <input
                  type="text"
                  value={typeof parsedJson.breadcrumbHome === "string" ? parsedJson.breadcrumbHome : ""}
                  onChange={(e) => updateJsonField("breadcrumbHome", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Breadcrumb: Get involved</label>
                <input
                  type="text"
                  value={typeof parsedJson.breadcrumbGetInvolved === "string" ? parsedJson.breadcrumbGetInvolved : ""}
                  onChange={(e) => updateJsonField("breadcrumbGetInvolved", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Breadcrumb: Volunteer</label>
                <input
                  type="text"
                  value={typeof parsedJson.breadcrumbVolunteer === "string" ? parsedJson.breadcrumbVolunteer : ""}
                  onChange={(e) => updateJsonField("breadcrumbVolunteer", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Breadcrumb: Current page</label>
                <input
                  type="text"
                  value={typeof parsedJson.breadcrumbApplication === "string" ? parsedJson.breadcrumbApplication : ""}
                  onChange={(e) => updateJsonField("breadcrumbApplication", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Apply eyebrow</label>
                <input
                  type="text"
                  value={typeof parsedJson.formEyebrow === "string" ? parsedJson.formEyebrow : ""}
                  onChange={(e) => updateJsonField("formEyebrow", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Form card title</label>
                <input
                  type="text"
                  value={typeof parsedJson.formCardTitle === "string" ? parsedJson.formCardTitle : ""}
                  onChange={(e) => updateJsonField("formCardTitle", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Section: Personal</label>
                <input
                  type="text"
                  value={typeof parsedJson.sectionPersonal === "string" ? parsedJson.sectionPersonal : ""}
                  onChange={(e) => updateJsonField("sectionPersonal", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Section: Experience</label>
                <input
                  type="text"
                  value={typeof parsedJson.sectionExperience === "string" ? parsedJson.sectionExperience : ""}
                  onChange={(e) => updateJsonField("sectionExperience", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Section: Motivation</label>
                <input
                  type="text"
                  value={typeof parsedJson.sectionMotivation === "string" ? parsedJson.sectionMotivation : ""}
                  onChange={(e) => updateJsonField("sectionMotivation", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Application type label</label>
                <input
                  type="text"
                  value={typeof parsedJson.applicationTypeLabel === "string" ? parsedJson.applicationTypeLabel : ""}
                  onChange={(e) => updateJsonField("applicationTypeLabel", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Option: Volunteer</label>
                <input
                  type="text"
                  value={typeof parsedJson.optionVolunteer === "string" ? parsedJson.optionVolunteer : ""}
                  onChange={(e) => updateJsonField("optionVolunteer", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Option: Staff</label>
                <input
                  type="text"
                  value={typeof parsedJson.optionStaff === "string" ? parsedJson.optionStaff : ""}
                  onChange={(e) => updateJsonField("optionStaff", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Option: Fellow</label>
                <input
                  type="text"
                  value={typeof parsedJson.optionFellow === "string" ? parsedJson.optionFellow : ""}
                  onChange={(e) => updateJsonField("optionFellow", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Availability placeholder</label>
                <input
                  type="text"
                  value={typeof parsedJson.availabilityPlaceholder === "string" ? parsedJson.availabilityPlaceholder : ""}
                  onChange={(e) => updateJsonField("availabilityPlaceholder", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Availability: Full-time</label>
                <input
                  type="text"
                  value={typeof parsedJson.availabilityFullTime === "string" ? parsedJson.availabilityFullTime : ""}
                  onChange={(e) => updateJsonField("availabilityFullTime", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Availability: Part-time</label>
                <input
                  type="text"
                  value={typeof parsedJson.availabilityPartTime === "string" ? parsedJson.availabilityPartTime : ""}
                  onChange={(e) => updateJsonField("availabilityPartTime", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Availability: Flexible</label>
                <input
                  type="text"
                  value={typeof parsedJson.availabilityFlexible === "string" ? parsedJson.availabilityFlexible : ""}
                  onChange={(e) => updateJsonField("availabilityFlexible", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Submit (idle)</label>
                <input
                  type="text"
                  value={typeof parsedJson.submitIdle === "string" ? parsedJson.submitIdle : ""}
                  onChange={(e) => updateJsonField("submitIdle", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Submit (sending)</label>
                <input
                  type="text"
                  value={typeof parsedJson.submitSending === "string" ? parsedJson.submitSending : ""}
                  onChange={(e) => updateJsonField("submitSending", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Success message</label>
                <textarea
                  value={typeof parsedJson.successMessage === "string" ? parsedJson.successMessage : ""}
                  onChange={(e) => updateJsonField("successMessage", e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Email warning intro (before programs email)</label>
                <textarea
                  value={typeof parsedJson.emailWarnIntro === "string" ? parsedJson.emailWarnIntro : ""}
                  onChange={(e) => updateJsonField("emailWarnIntro", e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">Generic error fallback</label>
                <input
                  type="text"
                  value={typeof parsedJson.errorFallback === "string" ? parsedJson.errorFallback : ""}
                  onChange={(e) => updateJsonField("errorFallback", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}
        {(item.slug === "privacy-policy" || item.slug === "terms-of-service") && (
          <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Legal page helper</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">Page title</label>
                <input
                  type="text"
                  value={typeof parsedJson.title === "string" ? parsedJson.title : ""}
                  onChange={(e) => updateJsonField("title", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Last updated</label>
                <input
                  type="text"
                  value={typeof parsedJson.lastUpdated === "string" ? parsedJson.lastUpdated : ""}
                  onChange={(e) => updateJsonField("lastUpdated", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Sections</p>
                <button
                  type="button"
                  onClick={() =>
                    updateNestedArray(["sections"], (arr) => [...arr, { title: "", content: "", items: [] }])
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  + Add section
                </button>
              </div>
              <div className="space-y-2">
                {legalSections.map((sec, idx) => (
                  (() => {
                    const isCollapsed = collapsedSections.includes(idx);
                    return (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => setDragLegalIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragLegalIdx !== null) reorderNestedArray(["sections"], dragLegalIdx, idx);
                      setDragLegalIdx(null);
                    }}
                    onDragEnd={() => setDragLegalIdx(null)}
                    className="rounded-md border border-slate-200 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleCollapsedSection(idx)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                        {typeof sec.title === "string" && sec.title ? sec.title : `Section ${idx + 1}`}
                      </button>
                    </div>
                    {!isCollapsed && (
                    <>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 sm:col-span-2">
                        <GripVertical className="h-3.5 w-3.5" /> Drag section to reorder
                      </div>
                      <input
                        value={typeof sec.title === "string" ? sec.title : ""}
                        onChange={(e) =>
                          updateNestedArray(["sections"], (arr) =>
                            arr.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s))
                          )
                        }
                        placeholder="Section title"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateNestedArray(["sections"], (arr) => arr.filter((_, i) => i !== idx))
                        }
                        className="justify-self-end rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                      <div className="justify-self-end flex gap-1">
                        <button
                          type="button"
                          onClick={() => reorderNestedArray(["sections"], idx, idx - 1)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          title="Move section up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => reorderNestedArray(["sections"], idx, idx + 1)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          title="Move section down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={typeof sec.content === "string" ? sec.content : ""}
                      onChange={(e) =>
                        updateNestedArray(["sections"], (arr) =>
                          arr.map((s, i) => (i === idx ? { ...s, content: e.target.value } : s))
                        )
                      }
                      rows={3}
                      placeholder="Section content"
                      className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    <textarea
                      value={Array.isArray(sec.items) ? sec.items.filter((x) => typeof x === "string").join("\n") : ""}
                      onChange={(e) =>
                        updateNestedArray(["sections"], (arr) =>
                          arr.map((s, i) =>
                            i === idx
                              ? {
                                  ...s,
                                  items: e.target.value
                                    .split("\n")
                                    .map((line) => line.trim())
                                    .filter(Boolean),
                                }
                              : s
                          )
                        )
                      }
                      rows={3}
                      placeholder="Bullet items (one per line)"
                      className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                    </>
                    )}
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              For complex privacy subsections, use the advanced editor below for full control.
            </p>
          </div>
        )}
        <div className="mb-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Hero image</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={quickValues.heroImage}
                onChange={(e) => updateJsonField("heroImage", e.target.value)}
                placeholder="media-... or /uploads/..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={() => setPickerTarget("heroImage")}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                title="Pick from Media Library"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Section image</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={quickValues.sectionImage}
                onChange={(e) => updateJsonField("sectionImage", e.target.value)}
                placeholder="media-... or /uploads/..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={() => setPickerTarget("sectionImage")}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                title="Pick from Media Library"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Subtitle</label>
            <input
              type="text"
              value={quickValues.subtitle}
              onChange={(e) => updateJsonField("subtitle", e.target.value)}
              placeholder="Page subtitle"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Apply intro</label>
            <input
              type="text"
              value={quickValues.applyIntro}
              onChange={(e) => updateJsonField("applyIntro", e.target.value)}
              placeholder="Applications page helper text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
        </div>
        <textarea
          id="contentJson"
          name="contentJson"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={18}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm text-slate-900"
          placeholder='{"heroImage":"media-...","intro":"..."}'
        />
        <p className="mt-1 text-xs text-slate-500">
          Edit extra fields and media links here when needed. Use a media ID such as <code>media-…</code> or a path like{" "}
          <code>/uploads/…</code>.
        </p>
        {jsonError ? <p className="mt-2 text-xs text-red-600">{jsonError}</p> : null}
      </div>

      <AdminFormStickyActions>
        <SubmitButton />
        <AdminFormPreviewLink href={publicPathForPageSlug(item.slug)}>Preview on site</AdminFormPreviewLink>
        <a
          href="/admin/pages"
          className="flex min-h-[44px] items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </AdminFormStickyActions>

      <ImagePicker
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={onSelectMedia}
      />
    </form>
  );
}
