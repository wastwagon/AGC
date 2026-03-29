import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/** Allow `next/image` optimizer to fetch same-origin media on any deployment host (VPS, sslip.io, etc.). */
function buildImageRemotePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
    { protocol: "http", hostname: "localhost", pathname: "/**" },
    { protocol: "https", hostname: "localhost", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    { protocol: "https", hostname: "127.0.0.1", pathname: "/**" },
    // Common staging / preview hostnames (Coolify, raw IP via sslip, etc.)
    { protocol: "http", hostname: "**.sslip.io", pathname: "/**" },
    { protocol: "https", hostname: "**.sslip.io", pathname: "/**" },
  ];

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      const u = new URL(site);
      const protocol = u.protocol === "https:" ? "https" : "http";
      patterns.push({
        protocol,
        hostname: u.hostname,
        pathname: "/**",
        ...(u.port ? { port: u.port } : {}),
      });
    } catch {
      /* ignore invalid URL */
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: buildImageRemotePatterns(),
    /** Media library files live under /uploads/*; be explicit for the image optimizer. */
    localPatterns: [{ pathname: "/uploads/**", search: "" }],
    /**
     * In dev, the optimizer sometimes follows absolute `http://localhost:…/uploads/…`; Node then
     * treats 127.0.0.1 as a private IP and returns 400 without this flag.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      silent: !process.env.CI,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
  : nextConfig;
