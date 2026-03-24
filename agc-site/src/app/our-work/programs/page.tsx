import { workContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Programs",
  description: "Our core focus areas - forums and expert roundtables advancing governance excellence across Africa.",
};

export default async function ProgramsPage() {
  const merged = await getMergedPageContent("our-work-programs", workContent.programs as unknown as Record<string, unknown>);
  const content = merged as unknown as typeof workContent.programs & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.programs;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Programs"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Work", href: "/our-work" },
          { label: "Programs" },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-slate-600">{content.description}</p>
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <Button asChild href="/our-work" variant="outline">
              Back to Our Work
            </Button>
            <Button asChild href="/events" variant="primary">
              View Events
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
