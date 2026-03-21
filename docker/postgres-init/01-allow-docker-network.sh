#!/bin/sh
# Allow connections from Docker network (web, migrate, etc.)
echo 'host all all 172.0.0.0/8 md5' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all 10.0.0.0/8 md5' >> /var/lib/postgresql/data/pg_hba.conf
