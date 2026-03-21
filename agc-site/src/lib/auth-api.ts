import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Use in API routes to require admin auth.
 * Returns the session if authenticated, or a 401 response if not.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
