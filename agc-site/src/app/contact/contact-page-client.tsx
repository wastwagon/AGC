"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import type { SiteSettings } from "@/lib/site-settings";

type ContactContent = {
  title: string;
  subtitle: string;
  intro: string;
  formTitle: string;
  formDescription: string;
  formPlaceholders: { name: string; email: string; subject: string; message: string };
  submitLabel: string;
  /** Optional when CMS JSON omits the field (build/prerender safe). */
  divisions?: { name: string; email: string }[];
};

type ContactPageClientProps = { contactContent: ContactContent; heroImage: string; siteSettings: SiteSettings };

export function ContactPageClient({ contactContent, heroImage, siteSettings }: ContactPageClientProps) {
  const divisions = Array.isArray(contactContent.divisions) ? contactContent.divisions : [];
  const mapQuery = encodeURIComponent(siteSettings.address);
  const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailNotifyWarning, setEmailNotifyWarning] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setEmailNotifyWarning(Boolean(data.emailFailed));
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <PageHero
        title={contactContent.title}
        subtitle={contactContent.subtitle}
        image={heroImage}
        imageAlt="Get In Touch"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.contact },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-medium text-accent-800">Direct lines</p>
              <h2 className="page-heading mt-2 text-2xl sm:text-3xl">Get in touch</h2>
              <p className="page-prose mt-4">{contactContent.intro}</p>
              <ul className="mt-10 space-y-6">
                {divisions.map((div) => (
                  <li key={div.name} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{div.name}</p>
                      <a
                        href={`mailto:${div.email}`}
                        className="text-stone-600 hover:text-accent-700"
                      >
                        {div.email}
                      </a>
                    </div>
                  </li>
                ))}
                <li className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Phone</p>
                    <a
                      href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                      className="text-stone-600 hover:text-accent-700"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Address</p>
                    <address className="not-italic text-stone-600">
                      {siteSettings.address}
                    </address>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Office hours</p>
                    <p className="text-stone-600">{siteSettings.officeHours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200/90 bg-[#faf6ef] p-6 shadow-sm sm:p-8">
              <h2 className="page-heading text-xl sm:text-2xl">{contactContent.formTitle}</h2>
              <p className="page-prose mt-2 text-sm">{contactContent.formDescription}</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder={contactContent.formPlaceholders.name}
                      className="w-full rounded-xl border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder={contactContent.formPlaceholders.email}
                      className="w-full rounded-xl border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder={contactContent.formPlaceholders.subject}
                    className="w-full rounded-xl border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder={contactContent.formPlaceholders.message}
                    className="w-full rounded-xl border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
                  />
                </div>
                {status === "success" && (
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700">Thank you! Your message was received.</p>
                    {emailNotifyWarning && (
                      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                        We could not send the notification email automatically; your message is still saved. If you need an
                        urgent reply, email us directly at {siteSettings.email.programs}.
                      </p>
                    )}
                  </div>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-700 px-6 py-4 font-semibold text-white transition-colors hover:bg-accent-800 disabled:opacity-70"
                >
                  <Send className="h-5 w-5" />
                  {status === "sending" ? "Sending..." : contactContent.submitLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-[#fffcf7] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-2xl font-semibold text-stone-900 sm:text-3xl">Find Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-stone-600 sm:text-base">
            {siteSettings.address}
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            <iframe
              title="Africa Governance Centre location map"
              src={mapEmbedSrc}
              className="h-[420px] w-full sm:h-[500px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
