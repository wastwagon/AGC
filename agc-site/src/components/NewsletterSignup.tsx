"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SiteNewsletterChrome } from "@/data/site-chrome";

export function NewsletterSignup({
  copy,
  variant = "default",
}: {
  copy: SiteNewsletterChrome;
  /** `footerHero` = single bordered row, email + arrow submit (heading/description rendered by parent). */
  variant?: "default" | "footerHero";
}) {
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

  const statusLine =
    message ? (
      <p
        className={`mt-3 text-sm ${status === "success" ? "text-accent-300" : "text-red-300"} ${variant === "footerHero" ? "text-center" : ""}`}
        role="status"
      >
        {message}
      </p>
    ) : null;

  if (variant === "footerHero") {
    return (
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full overflow-hidden rounded-none border border-white/60 bg-white/[0.04] shadow-none transition-colors focus-within:border-white/90 focus-within:bg-white/[0.07]"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.placeholder}
            required
            disabled={status === "loading" || status === "success"}
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 py-4 text-[15px] text-white placeholder-white/50 outline-none ring-0 disabled:opacity-60 sm:py-[1.125rem] sm:text-base"
            aria-label={copy.emailAriaLabel}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex shrink-0 items-center justify-center rounded-none border-l border-white/45 bg-white/[0.1] px-5 text-white transition-colors hover:bg-white/[0.18] disabled:opacity-60"
            aria-label={copy.submit}
          >
            {status === "loading" ? (
              <span className="text-xs font-medium">{copy.submitLoading}</span>
            ) : status === "success" ? (
              <span className="text-xs font-medium">{copy.subscribed}</span>
            ) : (
              <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden />
            )}
          </button>
        </form>
        {statusLine}
      </div>
    );
  }

  return (
    <div id="newsletter" className="mt-6 scroll-mt-24">
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
      {statusLine}
    </div>
  );
}
