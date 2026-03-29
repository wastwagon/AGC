"use client";

import { useState } from "react";
import type { SiteNewsletterChrome } from "@/data/site-chrome";

export function NewsletterSignup({ copy }: { copy: SiteNewsletterChrome }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setEmail("");
        setMessage(copy.successMessage);
      } else {
        setStatus("error");
        setMessage(data.error || copy.errorGeneric);
      }
    } catch {
      setStatus("error");
      setMessage(copy.errorGeneric);
    }
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-300">{copy.heading}</h4>
      <p className="mt-2 text-[14px] text-white/80">{copy.description}</p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.placeholder}
          required
          disabled={status === "loading" || status === "success"}
          className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-[15px] text-white placeholder-white/50 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-60"
          aria-label={copy.emailAriaLabel}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="shrink-0 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {status === "loading"
            ? copy.submitLoading
            : status === "success"
              ? copy.subscribed
              : copy.submit}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${status === "success" ? "text-accent-300" : "text-red-300"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
