# Design, features & handover — status and gaps

Single reference for **what is implemented**, **what is still placeholder or optional**, and **what the receiving team should verify** before go-live. Last aligned with repo capabilities (submissions pipeline, admin, media, auth).

---

## A. Handover checklist (functionality)

Use this as a sign-off list for whoever operates the site after build.

| Item | What to verify |
|------|----------------|
| **Database** | `DATABASE_URL` set; `npx prisma migrate deploy` run on each environment after deploy. |
| **Admin access** | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, **`AUTH_SECRET`** (required in production). Login at `/admin/login`. |
| **Public URL** | `NEXT_PUBLIC_SITE_URL` matches the live domain (OG, RSS links, emails, badges). |
| **Email** | `RESEND_API_KEY` (+ verified `RESEND_FROM_EMAIL` domain). Without Resend, submissions **still save to the database**; staff only get email if Resend works. |
| **Submissions** | `/admin/submissions` — newsletter, applications, contact, partnership, work-with-us; CSV export; delete = permanent (no auto-expiry). |
| **Dashboard** | `/admin` — inbox counts; links into submissions. |
| **Media** | Upload path and **Docker volumes** (if used) for `public/uploads` + `data/media-library.json` — document backup/restore. |
| **Redis** | Optional for rate limiting; multi-instance deploys should set `REDIS_URL` if you outgrow in-memory limits (see `src/lib/rate-limit.ts`). |
| **Automated checks** | `npm run check` (lint + unit tests + build). Optional: `npm run test:e2e` after `npx playwright install chromium`. |
| **Credentials** | Rotate `ADMIN_PASSWORD` and `AUTH_SECRET` after handover if builders had access. |

---

## B. What is complete (website + admin)

These are **in code** and considered part of the delivered product:

- **Public forms (all store in Postgres first):** contact, newsletter, volunteer/staff/fellow applications, partnership inquiry, work-with-us (careers) inquiry.
- **Admin:** NextAuth + **`src/proxy.ts`** guards `/admin` (except login). Server actions on mutations also check session.
- **Submissions:** List, pagination, per-type CSV export, detail pages, delete actions.
- **Media library:** Upload, reference blocking on delete, **orphan list** + delete on `/admin/media`.
- **Site settings:** Global contact, logos (header + optional footer), social, etc. (`site-settings` page content + forms).
- **CMS:** News, events, publications, team, programs, projects, partners, page content (incl. home/about), taxonomy, event registrations, check-in scanner.
- **News RSS:** `/news/feed.xml`.
- **Search:** Header search via `/api/search` (Fuse over key content types).

---

## C. Design gaps

| Gap | Current state | Recommendation |
|-----|----------------|-----------------|
| **Hero / listing imagery** | Many routes fall back to `placeholderImages` or `/uploads/placeholder.svg` until CMS/env provides real assets. | Replace via **Admin → Media** + page editors; or `NEXT_PUBLIC_*` image envs documented in `GAPS-PHASES.md`. |
| **Home testimonial & fellow spotlight** | Default copy in `src/data/content.ts` is marked **PLACEHOLDER** (fictional names until approved). | Publish real quote + attribution in **Page Content → home** (or replace static defaults after legal/comms sign-off). |
| **Partner strip / logos** | May still be text or generic assets until edited in admin. | Upload partner logos in **Admin → Partners** and tune home partner strip fields. |
| **Language selector** | UI suggests multiple languages; **no i18n** — switching does not change copy. | Remove control until `next-intl` (or similar) is planned, or implement real locales. |
| **Header utility styling** | `LanguageSelector` / `SearchModal` may still use `slate` tokens vs `stone` elsewhere. | Optional visual pass (`docs/UI-SITEWIDE.md`). |
| **Skip to main content** | Not a standard visible-on-focus skip link. | Add skip link targeting `#main` (or main landmark) — see `docs/UX-A11Y.md`. |
| **Per-page Open Graph images** | Default OG in layout; not every route sets `openGraph.images` from its hero image. | Add `generateMetadata` image fields for news, publications, events (and key landing pages) when assets exist. |
| **Accessibility audit** | Partial patterns documented; no single axe/Lighthouse report checked in CI. | Run manual or automated a11y pass before formal handover. |

---

## D. Feature / product gaps (optional next phase)

| Topic | Current state | If you need more |
|-------|----------------|------------------|
| **APP Summit** | Content largely in `src/data/app-summit.ts`; registration CTA may point at generic contact. | Move copy to CMS; add dedicated registration (reuse **events** flow or new form + model). |
| **News tags on article** | Tag **listing** routes exist; tags may be omitted on **article detail** UI. | Decide: show tags on detail for discovery, or deprecate tag URLs. |
| **Multi-user admin** | Single shared **Credentials** user (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). | Add NextAuth database adapter + `User` model + roles if several staff need separate accounts and audit trails. |
| **Newsletter campaigns** | Signups are stored; no built-in **broadcast** tool. | Export CSV from admin and use Mailchimp/Resend Audiences, or integrate a provider. |
| **Media at scale** | Files on disk (+ JSON metadata). | S3-compatible storage + signed URLs if traffic or HA requirements grow. |
| **Rate limiting** | In-memory or Redis-backed depending on env. | Ensure `REDIS_URL` in production for multiple app instances. |

---

## E. Implementation / ops notes

| Topic | Note |
|-------|------|
| **Sitemap** | Uses Prisma; build-time behaviour depends on `BUILD_WITHOUT_DB` and DB availability — see `src/app/sitemap.ts` and deploy docs. |
| **E2E** | `e2e/join-us-form.spec.ts` mocks `POST /api/join-us`; dev server uses `BUILD_WITHOUT_DB=1` in Playwright config so CI/local need not have Postgres for that smoke test. |
| **Secrets in repo** | Do not commit `.env*`. `ADMIN_CREDENTIALS.md` (if present) should be **local-only** or removed after handover. |

---

## F. Quick priority matrix (post-handover polish)

| Priority | Area | Item |
|----------|------|------|
| **High** | Content | Replace placeholder testimonial/spotlight and hero images with approved assets. |
| **High** | Ops | Production env: DB migrations, `AUTH_SECRET`, Resend, `NEXT_PUBLIC_SITE_URL`, backups for DB + uploads + media JSON. |
| **Medium** | Design | Skip link; OG images on key templates; resolve language selector (remove or implement). |
| **Medium** | Product | APP Summit CMS + registration decision; multi-user admin if team > 1. |
| **Low** | Design | Full token alignment (slate → stone); exhaustive a11y sweep. |
| **Low** | Infra | S3 media; Redis everywhere for rate limit. |

---

## G. References

| Doc | Purpose |
|-----|---------|
| `README.md` | Local setup, env, deployment entrypoints |
| `docs/GAPS-PHASES.md` | Image/social/env phased content notes |
| `docs/UI-SITEWIDE.md`, `docs/UX-A11Y.md`, `docs/UX-ENHANCEMENT-PHASES.md` | UI and accessibility conventions |
| `docs/DOCKER-DEPLOYMENT.md`, root `docs/COOLIFY-DEPLOY.md` | Hosting |
| `prisma/schema.prisma` | All content + submission models |

---

### Schema note (obsolete lines in older gap lists)

The database includes among others: `NewsletterSignup`, `VolunteerApplication`, `ContactSubmission`, `PartnershipInquiry`, `JoinUsInquiry`, `EventRegistration`, plus full CMS models. Any older doc that says “newsletter/applications/contact are email-only with no DB” is **out of date**.
