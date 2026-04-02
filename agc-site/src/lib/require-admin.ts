import { auth } from "@/auth";
import { redirect } from "next/navigation";

/** Server-only: redirect to login if there is no admin session. Use in admin pages (defense in depth with proxy). */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}
