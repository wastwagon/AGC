/** Extract YouTube video id for embed from common URL shapes. */
export function getYouTubeVideoId(input: string | undefined | null): string | null {
  if (!input || typeof input !== "string") return null;
  const u = input.trim();
  if (!u) return null;
  const watch = u.match(/[?&]v=([\w-]{11})(?:&|$)/);
  const short = u.match(/youtu\.be\/([\w-]{11})(?:\?|$)/);
  const embed = u.match(/youtube\.com\/embed\/([\w-]{11})(?:\?|$)/);
  const shorts = u.match(/youtube\.com\/shorts\/([\w-]{11})(?:\?|$)/);
  return watch?.[1] || short?.[1] || embed?.[1] || shorts?.[1] || null;
}

export function getYouTubeEmbedSrc(input: string | undefined | null): string | null {
  const id = getYouTubeVideoId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
