# AGC Website – Fullstack Empowerment Review

A review of the Africa Governance Centre project and recommendations for fullstack enhancement.

---

## 1. What Exists Today

### Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, Tailwind v4 | Public website |
| **Content** | Prisma + PostgreSQL | Events, News, Team, Publications, etc. |
| **Database (App)** | PostgreSQL (agc-db) | Event registrations |
| **Cache** | Redis | Rate limiting |
| **Email** | Resend | Contact, applications, registration |
| **Media** | Local `public/uploads/` + JSON metadata | Images |

### Public Pages (27 routes)

| Route | Content Source | Notes |
|-------|----------------|-------|
| `/` | Prisma + static | Events, news from DB; hero, etc. from `content.ts` |
| `/about` | Prisma + static | Team from DB; about text from `content.ts` |
| `/about/team` | Prisma | Team from DB |
| `/our-work` | Static | Programs, projects, advisory from `content.ts` |
| `/our-work/programs` | Static | |
| `/our-work/projects` | Static | |
| `/our-work/advisory` | Static | |
| `/events` | Prisma | Events from DB |
| `/events/register/[slug]` | Prisma + API | Registration form, saves to Prisma |
| `/events/badge/[id]` | API | QR badge for registrants |
| `/news` | Prisma | News from DB |
| `/news/[slug]` | Prisma | News detail |
| `/news/category/[slug]` | Prisma | Category archive |
| `/news/tag/[slug]` | Prisma | Tag archive |
| `/app-summit` | Static | APP Summit page |
| `/get-involved` | Static | |
| `/get-involved/volunteer` | Static | |
| `/get-involved/partnership` | Static | |
| `/get-involved/join-us` | Static | |
| `/contact` | Static + API | Contact form → Resend |
| `/applications` | Static + API | Volunteer form → Resend |
| `/privacy-policy` | Static | |
| `/terms-of-service` | Static | |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact` | POST | Contact form (Resend, rate-limited) |
| `/api/applications` | POST | Volunteer application (Resend, rate-limited) |
| `/api/newsletter` | POST | Newsletter signup (rate-limited) |
| `/api/events/register` | POST | Event registration (Prisma, Resend, rate-limited) |
| `/api/events/check-in` | POST | Check-in by QR/registration ID |
| `/api/events/registrations` | GET | List registrations (admin) |
| `/api/events/registrations/export` | GET | CSV export |
| `/api/media` | GET, POST | Media library CRUD |
| `/api/media/[id]` | DELETE | Delete media |

### Admin (No Auth)

| Route | Purpose |
|-------|---------|
| `/admin/media` | Upload/manage images (local JSON) |
| `/admin/events` | Event list with registration counts |
| `/admin/events/[slug]` | Registrations per event, CSV export |
| `/admin/events/scan` | QR scanner for check-in |

**Note:** Admin has no login; anyone with the URL can access it.

### Content (Prisma, managed via /admin)

| Model | Fields | Used By |
|-------|--------|---------|
| **events** | title, slug, description, location, start_date, end_date, image, link, category, status | Events pages, registration |
| **news** | title, slug, excerpt, content, image, date_published, author, categories, tags, status | News pages |
| **team** | name, role, bio, image, order, status | About / Team |
| **publications** | title, slug, excerpt, type, file, image, date_published, author | Publications pages |
| **programs** | title, description, image, order | Our Work |
| **projects** | title, description, image, order | Our Work |
| **partners** | name, logo, url, order | Home / Partners |
| **page_content** | slug, hero_title, hero_subtitle, intro, etc. | About, Contact, Get Involved |

---

## 2. Gaps & Limitations

### Security

- **Admin unprotected** – `/admin/*` and `/api/events/*` are open
- **No auth** – No login, sessions, or role-based access
- **No CSRF** – Forms rely on same-origin only

### Content Management

- **Static content** – About, Our Work, Get Involved, Contact, etc. live in `content.ts`
- **No Publications** – Reports, policy briefs, research not in CMS
- **Media** – Local media library in `public/uploads/`
- **Limited event fields** – No speakers, agenda, venue details, capacity

### Features

- **Newsletter** – API exists but no visible signup UI
- **Analytics** – GA/Plausible env vars only; no implementation
- **Sentry** – Optional; not wired
- **i18n** – Single language (English)
- **Search** – No site search

### Data & Integrations

- **Event–content link** – Registrations use `eventSlug`; linked to Prisma events
- **No backup** – No automated DB/volume backups

---

## 3. Fullstack Empowerment Roadmap

### Phase 1: Security & Admin (High Priority)

| Task | Effort | Impact |
|------|--------|--------|
| Add admin auth (NextAuth/Auth.js or simple session) | Medium | High |
| Protect `/admin/*` and sensitive API routes | Low | High |
| Add API key or auth for `/api/events/registrations` | Low | Medium |

### Phase 2: CMS Expansion (Medium Priority)

| Task | Effort | Impact |
|------|--------|--------|
| **Publications** collection (reports, briefs, PDFs) | Medium | High |
| **Programs** and **Projects** in admin | Medium | Medium |
| **Partners** collection | Low | Low |
| Move About/Contact page content to CMS | Medium | Medium |
| Unify media: use uploads for all site images | Medium | Medium |

### Phase 3: Event System Enhancement (Medium Priority)

| Task | Effort | Impact |
|------|--------|--------|
| Event type (summit, workshop, webinar) | Low | Medium |
| Speakers (relation to team) | Medium | Medium |
| Agenda/schedule items | Medium | Medium |
| Venue details, capacity, registration deadline | Low | Medium |
| Sync event ID between content and registrations | Low | Low |

### Phase 4: User Experience & Analytics (Lower Priority)

| Task | Effort | Impact |
|------|--------|--------|
| Newsletter signup UI (footer, modal) | Low | Medium |
| Google Analytics or Plausible integration | Low | Medium |
| Sentry error tracking | Low | Medium |
| Site search (e.g. Fuse.js or Algolia) | Medium | Medium |

### Phase 5: DevOps & Reliability (Lower Priority)

| Task | Effort | Impact |
|------|--------|--------|
| Automated DB backups | Medium | High |
| Admin revalidation → revalidate cache on content change | Low | Medium |
| Health checks and monitoring | Low | Medium |
| Staging environment | Medium | Medium |

---

## 4. Quick Wins (Can Do Now)

1. **Protect admin** – Add basic auth or redirect to login
2. **Newsletter UI** – Add signup form in footer
3. **Publications** – Managed via /admin/publications
4. **Event type field** – Add to events in admin
5. **Analytics** – Add GA or Plausible script

---

## 5. Summary

| Area | Status | Next Step |
|------|--------|-----------|
| **Frontend** | Solid | Add search, newsletter UI |
| **CMS** | Basic | Add Publications, Programs, Projects |
| **Events** | Good | Add speakers, agenda, venue |
| **Admin** | Functional | Add authentication |
| **Security** | Weak | Protect admin and APIs |
| **Analytics** | Missing | Add GA or Plausible |
| **Media** | Local uploads | Extend as needed |

The base is strong: Next.js, Prisma, Redis, and Docker are in place. Content is managed via the website admin. The main gaps are admin CRUD forms (create/edit) for each content type and stronger event management (speakers, agenda). Prioritising admin forms will give the biggest impact for fullstack empowerment.
