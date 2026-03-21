# Website Admin Setup

All content is managed via the **website admin** at `/admin`. No external CMS.

## Access

1. Sign in at `/admin/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`
2. Use the dashboard at `/admin` to navigate content sections

## Content Sections

| Section | Path | Purpose |
|---------|------|---------|
| Dashboard | `/admin` | Overview and quick links |
| Media | `/admin/media` | Upload and manage images |
| Events | `/admin/events` | Events, registrations, QR check-in |
| News | `/admin/news` | News articles |
| Team | `/admin/team` | Team members and bios |
| Publications | `/admin/publications` | Reports, policy briefs |
| Programs | `/admin/programs` | Program descriptions |
| Projects | `/admin/projects` | Project descriptions |
| Partners | `/admin/partners` | Partner logos and links |
| Page Content | `/admin/pages` | Hero text for About, Contact, Get Involved |

## Initial Content

Run the Prisma seed to populate programs, projects, partners, team, and page content:

```bash
cd agc-site
npm run db:seed
```

Add events, news, and publications via the admin (create/edit forms to be implemented).

## Scalability

- **Add new content types:** Add a Prisma model, migration, content layer in `src/lib/content.ts`, and admin list/edit pages
- **Media:** Images stored in `public/uploads/`; reference by path (e.g. `/uploads/hero.jpg`)
- **Revalidation:** Use `revalidatePath()` in API routes or server actions when content changes
