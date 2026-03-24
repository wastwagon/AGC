"use client";

import { useState } from "react";
import { volunteerFormFields } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";

type ApplicationsClientProps = {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  applyIntro: string;
};

export function ApplicationsClient({ hero, applyIntro }: ApplicationsClientProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          position: formData.get("position"),
          organization: formData.get("organization"),
          country: formData.get("country"),
          city: formData.get("city"),
          experience: formData.get("experience"),
          skills: formData.get("skills"),
          motivation: formData.get("motivation"),
          availability: formData.get("availability"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-2.5 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500";
  const labelClass = "block text-sm font-medium text-stone-700";

  return (
    <>
      <PageHero
        variant="minimal"
        title={hero.title}
        subtitle={hero.subtitle}
        image={hero.image}
        imageAlt="Volunteer application"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Get Involved", href: "/get-involved" },
          { label: "Volunteer", href: "/get-involved/volunteer" },
          { label: "Application" },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 border-l-[3px] border-accent-600 py-2 pl-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone-500">Apply</p>
            <p className="mt-2 page-prose max-w-xl text-[1.02rem]">{applyIntro}</p>
          </div>

          <div className="page-card p-8 sm:p-10">
            <h2 className="page-heading text-xl text-stone-900">Application form</h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-10">
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Personal information</h3>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {volunteerFormFields.personalInfo.map((field) => (
                    <div
                      key={field.name}
                      className={field.name === "fullName" || field.name === "email" ? "sm:col-span-2" : ""}
                    >
                      <label htmlFor={field.name} className={labelClass}>
                        {field.label} {field.required && <span className="text-accent-800">*</span>}
                      </label>
                      <input type={field.type} id={field.name} name={field.name} required={field.required} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200/80 pt-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Experience & skills</h3>
                <div className="mt-5 space-y-5">
                  {volunteerFormFields.experience.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className={labelClass}>
                        {field.label}
                      </label>
                      <textarea id={field.name} name={field.name} rows={4} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200/80 pt-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Motivation & availability</h3>
                <div className="mt-5 space-y-5">
                  {volunteerFormFields.motivation.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className={labelClass}>
                        {field.label} {field.required && <span className="text-accent-800">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select id={field.name} name={field.name} className={inputClass}>
                          <option value="">Select your availability</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      ) : (
                        <textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          rows={4}
                          className={inputClass}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {status === "success" && (
                <p className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
                  Thank you — your application is in. We&apos;ll be in touch when there&apos;s a fit.
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-900">{errorMessage}</p>
              )}

              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
