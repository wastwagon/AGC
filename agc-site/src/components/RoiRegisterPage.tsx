import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { RegistrationOfInterestForm } from "@/components/RegistrationOfInterestForm";
import { ROI_FORMS, type RoiEventType } from "@/data/roi-forms";
import { getSiteSettings } from "@/lib/site-settings";
import { placeholderImages } from "@/data/images";

type Props = {
  eventType: RoiEventType;
  heroImage?: string;
};

export function roiRegisterMetadata(eventType: RoiEventType): Metadata {
  const config = ROI_FORMS[eventType];
  return {
    title: `Registration of Interest — ${config.shortName} ${config.year}`,
    description: `Submit a Registration of Interest for the ${config.fullName} ${config.year}.`,
  };
}

export async function RoiRegisterPage({ eventType, heroImage }: Props) {
  const config = ROI_FORMS[eventType];
  const siteSettings = await getSiteSettings();

  return (
    <>
      <PageHero
        variant="immersive"
        title="Registration of Interest"
        subtitle={`${config.fullName} ${config.year}`}
        image={heroImage || placeholderImages.events}
        imageAlt={config.fullName}
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: config.parentLabel, href: config.parentPath },
          { label: "Register interest" },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 lg:px-11">
            <RegistrationOfInterestForm config={config} />
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
