# Deployment — איש הברזל

Deploys the Next.js app to the MelaMedia **frontend VPS** at `84.46.253.85`.

## Prerequisites

- SSH key at `~/.ssh/id_ed25519` with access to `root@84.46.253.85`
- Optional jump host: `root@37.60.230.148` (used automatically if direct SSH fails)

## One-command deploy

From the repo root:

```bash
npm run deploy
```

Equivalent to `./deploy/deploy.sh`.

## What the script does

1. Syncs project files to `/opt/ironman` on the server
2. Creates PostgreSQL database `ironman` + role `ironman_app` (if missing)
3. Writes `/opt/ironman/.env.production`
4. Runs `npm ci --include=dev`, `prisma db push`, `db:seed`, `next build`
5. Starts/restarts PM2 process `ironman-web` on port **3012**
6. Installs nginx config and reloads

## Environment variables

See [env.production.example](./env.production.example).

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Local Postgres on the VPS |
| `NEXTAUTH_URL` | Public site URL (must match domain) |
| `NEXTAUTH_SECRET` | Session signing — auto-generated on first deploy |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap / metadata |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Default WhatsApp CTA (972507562842) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |

## Override defaults

```bash
IRONMAN_DOMAIN=theironman.co.il \
IRONMAN_PORT=3012 \
FRONTEND_HOST=root@84.46.253.85 \
npm run deploy
```

## Nginx

Config: [nginx-ironman.conf](./nginx-ironman.conf)

Server names:

- `theironman.co.il`
- `www.theironman.co.il`
- `ironman.mela-media.co.il` (staging / fallback)

Upstream: `127.0.0.1:3012`

Cloudflare SSL mode: **Flexible** (orange cloud proxied).

## PM2

```bash
ssh root@84.46.253.85
pm2 logs ironman-web
pm2 restart ironman-web
```

## Manual rebuild on server

```bash
cd /opt/ironman
set -a && source .env.production && set +a
npm ci --include=dev
npm run build
pm2 restart ironman-web
```

## Switch canonical domain

After DNS is live on `theironman.co.il`, update production env:

```bash
# On server: /opt/ironman/.env.production
NEXTAUTH_URL=https://theironman.co.il
NEXT_PUBLIC_SITE_URL=https://theironman.co.il
```

Then update SEO canonical in Admin → SEO, and restart PM2.

Also run in Admin → SEO or via DB:

- `canonicalUrl` → `https://theironman.co.il`
