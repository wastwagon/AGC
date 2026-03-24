import type { SiteSettings } from "@/lib/site-settings";

export function JsonLd({ siteSettings }: { siteSettings: SiteSettings }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSettings.name,
    description: siteSettings.tagline,
    url: "https://www.africagovernancecentre.org",
    email: siteSettings.email.programs,
    telephone: siteSettings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address,
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    sameAs: [
      siteSettings.social.twitter,
      siteSettings.social.linkedin,
      siteSettings.social.instagram,
      siteSettings.social.facebook,
    ].filter((url) => url !== "#"),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
