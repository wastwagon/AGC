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

**Services started:** `agc-db` (Postgres), `redis`, `migrate` (runs `prisma migrate deploy` + baseline `db seed`, then exits), `web` (Next.js on port 3000 inside the container).

In Coolify, attach your **public domain** to the **`web`** service (port **3000**). The DB and Redis ports are for internal Docker networking; you usually do **not** need to publish Postgres/Redis to the public internet.

**Do not** commit secrets; set variables in Coolify’s environment UI.

## 3. Environment variables

### When using **`docker-compose.yml`** (bundled DB + Redis)

`DATABASE_URL` and `REDIS_URL` are **set inside the compose file** for `web` / `migrate`. You **do not** paste full `DATABASE_URL` in Coolify unless you override — set **`AGC_DB_PASSWORD`** and the URLs in compose stay consistent.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://yourdomain.com` — must match the URL users open (including sslip.io previews). Used for SEO and **`next/image`** allowlist; wrong values can break Media Library thumbnails (400 on `/_next/image`). |
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

## 4. Migrations + seed on every deploy

The **`migrate`** service runs **before** `web` starts:

1. `npx prisma migrate deploy`
2. `npx prisma db seed` (baseline CMS content; **idempotent** — skips rows that already exist)

This applies to **`docker-compose.yml`** (bundled Postgres) and **`docker-compose.web-only.yml`** (external `DATABASE_URL`), as long as the migrate service is included.

To **disable seed** on deploy (migrations only), set in Coolify / `.env`:

```bash
SKIP_DB_SEED_ON_DEPLOY=1
```

Ensure migration files in `agc-site/prisma/migrations/` ship with the repo.

## 5. Manual seed / migrate (fallback)

If a deploy failed before the migrate job finished, use **Admin → Operations** (“Run Prisma migrate deploy” / “Run database seed”), or from a shell with production `DATABASE_URL`:

```bash
cd agc-site && npx prisma migrate deploy && npx prisma db seed
```

## 6. Health checks

- **`GET /api/health/live`** — **liveness** (no DB). Docker Compose uses this for the **`web`** healthcheck so Traefik/Coolify keep routing even if the DB check fails briefly.
- **`GET /api/health`** — **full check** (includes DB); returns **503** if Postgres is unreachable — use for monitoring, not as the sole proxy health probe.

## 7. Traefik shows **“no available server”** (Coolify)

That usually means the proxy has **no healthy backend** for the **`web`** service.

1. **Domain** must be attached to the **`web`** service (not `migrate`), **port `3000`** (container port).
2. In Coolify, if there is a **custom health check path**, set it to **`/api/health/live`** (not `/api/health`, which can return 503 when the DB check fails).
3. **Redeploy** after changing `docker-compose.yml` healthchecks.
4. In **Logs** for **`web`**, confirm the process is up and there is no crash loop.
5. Try **`http://`** for the same host (port 80) if HTTPS/cert issues block testing; **production** should use a valid **HTTPS** URL and matching **`NEXT_PUBLIC_SITE_URL`** / **`AUTH_URL`**.

## 8. Local full stack (Docker Desktop)

From repo root:

```bash
cp .env.docker.example .env   # if needed; edit passwords and URLs
docker compose up -d --build
```

- Site: `http://localhost:9200`
- Postgres (host tools): `localhost:5436` user `agc`, DB `agc`

To remove old one-off containers from a previous compose file:

```bash
docker compose up -d --remove-orphans
```
