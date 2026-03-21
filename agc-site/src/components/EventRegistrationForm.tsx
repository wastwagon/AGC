"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { CmsEvent } from "@/lib/content";

type EventRegistrationFormProps = { event: CmsEvent };

export function EventRegistrationForm({ event }: EventRegistrationFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("");

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
          <h2 className="page-heading text-2xl text-stone-900">You&apos;re registered</h2>
          <p className="mt-3 page-prose mx-auto max-w-md text-[0.98rem]">
            A confirmation email has been sent to you. Download and print your accreditation badge below.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild href={badgeUrl} variant="primary">
              Download Badge
            </Button>
            <Button asChild href="/events" variant="outline">
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="page-card p-6 sm:p-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-500">Your details</p>
      <h2 className="page-heading mt-2 text-xl text-stone-900">{event.title}</h2>
      <p className="mt-2 text-sm text-stone-600">
        {new Date(event.start_date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        {event.location && ` • ${event.location}`}
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
            placeholder="+233 XX XXX XXXX"
          />
        </div>
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-stone-700">
            Organization
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            className="mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
            placeholder="Your organization"
          />
        </div>
        <div>
          <label htmlFor="dietaryReqs" className="block text-sm font-medium text-stone-700">
            Dietary Requirements
          </label>
          <input
            id="dietaryReqs"
            name="dietaryReqs"
            type="text"
            className="mt-1 block w-full rounded-lg border border-stone-300/90 bg-[#fffcf7] px-4 py-3 text-stone-900 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500"
            placeholder="e.g. Vegetarian, allergies"
          />
        </div>
      </div>

      {message && (
        <p className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-stone-600"}`}>{message}</p>
      )}

      <div className="mt-8 flex gap-4">
        <Button type="submit" variant="primary" disabled={status === "loading"}>
          {status === "loading" ? "Registering…" : "Register"}
        </Button>
        <Button asChild href="/events" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
