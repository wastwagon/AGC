"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Send } from "lucide-react";

type PartnershipInquiryFormProps = {
  programsEmail: string;
};

export function PartnershipInquiryForm({ programsEmail }: PartnershipInquiryFormProps) {
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
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          organization: formData.get("organization"),
          focusArea: formData.get("focusArea"),
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

  const inputClass =
    "mt-1.5 w-full rounded-none border border-border/90 bg-white px-4 py-2.5 text-black shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-500";
  const labelClass = "block text-sm font-medium text-black";

  return (
    <div className="w-full page-card !rounded-none p-6 sm:p-8">
      <h2 className="page-heading text-xl text-black">Partnership inquiry form</h2>
      <p className="mt-2 text-sm text-black">
        Tell us about your organisation and how you&apos;d like to collaborate. We store submissions securely and reply from{" "}
        <a href={`mailto:${programsEmail}`} className="font-medium text-accent-700 hover:underline">
          {programsEmail}
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} className="relative mt-6 space-y-5">
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pi-name" className={labelClass}>
              Name <span className="text-accent-800">*</span>
            </label>
            <input id="pi-name" name="name" required className={inputClass} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="pi-email" className={labelClass}>
              Email <span className="text-accent-800">*</span>
            </label>
            <input id="pi-email" name="email" type="email" required className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="pi-org" className={labelClass}>
              Organisation
            </label>
            <input id="pi-org" name="organization" className={inputClass} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="pi-focus" className={labelClass}>
              Focus area
            </label>
            <input id="pi-focus" name="focusArea" placeholder="e.g. Research, events, funding" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pi-message" className={labelClass}>
              Message <span className="text-accent-800">*</span>
            </label>
            <textarea id="pi-message" name="message" required rows={5} className={inputClass} />
          </div>
        </div>

        {status === "success" && (
          <div className="space-y-2 text-sm">
            <p className="rounded-none border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-emerald-900">
              Thank you — we received your inquiry.
            </p>
            {emailNotifyWarning && (
              <p className="rounded-none border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                We could not send the notification email automatically; your inquiry is still saved. For urgent matters,
                email {programsEmail} directly.
              </p>
            )}
          </div>
        )}
        {status === "error" && (
          <p className="rounded-none border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-900">{errorMessage}</p>
        )}

        <Button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 !rounded-none">
          <Send className="h-4 w-4" />
          {status === "sending" ? "Sending…" : "Send inquiry"}
        </Button>
      </form>
    </div>
  );
}
