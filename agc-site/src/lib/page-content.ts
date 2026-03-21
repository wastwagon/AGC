import { getPageContent } from "@/lib/content";

/**
 * Fetch page content from CMS and merge over static fallback.
 * CMS content takes precedence when present.
 */
export async function getMergedPageContent<T extends Record<string, unknown>>(
  slug: string,
  fallback: T
): Promise<T> {
  const cms = await getPageContent(slug);
  if (!cms?.content_json || typeof cms.content_json !== "object") {
    return fallback;
  }
  return deepMerge(fallback, cms.content_json as Record<string, unknown>) as T;
}

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal !== null &&
      srcVal !== undefined &&
      typeof srcVal === "object" &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === "object" &&
      !Array.isArray(tgtVal)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        tgtVal as Record<string, unknown>,
        srcVal as Record<string, unknown>
      );
    } else if (srcVal !== undefined) {
      (result as Record<string, unknown>)[key] = srcVal;
    }
  }
  return result;
}
