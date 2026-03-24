import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  listMedia,
  addMediaItem,
  getUploadsDir,
  isAllowedMimeType,
  assertUploadWithinLimit,
  type MediaItem,
} from "@/lib/media";
import { requireAdmin } from "@/lib/auth-api";
import { parseOptionalDimensionsFromForm, probeRasterDimensions } from "@/lib/image-dimensions";
import { formatMaxUploadBytes } from "@/lib/media-limits";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const items = await listMedia();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Media list error:", err);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || undefined;
    const title = (formData.get("title") as string) || undefined;
    const widthForm = formData.get("width");
    const heightForm = formData.get("height");

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    try {
      assertUploadWithinLimit(file.size);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "File too large.";
      return NextResponse.json({ error: `${msg} Limit: ${formatMaxUploadBytes()}.` }, { status: 400 });
    }

    const mime = file.type || "application/octet-stream";
    if (!isAllowedMimeType(mime)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG" },
        { status: 400 }
      );
    }

    const ext = mime === "image/svg+xml" ? "svg" : mime.split("/")[1] || "jpg";
    const id = `media-${randomUUID()}`;
    const filename = `${id}.${ext}`;
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, filename);

    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fromForm = parseOptionalDimensionsFromForm(
      typeof widthForm === "string" ? widthForm : undefined,
      typeof heightForm === "string" ? heightForm : undefined
    );
    const probed = mime !== "image/svg+xml" ? probeRasterDimensions(buffer, mime) : {};
    const width = fromForm.width ?? probed.width;
    const height = fromForm.height ?? probed.height;

    const url = `/uploads/${filename}`;
    const item: MediaItem = {
      id,
      filename,
      url,
      alt,
      title,
      size: file.size,
      mimeType: mime,
      uploadedAt: new Date().toISOString(),
      ...(width && height ? { width, height } : {}),
    };

    await addMediaItem(item);

    return NextResponse.json({ item });
  } catch (err) {
    console.error("Media upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
