import { Suspense } from "react";
import { AdminFormErrorBanner } from "./AdminFormErrorBanner";

export function AdminFormErrorSuspense() {
  return (
    <Suspense fallback={null}>
      <AdminFormErrorBanner />
    </Suspense>
  );
}
