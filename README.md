# IronMan — Premium Metal Purchasing & Industrial Clearing

A high-performance, RTL Hebrew landing page for a premium metal purchasing, recycling, and industrial clearing company in Israel.

## Tech Stack

- **Next.js 15** (App Router, TypeScript, RSC)
- **Tailwind CSS** + custom industrial metallic design system
- **Framer Motion** + **GSAP ScrollTrigger** canvas animation
- **Prisma** + **PostgreSQL** + **NextAuth.js** (admin CMS)
- **shadcn/ui** (admin dashboard)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string, NextAuth secret, and WhatsApp number.

### 3. Set up database

```bash
npx prisma db push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS (default: `admin@ironman.co.il` / `ChangeMe123!`).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page (RSC)
│   ├── admin/              # Protected CMS
│   └── api/auth/           # NextAuth routes
├── components/
│   ├── canvas/             # GSAP ScrollTrigger canvas sequence
│   ├── sections/           # Hero, Materials, Projects, Contact
│   ├── admin/              # Admin dashboard components
│   ├── ui/                 # shadcn/ui + 21st.dev-style components
│   └── seo/                # JSON-LD structured data
├── lib/                    # Prisma, auth, content fetching
└── actions/                # Server Actions for CMS updates
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Default Hebrew content + SEO
```

## SEO Keywords

The site targets: קניית ברזל, קניית נחושת, קניית אלומיניום, קניית מצברים, קניית כבלי חשמל, קניית פליז, קניית מנועי חשמל, קניית מזגנים למחזור, פינוי מפעלים, פרויקטי פינוי בינוי, קונה מתכות.

## Canvas Scroll Animation

The `ScrollCanvasSequence` component renders procedurally generated industrial metal block frames driven by GSAP ScrollTrigger, overlaid with the reference image for atmospheric depth. Replace `/public/reference-metal.jpg` with your own pre-rendered frame sequence in `/public/frames/` for a true Apple-style image sequence.
