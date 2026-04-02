import { requireAdminSession } from "@/lib/require-admin";
import AdminMediaPageClient from "./MediaPageClient";

export default async function AdminMediaPage() {
  await requireAdminSession();
  return <AdminMediaPageClient />;
}
