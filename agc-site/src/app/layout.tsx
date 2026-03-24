import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { getSiteSettings } from "@/lib/site-settings";

/** Body: highly legible, institutional (not generic Inter/DM stack) */
const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  display: "swap",
});

/** Display: distinctive editorial feel vs template Playfair */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.africagovernancecentre.org";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteSettings.name} | Governance Excellence Across Africa`,
      template: `%s | ${siteSettings.name}`,
    },
    description: siteSettings.tagline,
    keywords: ["Africa", "governance", "think tank", "policy", "economic transformation", "capacity building"],
    openGraph: {
      type: "website",
      siteName: siteSettings.name,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  return (
    <html lang="en" className={`${ibmPlex.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to content
        </a>
        <JsonLd siteSettings={siteSettings} />
        <Analytics />
        <SiteChrome siteSettings={siteSettings}>
          <main id="main-content" className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
