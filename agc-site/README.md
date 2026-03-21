# Africa Governance Centre Website

A modern, professional website for the Africa Governance Centre — an independent think tank promoting governance excellence across Africa.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Fonts:** IBM Plex Sans (body), Fraunces (headings)

## Local Development

### Option 1: Direct (Recommended for development)

```bash
npm install
npm run dev
```

Open [http://localhost:9200](http://localhost:9200) (port 9200 to avoid conflict with other services).

### Option 2: Docker (Local)

```bash
# Development with hot reload
docker compose -f docker-compose.dev.yml up

# Production build (test before deploy)
docker compose build
docker compose up
```

## Content Management

All content (events, news, team, publications, programs, projects, partners, page content) is managed via the **website admin** at `/admin`.

**Homepage** hero, testimonial, fellow spotlight, reach/stats, hero slider images, and partner strip: **Admin → Page Content → edit `home`** (or open `/admin/pages/home/edit`). While status is **Draft**, the live site uses defaults from code; set **Published** to apply your edits. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`.

**Submissions** (newsletter signups, volunteer applications, contact form): **Admin → Submissions**. Entries are stored in the database; email notifications are still sent when `RESEND_API_KEY` is set.

**Replacing images:** Upload images via **Admin → Media**. Then set image URLs in the relevant content: homepage hero slider (Page Content → home → Hero slider images, one URL per line), news/publications/events (edit each item and set Image URL), partners (edit partner and set Logo URL). Seed data uses placeholder paths (e.g. `/uploads/placeholder.svg`); replace these with your uploaded asset URLs.

**Full stack (web + DB + Redis):**

```bash
# From AGC root
cp .env.cms.example .env
# Edit .env (set AGC_DB_PASSWORD, etc.)

docker compose -f docker-compose.full.yml up -d
```

Migrations run automatically on first start. Seed initial content: `cd agc-site && npm run db:seed` (or `npx prisma db seed`). The seed creates homepage content (with hero slider placeholder), sample news, events, publications, programs, and projects. Run after migrations so the DB has the required tables.

- Website: http://localhost:9200
- Admin: http://localhost:9200/admin

## Deployment (Coolify)

1. **Connect your repository** to Coolify (GitHub/GitLab/self-hosted).

2. **Create a new application** and select **Docker Compose**.

3. **Use this `docker-compose.yml`** — Coolify will detect it automatically, or paste:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: agc-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

4. **Set the build context** to the repository root (or `agc-site` if the project is in a subdirectory).

5. **Add environment variables** in Coolify (Application → Environment):
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
   - `RESEND_API_KEY=re_xxxx` (from [resend.com](https://resend.com))
   - `RESEND_FROM_EMAIL=contact@yourdomain.com` (optional, must be verified in Resend)

6. **Deploy** — Coolify will build the Docker image and run the container.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL (for SEO/Open Graph) |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for contact form emails |
| `RESEND_FROM_EMAIL` | Optional: verified sender email (default: onboarding@resend.dev) |

Without `RESEND_API_KEY`, the contact form still works (logs to console) but won't send emails.

## Project Structure

```
agc-site/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── data/          # Content & legal text
│   └── lib/           # Utilities
├── public/
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Pages

- `/` — Home
- `/about` — About Us
- `/our-work` — Programs, Projects, Advisory
- `/events` — Upcoming Events
- `/news` — Latest News
- `/get-involved` — Volunteer, Partner, Work with us
- `/contact` — Contact form & details
- `/applications` — Volunteer application
- `/privacy-policy` — Privacy Policy
- `/terms-of-service` — Terms of Service

## License

© 2026 Africa Governance Centre. All rights reserved.
