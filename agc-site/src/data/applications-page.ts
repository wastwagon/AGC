import { volunteerFormFields } from "./content";

/** Default UI strings for the volunteer applications page (merged with CMS `applications` JSON). */
export const applicationsPageUiDefaults = {
  heroImageAlt: "Volunteer application",
  formEyebrow: "Apply",
  formCardTitle: "Application form",
  sectionPersonal: "Personal information",
  sectionExperience: "Experience & skills",
  sectionMotivation: "Motivation & availability",
  applicationTypeLabel: "I am applying as",
  optionVolunteer: "Volunteer",
  optionStaff: "Staff / career interest",
  optionFellow: "Fellowship / research role",
  availabilityPlaceholder: "Select your availability",
  availabilityFullTime: "Full-time",
  availabilityPartTime: "Part-time",
  availabilityFlexible: "Flexible",
  submitSending: "Submitting…",
  submitIdle: "Submit application",
  successMessage:
    "Thank you — your application is in. We will be in touch when there is a fit.",
  emailWarnIntro:
    "We could not send the notification email automatically; your application is still saved. If this is time-sensitive, email",
  errorFallback: "Something went wrong. Please try again.",
} as const;

export type VolunteerFieldDef = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
};

export type ApplicationsFormFields = {
  personalInfo: VolunteerFieldDef[];
  experience: VolunteerFieldDef[];
  motivation: VolunteerFieldDef[];
};

function labelWithOverrides(
  name: string,
  fallback: string,
  overrides: Record<string, string> | undefined
): string {
  const v = overrides?.[name];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}

/** Merge static field defs with optional `fieldLabelOverrides` from page JSON (`name` → label). */
export function buildApplicationsFormFields(
  overrides: Record<string, string> | undefined
): ApplicationsFormFields {
  const mapField = (f: { name: string; label: string; type: string; required?: boolean }) => ({
    ...f,
    label: labelWithOverrides(f.name, f.label, overrides),
  });
  return {
    personalInfo: volunteerFormFields.personalInfo.map(mapField),
    experience: volunteerFormFields.experience.map(mapField),
    motivation: volunteerFormFields.motivation.map(mapField),
  };
}
