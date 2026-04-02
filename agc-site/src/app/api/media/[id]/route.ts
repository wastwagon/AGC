import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { removeMediaItem, getMediaById, getUploadsDir, updateMediaItem } from "@/lib/media";
import { findMediaReferences } from "@/lib/media-references";
import { requireAdmin } from "@/lib/auth-api";

type PatchPayload = {
  alt?: string;
  title?: string;
};

function cleanOptionalText(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : "";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = (await request.json()) as PatchPayload;
    const alt = cleanOptionalText(body.alt);
    const title = cleanOptionalText(body.title);
    const updated = await updateMediaItem(id, {
      ...(alt !== undefined ? { alt } : {}),
      ...(title !== undefined ? { title } : {}),
    });
    if (!updated) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("Media patch error:", err);
    return NextResponse.json({ error: "Failed to update media metadata" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const item = await getMediaById(id);
    if (!item) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const references = await findMediaReferences(item);
    if (references.length > 0) {
      return NextResponse.json(
        {
          error: "This image is still referenced by site content. Remove or replace it there first.",
          references,
        },
        { status: 409 }
      );
    }

    const filePath = path.join(getUploadsDir(), item.filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    await removeMediaItem(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Media delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
