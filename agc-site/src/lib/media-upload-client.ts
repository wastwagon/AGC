/** Browser-only helpers for media uploads (used from client components). */

export async function rasterDimensionsFromFile(file: File): Promise<{ width?: string; height?: string }> {
  if (file.type === "image/svg+xml") return {};
  try {
    const bmp = await createImageBitmap(file);
    const w = bmp.width;
    const h = bmp.height;
    bmp.close();
    return { width: String(w), height: String(h) };
  } catch {
    return {};
  }
}
