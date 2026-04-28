import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { placeholderImages } from "@/data/images";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "African Women Political Leadership Summit (AWPLS)",
  description:
    "African Women Political Leadership Summit — strengthening women’s leadership in political life across the continent.",
};

export const revalidate = 60;

export default async function AwplsPage() {
  const siteSettings = await getSiteSettings();

  return (
    <>
      <PageHero
        variant="immersive"
        title="African Women Political Leadership Summit"
        subtitle="AWPLS"
        image={placeholderImages.about}
        imageAlt="African Women Political Leadership Summit"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: "AWPLS" },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <p className="page-prose text-[1.08rem] leading-relaxed text-stone-800">
              The African Women Political Leadership Summit (AWPLS) brings together women in and around political life to
              share evidence, build skills, and strengthen how parties and institutions govern. Programme details,
              dates, and registration will be announced here.
            </p>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
