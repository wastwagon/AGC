import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { removeMediaItem, getMediaById, getUploadsDir } from "@/lib/media";
import { findMediaReferences } from "@/lib/media-references";
import { requireAdmin } from "@/lib/auth-api";

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
