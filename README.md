# Africa Governance Centre (AGC)

Next.js website and Docker tooling for **Africa Governance Centre** — public site, admin CMS, PostgreSQL content, and Redis.

**Repository:** [github.com/wastwagon/AGC](https://github.com/wastwagon/AGC)

## Structure

| Path | Description |
|------|-------------|
| [`agc-site/`](./agc-site/) | Next.js 16 app (App Router), Prisma, Tailwind — **site + API + admin** |
| [`docker-compose.yml`](./docker-compose.yml) | **Default:** `web` + PostgreSQL + Redis + Prisma **migrate** (all-in-one) |
| [`docker-compose.full.yml`](./docker-compose.full.yml) | Same as above (includes `docker-compose.yml`; for old scripts) |
| [`docker-compose.web-only.yml`](./docker-compose.web-only.yml) | **Web only** — use on Coolify when DB/Redis are separate services |
| [`docs/`](./docs/) | Deployment notes (e.g. [Coolify](./docs/COOLIFY-DEPLOY.md), [Docker Compose](./docs/DOCKER-COMPOSE.md)) |
| `consultar/` | Legacy/reference assets (optional; safe to remove if unused) |

## Quick start (local)

```bash
git clone https://github.com/wastwagon/AGC.git
cd AGC

# App only (Node on host)
cd agc-site
cp .env.example .env.local
# Edit DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
npm ci
npx prisma generate
npx prisma migrate dev
npm run dev
```

App (default): [http://localhost:9200](http://localhost:9200) · Admin: `/admin`

## Full stack with Docker

```bash
cp .env.cms.example .env
# Set AGC_DB_PASSWORD, NEXT_PUBLIC_SITE_URL, AUTH_*, ADMIN_*, optional RESEND_*

docker compose up -d --build
```

- Site: [http://localhost:9200](http://localhost:9200)  
- Postgres on host: port **5436** (override with `POSTGRES_HOST_PORT` in `.env`)

**After you change site code**, rebuild the web image or you’ll still see the old UI:

```bash
docker compose up -d --build web
```

Shortcuts: [`scripts/rebuild-web.sh`](./scripts/rebuild-web.sh) (Mac/Linux) or [`scripts/rebuild-web.bat`](./scripts/rebuild-web.bat) (Windows).  
**Why?** Docker runs a *built* app, not your live files — see [docs/DOCKER-WHY-REBUILD.md](./docs/DOCKER-WHY-REBUILD.md). For daily dev with hot reload, use `cd agc-site && npm run dev` instead.

Seed (optional):

```bash
cd agc-site && npm run db:seed
```

More detail: [`agc-site/README.md`](./agc-site/README.md) and [`docs/COOLIFY-DEPLOY.md`](./docs/COOLIFY-DEPLOY.md).

## Pushing to GitHub (first time)

```bash
cd AGC
git init
git add .
git status   # confirm .env / node_modules / .next are NOT listed
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/wastwagon/AGC.git
git push -u origin main
```

If the remote already has a README (empty repo): `git push -u origin main` is enough. If GitHub created a commit, use `git pull origin main --rebase` then push.

## Security

- **Do not commit** `.env`, `.env.local`, or real `ADMIN_PASSWORD` / `AUTH_SECRET`.
- Use `.env.cms.example` and `agc-site/.env.example` as templates only.

## License

Proprietary / all rights reserved unless otherwise stated by the project owner.
