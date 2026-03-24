import { workContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Projects",
  description: "Our targeted interventions - strengthening governance frameworks across African countries.",
};

export default async function ProjectsPage() {
  const merged = await getMergedPageContent("our-work-projects", workContent.projects as unknown as Record<string, unknown>);
  const content = merged as unknown as typeof workContent.projects & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.projects;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Projects"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Work", href: "/our-work" },
          { label: "Projects" },
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
            <Button asChild href="/get-involved/partnership" variant="primary">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
