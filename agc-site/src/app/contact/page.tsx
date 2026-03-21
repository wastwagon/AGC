import { contactContent } from "@/data/content";
import { getMergedPageContent } from "@/lib/page-content";
import { ContactPageClient } from "./contact-page-client";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Africa Governance Centre.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const content = await getMergedPageContent("contact", contactContent);
  return <ContactPageClient contactContent={content} />;
}
