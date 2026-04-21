"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { CmsEvent } from "@/lib/content";

type EventRegistrationFormProps = {
  event: CmsEvent;
  /** Brookings-style registration page: no duplicate title block; flat bordered fields. */
  embedded?: boolean;
};

const embeddedFieldClass =
  "mt-1.5 block w-full rounded-none border border-stone-300 bg-white px-3 py-2.5 text-stone-900 shadow-none placeholder:text-stone-400 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500";
const defaultFieldClass =
  "mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500";

export function EventRegistrationForm({ event, embedded = false }: EventRegistrationFormProps) {
  const inputClass = embedded ? embeddedFieldClass : defaultFieldClass;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("");
  const [publicRegistrationId, setPublicRegistrationId] = useState("");
  const [registeredAsWaitlist, setRegisteredAsWaitlist] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      eventSlug: event.slug,
      eventId: event.id,
      eventTitle: event.title,
      eventStartDate: event.start_date,
      eventEndDate: event.end_date,
      eventLocation: event.venue_name || event.location,
      registrationDeadline: event.registration_deadline,
      capacity: event.capacity,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      organization: formData.get("organization") || undefined,
      dietaryReqs: formData.get("dietaryReqs") || undefined,
    };

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Registration failed");
        return;
      }

      setStatus("success");
      setBadgeUrl(data.registration.badgeUrl);
      setPublicRegistrationId(data.registration.registrationId || "");
      setRegisteredAsWaitlist(Boolean(data.registration.waitlisted));
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Registration failed. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="page-card border-l-[4px] border-l-accent-600 p-8 sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="page-heading text-2xl text-stone-900">
            {registeredAsWaitlist ? "You’re on the waitlist" : "You’re registered"}
          </h2>
          <p className="mt-3 page-prose mx-auto max-w-md text-[0.98rem]">
            {registeredAsWaitlist
              ? "We’ve saved your details. Open your reference badge below; check-in stays blocked until organisers confirm a spot. Watch your email for updates."
              : "A confirmation email has been sent to you. Open your badge in a new tab to print or save. Present the QR code or your registration ID at the door."}
          </p>
          {publicRegistrationId ? (
            <p className="mt-4 font-mono text-sm font-medium text-stone-800">
              Registration ID: <span className="select-all">{publicRegistrationId}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild href={badgeUrl} target="_blank" variant="primary" size="lg">
              Open badge (print)
            </Button>
            <Button asChild href="/events" variant="outline">
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formShell = embedded
    ? "mx-auto mt-10 max-w-xl border border-stone-200 bg-white px-5 py-8 sm:px-8"
    : "page-card p-6 sm:p-8";

  return (
    <form onSubmit={handleSubmit} className={formShell}>
      {!embedded ? (
        <>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-500">Your details</p>
          <h2 className="page-heading mt-2 text-xl text-stone-900">{event.title}</h2>
          <p className="mt-2 text-sm text-stone-600">
            {new Date(event.start_date).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {event.location && ` • ${event.location}`}
          </p>
        </>
      ) : null}

      <div className={embedded ? "space-y-5" : "mt-8 space-y-6"}>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-stone-800">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className={inputClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-800">
            Email <span className="text-red-600">*</span>
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-800">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+233 XX XXX XXXX" />
        </div>
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-stone-800">
            Organization
          </label>
          <input id="organization" name="organization" type="text" className={inputClass} placeholder="Your organization" />
        </div>
        <div>
          <label htmlFor="dietaryReqs" className="block text-sm font-medium text-stone-800">
            Dietary Requirements
          </label>
          <input
            id="dietaryReqs"
            name="dietaryReqs"
            type="text"
            className={inputClass}
            placeholder="e.g. Vegetarian, allergies"
          />
        </div>
      </div>

      {message && (
        <p className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-stone-600"}`}>{message}</p>
      )}

      <div className={`mt-8 flex flex-wrap gap-3 ${embedded ? "justify-center sm:justify-start" : ""}`}>
        <Button
          type="submit"
          variant="primary"
          disabled={status === "loading"}
          className={embedded ? "!rounded-none !bg-accent-600 hover:!bg-accent-700" : undefined}
        >
          {status === "loading" ? "Registering…" : "Register"}
        </Button>
        <Button asChild href="/events" variant="outline" className={embedded ? "!rounded-none" : undefined}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
