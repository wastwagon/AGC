#!/usr/bin/env bash
# Rebuild and restart the Next.js web container (from repo root)
set -e
cd "$(dirname "$0")/.."
echo "Rebuilding agc-web..."
docker compose up -d --build web
echo "Done. Open http://localhost:9200 and hard-refresh (Cmd+Shift+R)."
