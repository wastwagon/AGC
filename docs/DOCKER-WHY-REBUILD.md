# Why Docker doesn’t show code changes until you rebuild

## What’s going on

Your **Docker `web` service** runs a **production image**: the app was **compiled once** (`next build`) when the image was built, then copied into the container. The running container **does not read** your project folder on disk.

So when you edit React/CSS/TS in Cursor:

- **`npm run dev`** (no Docker) → Next.js watches files and **reloads** automatically.
- **Docker `web`** → the container still runs the **old build** until you **build a new image** and **restart**.

That’s normal for production-style deploys: predictable, repeatable, not tied to your laptop’s files.

## What to run after you change code (Docker)

From the **AGC repo root** (folder that contains `docker-compose.yml`):

```bash
docker compose up -d --build web
```

Or use the helper scripts:

- **macOS / Linux / Git Bash:** `./scripts/rebuild-web.sh`
- **Windows Command Prompt:** `scripts\rebuild-web.bat`

## You don’t *always* have to use Docker while developing

For day-to-day UI and content work, run the app **locally** (DB can still be Docker if you want):

```bash
cd agc-site
npm run dev
```

Use **Docker** when you want to test the **same setup as production** (standalone build, env, healthchecks).

## Force a full rebuild (no cache)

If something still looks stale:

```bash
docker compose build --no-cache web
docker compose up -d web
```
