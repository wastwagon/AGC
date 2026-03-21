# Deploy AGC to Coolify (VPS)

Use the **full stack** (`docker-compose.full.yml` pattern): PostgreSQL, Redis, migrations, Next.js.

## 1. Repository layout

Coolify build context should be the **repo root** where `agc-site/` and `docker-compose.full.yml` live (or mirror this layout).

## 2. Docker Compose in Coolify

- Create a **Docker Compose** resource.
- Point Compose file to `docker-compose.full.yml` (or paste equivalent services: `agc-db`, `redis`, `migrate`, `web`).
- **Do not** commit secrets; set variables in Coolify’s environment UI.

## 3. Required environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL, e.g. `https://yourdomain.com` |
| `AUTH_URL` | Same origin as the site (e.g. `https://yourdomain.com`) for NextAuth cookies |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login at `/admin` |
| `AGC_DB_PASSWORD` | Postgres password for user `agc` (must match `DATABASE_URL`) |
| `DATABASE_URL` | On Coolify, often injected by a linked Postgres service; must be `postgresql://agc:PASSWORD@HOST:5432/agc?schema=public` |
| `REDIS_URL` | `redis://redis:6379` when using the compose `redis` service |
| `RESEND_API_KEY` | Optional; forms still save to DB without it |
| `RESEND_FROM_EMAIL` | Optional verified sender |

The **web** service in `docker-compose.full.yml` wires `DATABASE_URL` and `REDIS_URL` for you when using the bundled DB/Redis. Override `NEXT_PUBLIC_SITE_URL`, auth, and Resend in Coolify.

## 4. Migrations

The `migrate` service runs `prisma migrate deploy` before `web` starts. Ensure migration files in `agc-site/prisma/migrations/` are deployed with the repo.

## 5. Seed (first deploy)

After the stack is up, run once (from your machine or a one-off Coolify exec) with `DATABASE_URL` pointing at production:

```bash
cd agc-site && npx prisma db seed
```

## 6. Health check

`GET /api/health` should return **200**. Coolify can use this for the web service healthcheck (see `docker-compose.full.yml`).

## 7. Local full stack (Docker Desktop)

From repo root:

```bash
cp .env.cms.example .env   # if needed; edit passwords and URLs
docker compose -f docker-compose.full.yml up -d --build
```

- Site: `http://localhost:9200`
- Postgres (host tools): `localhost:5436` user `agc`, DB `agc`

To remove old one-off containers from a previous compose file:

```bash
docker compose -f docker-compose.full.yml up -d --remove-orphans
```
