import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { placeholderImages } from "@/data/images";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "African Women Political Leadership Summit (AWPLS)",
  description:
    "African Women Political Leadership Summit — strengthening women’s leadership in political life across the continent.",
};

export const revalidate = 60;

const awplsFallback = {
  title: "African Women Political Leadership Summit",
  subtitle: "AWPLS",
  description:
    "The African Women Political Leadership Summit (AWPLS) brings together women in and around political life to share evidence, build skills, and strengthen how parties and institutions govern. Programme details, dates, and registration will be announced here.",
  heroImage: "/uploads/placeholder.svg",
};

export default async function AwplsPage() {
  const [siteSettings, content] = await Promise.all([
    getSiteSettings(),
    getMergedPageContent<typeof awplsFallback>("awpls", cmsStaticOrEmpty(awplsFallback)),
  ]);
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? placeholderImages.about;
  const sectionDescription = content.description?.trim() || awplsFallback.description;

  return (
    <>
      <PageHero
        variant="immersive"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="African Women Political Leadership Summit"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: "AWPLS" },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <h2 className="page-heading text-2xl text-black sm:text-3xl">{content.title}</h2>
            <p className="mt-3 page-prose text-[1.08rem] leading-relaxed text-stone-800">
              {sectionDescription}
            </p>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
