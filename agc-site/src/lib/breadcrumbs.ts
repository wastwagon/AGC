import { cache } from "react";
import { getSiteSettings } from "@/lib/site-settings";

/** Cached breadcrumb segment labels from Site settings (Admin → Site settings). */
export const getBreadcrumbLabels = cache(async () => (await getSiteSettings()).chrome.breadcrumbs);
