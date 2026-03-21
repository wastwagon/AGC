import { Suspense } from "react";
import { AdminFormSuccessBanner } from "./AdminFormSuccessBanner";

export function AdminFormSuccessSuspense() {
  return (
    <Suspense fallback={null}>
      <AdminFormSuccessBanner />
    </Suspense>
  );
}
