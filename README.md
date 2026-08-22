# איש הברזל — IronMan / Guy Balulu

RTL Hebrew landing page and admin CMS for **איש הברזל**, a premium metal purchasing and industrial clearing company in Israel.

The site targets sellers of scrap metal and factory-clearing clients — the business **buys** metals; it does not sell.

**Built by [MelaMedia](https://mela-media.co.il)**

---

## Live URLs

| Environment | URL |
|-------------|-----|
| Production (primary) | https://theironman.co.il |
| Production (staging) | https://ironman.mela-media.co.il |
| Admin | `/admin` on either domain |
| Local dev | http://localhost:3000 |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, TypeScript, RSC) |
| Styling | Tailwind CSS — RM-Terex light industrial design system |
| Animation | Framer Motion |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js (credentials) |
| Admin UI | shadcn/ui + Radix Tabs |
| Validation | Zod + Server Actions |

---

## Quick start

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` — at minimum set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXT_PUBLIC_WHATSAPP_NUMBER`.

Generate a secret:

```bash
openssl rand -hex 32
```

### 3. Database

```bash
npm run db:push
npm run db:seed
```

### 4. Dev server

```bash
npm run dev
```

- Landing page: http://localhost:3000  
- Admin CMS: http://localhost:3000/admin  

**Default admin** (after seed): `admin@ironman.co.il` / `ChangeMe123!`

> Without PostgreSQL, the public site still renders using built-in Hebrew defaults. The admin CMS requires a running database.

---

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Seed content, materials, projects, SEO, admin user |
| `npm run deploy` | Deploy to MelaMedia frontend VPS |

---

## Admin CMS

Log in at `/admin` to edit everything without code changes:

| Tab | What you can edit |
|-----|-------------------|
| **תוכן** | Hero text, services blocks, contact copy, nav, footer, manager names & phones |
| **מדיה** | Hero image, logo (URL or upload) |
| **מתכות** | Material cards — title, description, keyword, image |
| **פרויקטים** | Project cards — title, description, category, image |
| **SEO** | Meta tags, business name, phone, email, address |

Image uploads go to `public/uploads/` (gitignored; persisted on server).

See [docs/CMS.md](docs/CMS.md) for details.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (RSC)
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── admin/                # Protected CMS + login
│   └── api/
│       ├── auth/             # NextAuth
│       └── admin/upload/     # Image upload endpoint
├── components/
│   ├── sections/             # Hero, Materials, Projects, Contact
│   ├── admin/                # AdminDashboard, ImageField
│   ├── brand/                # IshHaBarzelLogo
│   ├── layout/               # Navbar, Footer, PoweredByMelaMedia
│   ├── ui/                   # Terex design system + shadcn
│   └── seo/                  # JSON-LD LocalBusiness
├── lib/
│   ├── content.ts            # RSC data layer + defaults
│   ├── images.ts             # Image URL resolution
│   └── auth.ts               # NextAuth config
├── actions/
│   └── content-actions.ts    # CMS server actions
prisma/
├── schema.prisma
└── seed.ts
deploy/
├── deploy.sh                 # Frontend VPS deploy script
├── nginx-ironman.conf
└── env.production.example
public/
├── images/                   # Default hero, materials, projects
├── logo.png
└── uploads/                  # Admin uploads (gitignored)
```

---

## Business defaults

| Field | Value |
|-------|-------|
| Address | המסגר 34, נתניה |
| גיא בלולו | +972 50-756-2842 · WhatsApp `972507562842` |
| יוספי בלולו | +972 54-330-0447 · WhatsApp `972543300447` |
| Email | info@ironman.co.il |

---

## SEO keywords

קניית ברזל, קניית נחושת, קניית אלומיניום, קניית מצברים, קניית כבלי חשמל, קניית פליז, קניית מנועי חשמל, קניית מזגנים למחזור, פינוי מפעלים, פרויקטי פינוי בינוי, קונה מתכות

---

## Deployment

Production runs on the MelaMedia frontend VPS (`84.46.253.85`) via PM2 + nginx.

```bash
npm run deploy
```

Full guide: [deploy/README.md](deploy/README.md)  
Domain / Cloudflare setup: [docs/DNS.md](docs/DNS.md)

---

## Troubleshooting

**Blank page / missing styles in dev**

```bash
rm -rf .next && npm run dev
```

**404 on `/_next/static/*`**

Stale `.next` cache — clear and restart (do not run `npm run build` while `npm run dev` is active).

**Admin shows empty tabs**

Run `npm run db:seed` or check PostgreSQL is running.

---

## License

Private client project — © MelaMedia / Guy Balulu. All rights reserved.
