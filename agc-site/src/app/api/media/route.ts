import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  listMedia,
  addMediaItem,
  getUploadsDir,
  isAllowedMimeType,
  type MediaItem,
} from "@/lib/media";
import { requireAdmin } from "@/lib/auth-api";

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

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    };

    await addMediaItem(item);

    return NextResponse.json({ item });
  } catch (err) {
    console.error("Media upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
