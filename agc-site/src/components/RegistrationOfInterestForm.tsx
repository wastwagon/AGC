"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Send } from "lucide-react";
import type { RoiFormConfig } from "@/data/roi-forms";

type RegistrationOfInterestFormProps = {
  config: RoiFormConfig;
};

export function RegistrationOfInterestForm({ config }: RegistrationOfInterestFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailNotifyWarning, setEmailNotifyWarning] = useState(false);
  const [confirmation, setConfirmation] = useState<{ title: string; body: string[] } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) return;

    const areas = formData.getAll("areasOfInterest").map(String).filter(Boolean);
    const declarations = [
      formData.get("declareAccurate"),
      formData.get("declareNotAcceptance"),
      formData.get("declareSubjectToReview"),
      formData.get("declareConsent"),
    ];
    if (declarations.some((d) => d !== "on")) {
      setStatus("error");
      setErrorMessage("Please accept all declarations before submitting.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    setEmailNotifyWarning(false);

    try {
      const res = await fetch("/api/registration-of-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: config.eventType,
          title: formData.get("title") || undefined,
          fullName: formData.get("fullName"),
          jobTitle: formData.get("jobTitle"),
          organisation: formData.get("organisation"),
          country: formData.get("country"),
          email: formData.get("email"),
          telephone: formData.get("telephone"),
          organisationType: formData.get("organisationType"),
          participationType: formData.get("participationType"),
          areasOfInterest: areas,
          previousParticipation: formData.get("previousParticipation") === "yes",
          visaSupport: formData.get("visaSupport") === "yes",
          accessibilityReqs: formData.get("accessibilityReqs") || undefined,
          dietaryReqs: formData.get("dietaryReqs") || undefined,
          howHeard: formData.get("howHeard"),
          declarationsAccepted: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setEmailNotifyWarning(Boolean(data.emailFailed));
      setConfirmation(
        data.confirmation ?? {
          title: config.confirmationTitle,
          body: config.confirmationBody,
        }
      );
      setStatus("success");
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-none border border-border/90 bg-white px-4 py-2.5 text-black shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500";
  const labelClass = "block text-sm font-medium text-black";
  const sectionClass = "space-y-5 border border-border/70 bg-white p-6 sm:p-8";
  const sectionTitleClass = "font-serif text-xl font-semibold text-black sm:text-2xl";
  const checkLabelClass = "flex items-start gap-3 text-sm text-black";

  if (status === "success" && confirmation) {
    return (
      <div className="space-y-4 border border-emerald-200/80 bg-emerald-50/60 p-6 sm:p-8" role="status">
        <h2 className="font-serif text-xl font-semibold text-emerald-950 sm:text-2xl">{confirmation.title}</h2>
        {confirmation.body.map((p) => (
          <p key={p} className="text-[1.02rem] leading-relaxed text-emerald-950/90">
            {p}
          </p>
        ))}
        {emailNotifyWarning && (
          <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Your submission was saved, but we could not send the confirmation email automatically. If you need help,
            contact{" "}
            <a href={`mailto:${config.fromEmail}`} className="font-medium underline">
              {config.fromEmail}
            </a>
            .
          </p>
        )}
        <Button
          type="button"
          variant="secondary"
          className="!rounded-none"
          onClick={() => {
            setStatus("idle");
            setConfirmation(null);
          }}
        >
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8">
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor={`roi-website-${config.eventType}`}>Website</label>
        <input
          type="text"
          id={`roi-website-${config.eventType}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Welcome</h2>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-black">{config.welcomeIntro}</p>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-black/90">{config.welcomeBody}</p>
        <p className="mt-4 text-sm font-medium text-black">
          If you wish to be considered for participation, please complete this Registration of Interest form.
        </p>
        <div className="mt-4 border-l-2 border-accent-600 pl-4">
          <p className="text-sm font-semibold text-black">Please note:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-black/90">
            {config.noteItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Section 1: Personal Information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`roi-title-${config.eventType}`} className={labelClass}>
              Title
            </label>
            <select id={`roi-title-${config.eventType}`} name="title" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              {config.titles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`roi-name-${config.eventType}`} className={labelClass}>
              Full Name <span className="text-accent-800">*</span>
            </label>
            <input
              id={`roi-name-${config.eventType}`}
              name="fullName"
              required
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor={`roi-job-${config.eventType}`} className={labelClass}>
              Job Title / Position <span className="text-accent-800">*</span>
            </label>
            <input id={`roi-job-${config.eventType}`} name="jobTitle" required className={inputClass} />
          </div>
          <div>
            <label htmlFor={`roi-org-${config.eventType}`} className={labelClass}>
              Organisation <span className="text-accent-800">*</span>
            </label>
            <input
              id={`roi-org-${config.eventType}`}
              name="organisation"
              required
              className={inputClass}
              autoComplete="organization"
            />
          </div>
          <div>
            <label htmlFor={`roi-country-${config.eventType}`} className={labelClass}>
              Country / Nationality <span className="text-accent-800">*</span>
            </label>
            <input
              id={`roi-country-${config.eventType}`}
              name="country"
              required
              className={inputClass}
              autoComplete="country-name"
            />
          </div>
          <div>
            <label htmlFor={`roi-email-${config.eventType}`} className={labelClass}>
              Email Address <span className="text-accent-800">*</span>
            </label>
            <input
              id={`roi-email-${config.eventType}`}
              name="email"
              type="email"
              required
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`roi-tel-${config.eventType}`} className={labelClass}>
              Telephone Number (including country code) <span className="text-accent-800">*</span>
            </label>
            <input
              id={`roi-tel-${config.eventType}`}
              name="telephone"
              type="tel"
              required
              className={inputClass}
              autoComplete="tel"
              placeholder="+254 …"
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Section 2: Professional Information</h2>
        <div>
          <label htmlFor={`roi-orgtype-${config.eventType}`} className={labelClass}>
            {config.organisationTypeLabel} <span className="text-accent-800">*</span>
          </label>
          <select
            id={`roi-orgtype-${config.eventType}`}
            name="organisationType"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="">Select…</option>
            {config.organisationTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Section 3: Participation Interest</h2>
        <div>
          <label htmlFor={`roi-part-${config.eventType}`} className={labelClass}>
            Which best describes your intended participation? <span className="text-accent-800">*</span>
          </label>
          <select
            id={`roi-part-${config.eventType}`}
            name="participationType"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="">Select…</option>
            {config.participationTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="mt-2">
          <legend className={labelClass}>
            Areas of Interest (select all that apply) <span className="text-accent-800">*</span>
          </legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {config.areasOfInterest.map((area) => (
              <label key={area} className={checkLabelClass}>
                <input
                  type="checkbox"
                  name="areasOfInterest"
                  value={area}
                  className="mt-0.5 h-4 w-4 rounded-none border-border text-accent-700 focus:ring-accent-500"
                />
                <span>{area}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Section 4: Previous Engagement</h2>
        <fieldset>
          <legend className={labelClass}>
            {config.previousQuestion} <span className="text-accent-800">*</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className={checkLabelClass}>
              <input type="radio" name="previousParticipation" value="yes" required className="mt-0.5" />
              <span>Yes</span>
            </label>
            <label className={checkLabelClass}>
              <input type="radio" name="previousParticipation" value="no" required className="mt-0.5" />
              <span>No</span>
            </label>
          </div>
        </fieldset>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Section 5: Additional Information</h2>
        <fieldset>
          <legend className={labelClass}>
            Do you require visa support should your application be approved?{" "}
            <span className="text-accent-800">*</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className={checkLabelClass}>
              <input type="radio" name="visaSupport" value="yes" required className="mt-0.5" />
              <span>Yes</span>
            </label>
            <label className={checkLabelClass}>
              <input type="radio" name="visaSupport" value="no" required className="mt-0.5" />
              <span>No</span>
            </label>
          </div>
        </fieldset>
        <div>
          <label htmlFor={`roi-access-${config.eventType}`} className={labelClass}>
            Do you have any accessibility requirements?
          </label>
          <textarea
            id={`roi-access-${config.eventType}`}
            name="accessibilityReqs"
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`roi-diet-${config.eventType}`} className={labelClass}>
            Dietary Requirements (Optional)
          </label>
          <textarea id={`roi-diet-${config.eventType}`} name="dietaryReqs" rows={2} className={inputClass} />
        </div>
        <div>
          <label htmlFor={`roi-heard-${config.eventType}`} className={labelClass}>
            {config.howHeardQuestion} <span className="text-accent-800">*</span>
          </label>
          <select
            id={`roi-heard-${config.eventType}`}
            name="howHeard"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="">Select…</option>
            {config.howHeardOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Declaration</h2>
        <div className="mt-4 space-y-3">
          <label className={checkLabelClass}>
            <input type="checkbox" name="declareAccurate" required className="mt-0.5 h-4 w-4 rounded-none" />
            <span>I certify that the information provided is accurate and complete.</span>
          </label>
          <label className={checkLabelClass}>
            <input type="checkbox" name="declareNotAcceptance" required className="mt-0.5 h-4 w-4 rounded-none" />
            <span>
              I understand that submitting this Registration of Interest does not constitute acceptance or confirmation
              of participation.
            </span>
          </label>
          <label className={checkLabelClass}>
            <input type="checkbox" name="declareSubjectToReview" required className="mt-0.5 h-4 w-4 rounded-none" />
            <span>
              I acknowledge that participation is subject to review and approval by the {config.secretariatLabel}.
            </span>
          </label>
          <label className={checkLabelClass}>
            <input type="checkbox" name="declareConsent" required className="mt-0.5 h-4 w-4 rounded-none" />
            <span>
              I consent to the processing of my personal information for purposes related to{" "}
              {config.declarationEventLabel}, in accordance with applicable data protection laws.
            </span>
          </label>
        </div>
      </div>

      {status === "error" && (
        <p className="border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-900">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 !rounded-none"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Submitting…" : "Submit Registration of Interest"}
      </Button>
    </form>
  );
}
