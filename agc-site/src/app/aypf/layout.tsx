import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "African Youth in Politics Forum (AYPF)",
  description:
    "Continental youth convening and training under APPI — strengthening youth participation in political leadership and governance across Africa.",
};

export default function AypfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
