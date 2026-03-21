# AGC Docker Deployment

The project runs in Docker. **Code changes require a rebuild** when using production compose.

---

## Production (repo root: `docker-compose.yml`)

The **full stack** is defined at the **AGC repository root** (parent of `agc-site/`):

- **`web`** — Next.js (site + API + admin)
- **`agc-db`** — PostgreSQL
- **`redis`** — Redis
- **`migrate`** — Prisma migrations (runs before `web`)

From the **AGC root**:

```bash
docker compose run --rm migrate   # optional if you need migrations only
docker compose build --no-cache web
docker compose up -d
```

`migrate` also runs automatically on `up` when `web` depends on it. See **`../../docs/DOCKER-COMPOSE.md`**.

---

## Web only (`docker-compose.web-only.yml`)

When Postgres and Redis are **external** (e.g. Coolify managed DB):

```bash
docker compose -f docker-compose.web-only.yml build --no-cache web
docker compose -f docker-compose.web-only.yml up -d
```

Set **`DATABASE_URL`** and **`REDIS_URL`** in Coolify.

---

## Development (`agc-site/docker-compose.dev.yml`)

Uses a **volume mount** (`.:/app`) so source changes can hot-reload.

```bash
cd agc-site
docker compose -f docker-compose.dev.yml up
```

If changes still don’t show, restart the container:

```bash
docker compose -f docker-compose.dev.yml restart web
```

---

## Which compose file?

| Scenario | File |
|----------|------|
| **Local / VPS all-in-one** | Repo root `docker-compose.yml` |
| **Coolify with bundled DB** | `docker-compose.yml` |
| **Coolify with external DB/Redis** | `docker-compose.web-only.yml` |
| **Hot reload dev** | `agc-site/docker-compose.dev.yml` |

---

## Backward compatibility

`docker-compose.full.yml` at the repo root **`include`s** `docker-compose.yml` — old commands using `-f docker-compose.full.yml` still work.
