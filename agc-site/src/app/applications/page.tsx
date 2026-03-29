import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { placeholderImages } from "@/data/images";
import { applicationsPageUiDefaults, buildApplicationsFormFields } from "@/data/applications-page";
import { getSiteSettings } from "@/lib/site-settings";
import { ApplicationsClient } from "./ApplicationsClient";

const applicationsStaticFallback = {
  heroTitle: "Volunteer application",
  heroSubtitle:
    "Your skills and time strengthen research, events, and policy dialogue across the continent. Tell us how you’d like to contribute — we read every submission.",
  applyIntro: "A few minutes now helps us match you to the right team. Fields marked * are required.",
  heroImage: placeholderImages.applications,
  ...applicationsPageUiDefaults,
};

type ApplicationsMerged = typeof applicationsStaticFallback & {
  fieldLabelOverrides?: Record<string, string>;
};

const ui = applicationsPageUiDefaults;

export default async function ApplicationsPage() {
  const [mergedRaw, siteSettings] = await Promise.all([
    getMergedPageContent<ApplicationsMerged>(
      "applications",
      cmsStaticOrEmpty(applicationsStaticFallback as ApplicationsMerged)
    ),
    getSiteSettings(),
  ]);

  const merged = mergedRaw;
  const overrides =
    merged.fieldLabelOverrides &&
    typeof merged.fieldLabelOverrides === "object" &&
    !Array.isArray(merged.fieldLabelOverrides)
      ? merged.fieldLabelOverrides
      : undefined;

  const heroImageRaw = merged.heroImage as string | undefined;
  const heroImage =
    (heroImageRaw ? await resolveImageUrl(heroImageRaw) : null) ||
    (process.env.BUILD_WITHOUT_DB === "1" ? placeholderImages.applications : undefined);

  return (
    <ApplicationsClient
      hero={{
        title: String(merged.heroTitle ?? "").trim(),
        subtitle: String(merged.heroSubtitle ?? "").trim(),
        image: heroImage,
        imageAlt: typeof merged.heroImageAlt === "string" ? merged.heroImageAlt : ui.heroImageAlt,
      }}
      applyIntro={String(merged.applyIntro ?? "").trim()}
      programsEmail={siteSettings.email.programs}
      formEyebrow={typeof merged.formEyebrow === "string" ? merged.formEyebrow : ui.formEyebrow}
      formCardTitle={typeof merged.formCardTitle === "string" ? merged.formCardTitle : ui.formCardTitle}
      sectionPersonal={typeof merged.sectionPersonal === "string" ? merged.sectionPersonal : ui.sectionPersonal}
      sectionExperience={
        typeof merged.sectionExperience === "string" ? merged.sectionExperience : ui.sectionExperience
      }
      sectionMotivation={
        typeof merged.sectionMotivation === "string" ? merged.sectionMotivation : ui.sectionMotivation
      }
      applicationTypeLabel={
        typeof merged.applicationTypeLabel === "string" ? merged.applicationTypeLabel : ui.applicationTypeLabel
      }
      optionVolunteer={typeof merged.optionVolunteer === "string" ? merged.optionVolunteer : ui.optionVolunteer}
      optionStaff={typeof merged.optionStaff === "string" ? merged.optionStaff : ui.optionStaff}
      optionFellow={typeof merged.optionFellow === "string" ? merged.optionFellow : ui.optionFellow}
      availabilityPlaceholder={
        typeof merged.availabilityPlaceholder === "string"
          ? merged.availabilityPlaceholder
          : ui.availabilityPlaceholder
      }
      availabilityFullTime={
        typeof merged.availabilityFullTime === "string" ? merged.availabilityFullTime : ui.availabilityFullTime
      }
      availabilityPartTime={
        typeof merged.availabilityPartTime === "string" ? merged.availabilityPartTime : ui.availabilityPartTime
      }
      availabilityFlexible={
        typeof merged.availabilityFlexible === "string" ? merged.availabilityFlexible : ui.availabilityFlexible
      }
      submitSending={typeof merged.submitSending === "string" ? merged.submitSending : ui.submitSending}
      submitIdle={typeof merged.submitIdle === "string" ? merged.submitIdle : ui.submitIdle}
      successMessage={typeof merged.successMessage === "string" ? merged.successMessage : ui.successMessage}
      emailWarnIntro={typeof merged.emailWarnIntro === "string" ? merged.emailWarnIntro : ui.emailWarnIntro}
      errorFallback={typeof merged.errorFallback === "string" ? merged.errorFallback : ui.errorFallback}
      formFields={buildApplicationsFormFields(overrides)}
    />
  );
}
