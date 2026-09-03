# DNS Setup — theironman.co.il

## Overview

| Item | Value |
|------|-------|
| Domain | `theironman.co.il` |
| DNS | Cloudflare |
| Origin server | `84.46.253.85` (MelaMedia frontend VPS) |
| App port | `3012` (PM2 `ironman-web`) |
| SSL | Cloudflare proxy (Flexible) |

---

## Step 1 — Registrar nameservers

At the domain registrar (where you bought the domain):

1. Open **שרתי שמות** / Nameservers
2. Select **custom nameservers**
3. Set only:
   - `damiete.ns.cloudflare.com`
   - `davina.ns.cloudflare.com`
4. Remove all other nameservers
5. Disable **DNSSEC** at the registrar if enabled
6. Save

Wait until Cloudflare Overview shows **Active** (15 min – 24 h).

---

## Step 2 — Cloudflare DNS records

In Cloudflare → **DNS → Records**:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `84.46.253.85` | Proxied (orange cloud) |
| A | `www` | `84.46.253.85` | Proxied (orange cloud) |

---

## Step 3 — Cloudflare SSL

**SSL/TLS → Overview** → preferred mode: **Full** (origin serves HTTPS on `:443` with the deploy self-signed cert).

**Flexible** also works (Cloudflare → origin `:80` only). Do **not** use **Full (strict)** unless you install a real origin certificate (Let’s Encrypt or Cloudflare Origin CA).

If HTTPS shows NestJS JSON `Route GET:/ not found`, Cloudflare is on **Full** but nginx has no ironman `:443` vhost — redeploy or ensure `/etc/nginx/sites-enabled/ironman` includes the TLS server block.

---

## Step 4 — Update production URLs

After the site loads at `https://theironman.co.il`:

1. SSH to server and edit `/opt/ironman/.env.production`:
   ```
   NEXTAUTH_URL=https://theironman.co.il
   NEXT_PUBLIC_SITE_URL=https://theironman.co.il
   ```
2. `pm2 restart ironman-web`
3. Admin → SEO → set **URL קנוני** to `https://theironman.co.il`

---

## Verify

```bash
dig +short theironman.co.il A
curl -I https://theironman.co.il
```

Expected: Cloudflare IPs (when proxied) or `84.46.253.85`, HTTP 200.

---

## Staging domain

`ironman.mela-media.co.il` remains configured on the same server as a fallback during DNS migration.
