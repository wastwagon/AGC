"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-accent-500 px-6 py-3 font-medium text-white hover:bg-accent-600 print:hidden"
    >
      Print Badge
    </button>
  );
}
