import { notFound } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { PrintButton } from "@/components/PrintButton";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EventBadgePage({ params }: Props) {
  const { id } = await params;

  const registration = await prisma.eventRegistration.findUnique({
    where: { id },
  });

  if (!registration) notFound();

  const qrPayload = registration.qrToken;
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 200,
    margin: 2,
    color: { dark: "#0e1f26", light: "#fffcf7" },
  });

  const eventDate = new Date(registration.eventStartDate).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f7f4ef] p-8 print:bg-white print:p-4 print:min-h-0">
      <style>{"@media print { @page { margin: 12mm; size: auto; } }"}</style>
      <div
        className="mx-auto max-w-md rounded-2xl border border-border/90 bg-[#fffcf7] p-8 shadow-[0_20px_50px_-15px_rgba(30,51,48,0.15)] print:shadow-none print:border-border"
        style={{ width: "85mm" }}
      >
        <div className="border-b border-accent-200/50 pb-4 text-center">
          <h1 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent-700">
            Africa Governance Centre
          </h1>
          <h2 className="mt-2 font-serif text-lg font-semibold tracking-tight text-accent-900">Event accreditation</h2>
          {registration.waitlisted ? (
            <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-amber-900">
              Waitlist — not confirmed for entry
            </p>
          ) : null}
        </div>

        <div className="mt-5 pt-2">
          <p className="text-center font-sans text-xl font-semibold text-black">{registration.fullName}</p>
          {registration.organization && (
            <p className="mt-1 text-center text-sm text-black">{registration.organization}</p>
          )}
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <p className="text-center text-sm font-medium text-black">{registration.eventTitle}</p>
          <p className="mt-1 text-center text-xs text-black">{eventDate}</p>
          {registration.eventLocation && (
            <p className="mt-0.5 text-center text-xs text-black">{registration.eventLocation}</p>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center border-t border-border pt-5">
          <Image
            src={qrDataUrl}
            alt="QR code for check-in"
            width={160}
            height={160}
            className="rounded-lg border border-border bg-[#fffcf7] print:border-border"
          />
          <p className="mt-2 font-mono text-xs font-medium text-black">{registration.registrationId}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-black">Check-in at venue</p>
          <p className="mt-3 hidden text-center text-[10px] text-black print:hidden sm:block max-w-[14rem]">
            Staff scan this code or enter your registration ID above.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
