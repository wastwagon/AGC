# Gaps: Design, Features, Implementation & Functionality

A single reference for what’s done, what’s placeholder, and what’s missing so you can prioritise next work.

---

## 1. Design gaps

| Gap | Current state | Recommendation |
|-----|----------------|-----------------|
| **Real imagery** | All hero/content images use `placeholderImages` (Unsplash or `/uploads/placeholder.svg`) | Add AGC photos to `public/` or media library; set `NEXT_PUBLIC_*_IMAGE` or attach in admin. |
| **Partner logos** | Home partner strip uses text or generic placeholders | Replace with real logos (SVG/PNG) in admin or `public/`; ensure consistent height/alignment. |
| **Language selector** | Header shows “English” and a dropdown, but **no i18n**. Selecting another language does nothing. | Either: (a) remove the control until i18n is planned, or (b) add next-intl (or similar) and translate key strings + CMS content. |
| **Slate in header** | `LanguageSelector` and `SearchModal` still use `text-slate-*` / `border-slate-*` | Optional: switch to `stone` / `accent` to match sitewide tokens (see `UI-SITEWIDE.md`). |
| **Skip-to-content** | Not clearly present in `Header` | Add a “Skip to main content” link (visible on focus) that targets `#main` or main landmark for a11y. |
| **Per-page OG images** | Layout sets default OG; many pages don’t set `openGraph.images` | In `generateMetadata` for news/publications/events, set `openGraph.images` from hero/feature image. |
| **Focus/keyboard** | Some `aria-*` and focus usage; no sitewide audit | Run axe or Lighthouse a11y; fix focus order and visible focus rings on interactive elements. |

---

## 2. Feature gaps

| Feature | Current state | Recommendation |
|--------|----------------|-----------------|
| **Newsletter list** | Footer signup sends **one email** to programs with the new address; no DB, no list. | Store signups (e.g. `NewsletterSignup` model) and/or integrate Resend Audiences / Mailchimp so you can send campaigns. |
| **Volunteer applications** | Form sends **email only** to programs; no DB, no admin list. | Add `VolunteerApplication` model and admin list view so staff can review, filter, and export. |
| **Contact submissions** | Contact form sends email via Resend; **no DB**. | Optional: add `ContactSubmission` model and optional admin “Inbox” to keep a record and avoid losing mail if Resend fails. |
| **APP Summit content** | All content in `src/data/app-summit.ts` (date, venue, agenda, registration CTA). | Move to CMS (e.g. new “Summit” or PageContent type) so marketing can edit without code deploy. |
| **APP Summit registration** | Registration CTA links to `/contact`; no dedicated summit registration flow. | If you need capacity/attendee list: add event-type or slug-based registration (reuse event registration flow) or dedicated summit form + DB. |
| **RSS** | No RSS feed for news. | Add `/news/feed.xml` (or similar) using same data as news listing for syndication and readers. |
| **News tags** | Tags removed from **article detail** UI; tag **listing** pages (`/news/tag/[slug]`) still work. | Decide: keep tag pages for discovery and add tags back to detail as a small “Tags” line, or remove tag routes and related data. |
| **Search** | Header search uses `/api/search` + Fuse.js (events, news, publications). Works. | Optional: add analytics for search terms; consider highlighting query in results. |
| **Event check-in** | Check-in scanner at `/admin/events/scan`; QR on badge; API and DB in place. | No major gap; ensure scanner is tested on target devices (e.g. phones). |

---

## 3. Implementation gaps

| Area | Current state | Recommendation |
|------|----------------|-----------------|
| **Sitemap** | `sitemap.ts` uses **Prisma** (news, publications, events). Build fails or sitemap empty if DB is unavailable (e.g. static export or no DB at build). | If you need static export: make sitemap resilient (try/catch, fallback to static-only URLs) or generate sitemap in a build step that has DB access. |
| **Applications storage** | Volunteer applications are **email-only**. | Add Prisma model + store in DB; admin list + export (and optional email as notification). |
| **Newsletter storage** | Newsletter signups are **email-only** (notification to programs). | Add Prisma model for signups; optional admin list and CSV export; optional double opt-in. |
| **Media storage** | Media library uses local `public/uploads` or external URLs. No S3/cloud in schema. | For production at scale: add S3 (or similar) upload and serve via env-configured storage. |
| **Rate limiting** | Contact, applications, newsletter use in-memory rate limit. | For multi-instance deploy: switch to Redis (or existing Redis) so limit is shared across instances. |
| **Env for email** | Contact, applications, event registration, newsletter all require **RESEND_API_KEY** to send mail. | Document in README/deploy docs; without it, forms “succeed” but only log. Ensure production has key and verified domain. |
| **Fallback content** | Some pages use `fallbackNews`, `fallbackEvents`, etc. when CMS returns nothing. | Keep fallbacks for dev/empty DB; ensure production is seeded or content is added via admin. |

---

## 4. Functionality / Admin gaps

| Area | Current state | Recommendation |
|------|----------------|-----------------|
| **Admin auth** | Single credentials (env `ADMIN_EMAIL` / `ADMIN_PASSWORD`). | For multiple staff: add role-based access or multiple users (e.g. NextAuth adapter + User model). |
| **Viewing submissions** | No admin UI for contact form or volunteer applications (email only). | If you add DB storage for these, add admin pages to list, filter, and export. |
| **Draft vs published** | News, events, publications, etc. have status; homepage uses “published” only. | Already correct; ensure all listing pages filter by `status: "published"` and admins use Draft for preview. |
| **Media library** | Admin can upload and link media. | Confirm upload path and permissions in production; consider image resizing/optimisation (e.g. Next/Image + sizes). |
| **Homepage CMS** | Home content (hero, testimonial, spotlight, stats, partners, etc.) editable via **Page Content → home**. | Document in README (already noted); optional: preview-before-publish for home. |

---

## 5. Quick priority matrix

| Priority | Category | Item |
|----------|----------|------|
| **High** | Design | Replace placeholder images and partner logos with real AGC assets. |
| **High** | Features | Decide newsletter: add DB + optional Resend Audiences, or keep email-only and document process. |
| **High** | Features | Decide volunteer applications: add DB + admin list, or keep email-only. |
| **High** | Implementation | Ensure `RESEND_API_KEY` (and optional `RESEND_FROM_EMAIL`) are set in production. |
| **Medium** | Design | Add skip-to-content link; optional per-page OG images for news/publications/events. |
| **Medium** | Features | Move APP Summit content to CMS if non-developers need to edit. |
| **Medium** | Features | Add RSS for news. |
| **Medium** | Implementation | Make sitemap resilient when DB is missing at build (if you use static export). |
| **Low** | Design | Align LanguageSelector/SearchModal with stone/accent; full a11y pass. |
| **Low** | Features | Language selector: remove or implement i18n. |
| **Low** | Features | Tags: re-add to news detail or remove tag routes. |
| **Low** | Implementation | Redis-backed rate limiting for multi-instance; S3 (or similar) for media at scale. |

---

## 6. References

- **Content & env:** `docs/GAPS-PHASES.md`, `README.md`
- **UI system:** `docs/UI-SITEWIDE.md`, `docs/UX-ENHANCEMENT-PHASES.md`
- **APIs:** `src/app/api/` (contact, applications, newsletter, events/register, search, etc.)
- **Schema:** `prisma/schema.prisma` (Event, News, Team, Publication, Program, Project, Partner, PageContent, EventRegistration; no NewsletterSignup or VolunteerApplication yet)
