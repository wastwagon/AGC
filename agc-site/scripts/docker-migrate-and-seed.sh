#!/bin/sh
# Runs during Docker deploy: migrations first, then optional seed (baseline CMS data).
# Set SKIP_DB_SEED_ON_DEPLOY=1 to run migrations only (e.g. production DB you manage manually).
set -e
cd /app || exit 1
echo "[migrate] prisma migrate deploy"
npx prisma migrate deploy

if [ "${SKIP_DB_SEED_ON_DEPLOY}" = "1" ] || [ "${SKIP_DB_SEED_ON_DEPLOY}" = "true" ]; then
  echo "[migrate] SKIP_DB_SEED_ON_DEPLOY set — skipping seed."
  exit 0
fi

echo "[migrate] prisma db seed"
npx prisma db seed
