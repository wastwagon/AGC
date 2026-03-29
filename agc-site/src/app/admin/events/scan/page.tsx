import Link from "next/link";
import { QrCode } from "lucide-react";
import { CheckInScanner } from "@/components/CheckInScanner";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { getEventBySlugAdmin } from "@/lib/content";
import { fallbackEvents } from "@/data/content";
import type { CmsEvent } from "@/lib/content";

type Props = { searchParams: Promise<{ event?: string }> };

export default async function AdminScanPage({ searchParams }: Props) {
  const { event: rawSlug } = await searchParams;
  const eventSlug = rawSlug?.trim() || "";

  let expectedEventTitle: string | undefined;
  if (eventSlug) {
    const cms = await getEventBySlugAdmin(eventSlug);
    const ev = cms ?? (fallbackEvents as CmsEvent[]).find((e) => e.slug === eventSlug);
    expectedEventTitle = ev?.title;
  }

  return (
    <div>
      <AdminPageHeader
        title="Check-in Scanner"
        description="Scan the QR code on an accreditation badge or enter the registration ID manually to confirm attendance."
      >
        {eventSlug ? (
          <Link
            href={`/admin/events/${encodeURIComponent(eventSlug)}`}
            className="flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <QrCode className="h-4 w-4" aria-hidden />
            Registrations list
          </Link>
        ) : null}
      </AdminPageHeader>
      <CheckInScanner expectedEventSlug={eventSlug || undefined} expectedEventTitle={expectedEventTitle} />
    </div>
  );
}
