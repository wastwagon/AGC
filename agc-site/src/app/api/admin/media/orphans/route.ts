import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-api";
import { listOrphanMediaItems } from "@/lib/media-orphans";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const items = await listOrphanMediaItems();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Orphans list error:", err);
    return NextResponse.json({ error: "Failed to list orphans" }, { status: 500 });
  }
}
