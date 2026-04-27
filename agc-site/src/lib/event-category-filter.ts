import type { CmsEvent } from "@/lib/content";

/** Tab ids for /events listing filters (labels live in page content JSON). */
export const EVENT_CATEGORY_TAB_IDS = [
  "all",
  "summits",
  "high_level_dialogues",
  "roundtable",
  "seminar",
  "media_engagement",
  "workshop",
  "webinar",
] as const;

export type EventCategoryTabId = (typeof EVENT_CATEGORY_TAB_IDS)[number];

export const DEFAULT_EVENT_CATEGORY_TAB_ID: EventCategoryTabId = "all";

export function isEventCategoryTabId(id: string): id is EventCategoryTabId {
  return (EVENT_CATEGORY_TAB_IDS as readonly string[]).includes(id);
}

/** Lowercase underscore form from `category` / `event_type`. */
export function normalizeEventCategory(event: CmsEvent): string {
  const raw = String(
    (event as CmsEvent & { event_type?: string }).event_type || event.category || ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");

  return raw;
}

/**
 * Which events appear under each tab. Uses substring checks on normalized category/event_type.
 * Admins can use values like `summit`, `high_level_dialogue`, `roundtable_discussion`, `webinar`, etc.
 */
export function eventMatchesCategoryTab(tabId: string, event: CmsEvent): boolean {
  const n = normalizeEventCategory(event);

  switch (tabId) {
    case "all":
      return true;
    case "summits":
      return n.includes("summit");
    case "high_level_dialogues":
      return (
        (n.includes("dialogue") || n.includes("high_level") || n.includes("policy_dialogue")) &&
        !n.includes("roundtable")
      );
    case "roundtable":
      return n.includes("roundtable");
    case "seminar":
      return n.includes("seminar");
    case "media_engagement":
      return (
        n.includes("media_engagement") ||
        n.includes("media_briefing") ||
        (n.includes("media") && (n.includes("briefing") || n.includes("engagement")))
      );
    case "workshop":
      return n.includes("workshop");
    case "webinar":
      return n.includes("webinar");
    default:
      return false;
  }
}
