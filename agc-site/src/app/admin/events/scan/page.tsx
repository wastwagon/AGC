import { CheckInScanner } from "@/components/CheckInScanner";

export default function AdminScanPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-slate-900">Check-in Scanner</h1>
      <p className="mb-8 text-slate-600">
        Scan the QR code on an accreditation badge or enter the Registration ID manually to confirm attendance.
      </p>
      <CheckInScanner />
    </div>
  );
}
