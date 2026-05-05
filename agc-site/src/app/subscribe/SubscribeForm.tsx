"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/Button";
import { subscribeTopics } from "@/lib/validations";

type SubscribeFormProps = {
  programsEmail: string;
};

const inputClass =
  "mt-1.5 w-full rounded-none border border-border/90 bg-white px-4 py-3 text-black shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500";
const labelClass = "block text-sm font-medium text-black";

export function SubscribeForm({ programsEmail }: SubscribeFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) return;

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          jobTitle: formData.get("jobTitle"),
          company: formData.get("company"),
          sector: formData.get("sector"),
          city: formData.get("city"),
          country: formData.get("country"),
          topics: formData.getAll("topics"),
          website: formData.get("website"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setStatus("success");
      setMessage("Thank you. Your subscription request has been received.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="page-card !rounded-none p-8 sm:p-10">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">Subscribe</h2>
      <p className="mt-2 text-sm leading-relaxed text-black">
        Fields marked with <span className="font-semibold text-accent-800">*</span> are required.
      </p>
      <form onSubmit={handleSubmit} className="relative mt-8 space-y-6">
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First Name <span className="text-accent-800">*</span>
            </label>
            <input id="firstName" name="firstName" required className={inputClass} autoComplete="given-name" />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last Name <span className="text-accent-800">*</span>
            </label>
            <input id="lastName" name="lastName" required className={inputClass} autoComplete="family-name" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelClass}>
              Email Address <span className="text-accent-800">*</span>
            </label>
            <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              Job Title <span className="text-accent-800">*</span>
            </label>
            <input id="jobTitle" name="jobTitle" required className={inputClass} autoComplete="organization-title" />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              Company/Organisation <span className="text-accent-800">*</span>
            </label>
            <input id="company" name="company" required className={inputClass} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="sector" className={labelClass}>
              Sector <span className="text-accent-800">*</span>
            </label>
            <input id="sector" name="sector" required className={inputClass} placeholder="e.g. Government, NGO, academia" />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City <span className="text-accent-800">*</span>
            </label>
            <input id="city" name="city" required className={inputClass} autoComplete="address-level2" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="country" className={labelClass}>
              Country <span className="text-accent-800">*</span>
            </label>
            <input id="country" name="country" required className={inputClass} autoComplete="country-name" />
          </div>
        </div>

        <fieldset className="border border-border/80 bg-white px-4 py-4 sm:px-5">
          <legend className="px-1 text-sm font-medium text-black">I would like to receive updates on:</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {subscribeTopics.map((topic) => (
              <label key={topic} className="flex cursor-pointer items-start gap-3 rounded-none border border-border/70 bg-slate-50 px-3 py-3 text-sm text-black transition-colors hover:bg-slate-100">
                <input
                  type="checkbox"
                  name="topics"
                  value={topic}
                  className="mt-0.5 h-4 w-4 rounded border-border text-accent-700 focus:ring-accent-500"
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="text-sm leading-relaxed text-slate-600">
          We will use your details to manage your subscription and send the updates you choose. For direct questions,
          email <a href={`mailto:${programsEmail}`} className="font-medium text-accent-700 hover:underline">{programsEmail}</a>.
        </p>

        {status === "success" && <p className="text-sm text-emerald-700">{message}</p>}
        {status === "error" && <p className="text-sm text-red-600">{message}</p>}

        <Button type="submit" disabled={status === "sending" || status === "success"} className="inline-flex items-center gap-2 !rounded-none">
          <Send className="h-4 w-4" />
          {status === "sending" ? "Submitting…" : status === "success" ? "Subscribed" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}