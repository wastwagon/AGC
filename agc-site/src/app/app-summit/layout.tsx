import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "APP Summit",
  description: "African Political Parties Summit 2025 - Strengthening Democratic Governance. August 12-14, Accra, Ghana.",
};

export default function AppSummitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
