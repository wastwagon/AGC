import { CheckInScanner } from "@/components/CheckInScanner";
import { AdminPageHeader } from "../../_components/AdminPageHeader";

export default function AdminScanPage() {
  return (
    <div>
      <AdminPageHeader
        title="Check-in Scanner"
        description="Scan the QR code on an accreditation badge or enter the registration ID manually to confirm attendance."
      />
      <CheckInScanner />
    </div>
  );
}
