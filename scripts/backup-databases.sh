#!/bin/bash
# Backup AGC PostgreSQL database (agc-db: content + event registrations)
# Run: ./scripts/backup-databases.sh
# Optional: BACKUP_DIR=/path/to/backups ./scripts/backup-databases.sh

set -e
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
DATE=$(date +%Y%m%d-%H%M%S)

echo "Backing up databases to $BACKUP_DIR..."

# AGC database (content + event registrations)
docker exec agc-db pg_dump -U agc agc | gzip > "$BACKUP_DIR/agc-$DATE.sql.gz" 2>/dev/null || {
  echo "Warning: agc-db backup failed (is container running?)"
}

echo "Done. Backups: $BACKUP_DIR/agc-$DATE.sql.gz"
echo "Retention: consider deleting backups older than 7-30 days."
