# Admin Dashboard Login

## Login URL

- **Local:** http://localhost:9200/admin/login
- **Production:** https://www.africagovernancecentre.org/admin/login

(After login you are redirected to `/admin`.)

## Credentials

Admin login uses environment variables. Set these in `.env.local` (local) or your deployment env (production):

| Variable       | Description              | Example              |
|----------------|--------------------------|----------------------|
| `AUTH_SECRET`  | NextAuth secret (required)| `openssl rand -base64 32` |
| `ADMIN_EMAIL`  | Admin email              | `admin@africagovernancecentre.org`  |
| `ADMIN_PASSWORD` | Admin password         | `changeme`           |

### Local development (from `.env.local`)

```
AUTH_SECRET=dev-secret-change-in-production
ADMIN_EMAIL=admin@africagovernancecentre.org
ADMIN_PASSWORD=admin123
```

**Default local credentials:**
- **Email:** `admin@africagovernancecentre.org`
- **Password:** `admin123`

> ⚠️ Change `ADMIN_PASSWORD` and `AUTH_SECRET` before deploying to production.
