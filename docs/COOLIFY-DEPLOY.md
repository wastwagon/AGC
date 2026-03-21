# Deploy AGC to Coolify (VPS)

## Choose your stack

| You want | Compose file | Notes |
|----------|----------------|------|
| **Everything in Compose** (Postgres, Redis, migrations, Next.js on one VPS) | **`docker-compose.yml`** | **Recommended** default — see §2 below. |
| DB/Redis managed separately in Coolify | **`docker-compose.web-only.yml`** | Set `DATABASE_URL` / `REDIS_URL` yourself. |

---

## 1. Repository layout

Coolify build context should be the **repo root** where `agc-site/` and `docker-compose.yml` live (or mirror this layout).

## 2. Coolify form — **everything in Compose** (`docker-compose.yml`)

Use these values when creating the application:

| Field | Value |
|-------|--------|
| **Base Directory** | `/` (repo root) |
| **Docker Compose Location** | **`/docker-compose.yml`** — note **`.yml`**, not `.yaml` |
| **Branch** | `main` (or your default branch) |
| **Build Pack** | Docker Compose |

**Services started:** `agc-db` (Postgres), `redis`, `migrate` (Prisma, runs once then exits), `web` (Next.js on port 3000 inside the container).

In Coolify, attach your **public domain** to the **`web`** service (port **3000**). The DB and Redis ports are for internal Docker networking; you usually do **not** need to publish Postgres/Redis to the public internet.

**Do not** commit secrets; set variables in Coolify’s environment UI.

## 3. Environment variables

### When using **`docker-compose.yml`** (bundled DB + Redis)

`DATABASE_URL` and `REDIS_URL` are **set inside the compose file** for `web` / `migrate`. You **do not** paste full `DATABASE_URL` in Coolify unless you override — set **`AGC_DB_PASSWORD`** and the URLs in compose stay consistent.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://yourdomain.com` |
| `AUTH_URL` | Yes | Same as public URL (NextAuth cookies) |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Yes | Admin login at `/admin` |
| `ADMIN_PASSWORD` | Yes | Strong password for `/admin` |
| `AGC_DB_PASSWORD` | Yes | Postgres password for user `agc` (used by compose for `agc-db` + app) |
| `RESEND_API_KEY` | Optional | Email delivery |
| `RESEND_FROM_EMAIL` | Optional | Verified sender |
| `WEB_PORT` | Optional | Host port mapped to web (default `9200`); Coolify may map its proxy instead — follow Coolify’s port UI |
| `POSTGRES_HOST_PORT` | Optional | Default `5436`; restrict or omit exposing DB on the host in production |

### When using **`docker-compose.web-only.yml`**

Set `DATABASE_URL` and `REDIS_URL` in Coolify to your managed services; see compose file comments.

## 4. Migrations

The `migrate` service runs `prisma migrate deploy` before `web` starts. Ensure migration files in `agc-site/prisma/migrations/` are deployed with the repo.

## 5. Seed (first deploy)

After the stack is up, run once (from your machine or a one-off Coolify exec) with `DATABASE_URL` pointing at production:

```bash
cd agc-site && npx prisma db seed
```

## 6. Health check

`GET /api/health` should return **200**. Coolify can use this for the web service healthcheck (see `docker-compose.yml`).

## 7. Local full stack (Docker Desktop)

From repo root:

```bash
cp .env.cms.example .env   # if needed; edit passwords and URLs
docker compose up -d --build
```

- Site: `http://localhost:9200`
- Postgres (host tools): `localhost:5436` user `agc`, DB `agc`

To remove old one-off containers from a previous compose file:

```bash
docker compose up -d --remove-orphans
```
