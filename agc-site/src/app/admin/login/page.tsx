"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }
      if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-border/90 bg-white px-3.5 py-2.5 text-black placeholder:text-black focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500";

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-3 rounded-xl p-2 transition-opacity hover:opacity-90">
          <Image src="/agc-logo.png" alt="Africa Governance Centre" width={56} height={56} className="h-14 w-14 object-contain" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black">Staff access</span>
        </Link>
      </div>

      <div className="page-card border-t-[3px] border-t-accent-700 p-8 shadow-[0_20px_50px_-20px_rgba(30,51,48,0.12)] sm:p-9">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-800">
            <Lock className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="page-heading text-xl text-black">Sign in</h1>
            <p className="mt-1 text-sm text-black">CMS for content, events, and media.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@organisation.org"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-black">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-black transition-colors hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded-lg border border-red-200/80 bg-red-50/90 px-3 py-2 text-sm text-red-900" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-800 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-black">
          <Link href="/" className="text-accent-800 underline decoration-accent-300 underline-offset-2 hover:text-accent-950">
            ← Public site
          </Link>
        </p>
      </div>
    </div>
  );
}
