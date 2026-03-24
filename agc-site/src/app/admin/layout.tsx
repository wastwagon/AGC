import { AdminShell } from "./admin-shell";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  return <AdminShell siteSettings={siteSettings}>{children}</AdminShell>;
}
