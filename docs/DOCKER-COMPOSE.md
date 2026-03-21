# Docker Compose layout

This project uses **one Next.js app** (`agc-site`) that serves:

- **Frontend** — pages, assets  
- **Backend** — API routes (`/api/*`), server actions, Prisma  

There is no separate Node “API server” repo. The stack is:

| Service | Image / build | Role |
|--------|----------------|------|
| **web** | `agc-site/Dockerfile` | Next.js production server |
| **agc-db** | `postgres:16-alpine` | PostgreSQL for Prisma (CMS, forms, events) |
| **redis** | `redis:7-alpine` | Rate limiting, etc. |
| **migrate** | `agc-site/Dockerfile.migrate` | Runs `prisma migrate deploy` once before `web` starts |

## Default: everything together

From the **repository root**:

```bash
cp .env.cms.example .env
# Edit .env — set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, AGC_DB_PASSWORD, NEXT_PUBLIC_SITE_URL

docker compose up -d --build
```

Equivalent files:

- **`docker-compose.yml`** — canonical full stack  
- **`docker-compose.full.yml`** — `include: docker-compose.yml` (backward compatible)

## Web only (external database)

If PostgreSQL and Redis are provided by **Coolify** or another host, use:

```bash
docker compose -f docker-compose.web-only.yml up -d --build
```

Set **`DATABASE_URL`** and **`REDIS_URL`** in Coolify to your managed services.

## Environment

See [`.env.cms.example`](../.env.cms.example) at the repo root. Required for full stack:

- `AGC_DB_PASSWORD` — Postgres user `agc`  
- `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin login  
- `NEXT_PUBLIC_SITE_URL`, `AUTH_URL` — public URL (production)

Optional: `WEB_PORT`, `POSTGRES_HOST_PORT` to change host port mapping.
