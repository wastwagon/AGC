import { contactContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getMergedPageContent } from "@/lib/page-content";
import { ContactPageClient } from "./contact-page-client";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Africa Governance Centre.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const [content, siteSettings] = await Promise.all([
    getMergedPageContent("contact", contactContent),
    getSiteSettings(),
  ]);
  const heroImage = (await resolveImageUrl((content as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.contact;
  return <ContactPageClient contactContent={content} heroImage={heroImage} siteSettings={siteSettings} />;
}
