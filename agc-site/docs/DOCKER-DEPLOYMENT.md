# AGC Docker Deployment

The project runs in Docker. **Code changes require a rebuild** when using production compose.

---

## Production (docker-compose.yml / docker-compose.full.yml)

The web image is **built at deploy time**. Changes to source code are **not** reflected until you rebuild.

### Full stack (web + content DB + Redis)

From the **AGC root** (project root):

```bash
# First time: run migrations for event registrations
docker compose -f docker-compose.full.yml run --rm migrate

# Build and start
docker compose -f docker-compose.full.yml build --no-cache web
docker compose -f docker-compose.full.yml up -d
```

When adding new Prisma migrations, run `migrate` again before `up -d`.

### Web only (docker-compose.yml)

```bash
docker compose build --no-cache web
docker compose up -d
```

### Verify

- Web: http://localhost:9200
- Admin: http://localhost:9200/admin

---

## Development (docker-compose.dev.yml)

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

## Which compose file are you using?

- **Coolify / production:** `docker-compose.yml` or `docker-compose.full.yml` → rebuild required
- **Local dev with hot reload:** `agc-site/docker-compose.dev.yml` → volume mount, restart if needed
