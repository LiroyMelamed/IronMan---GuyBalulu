# Admin CMS Guide — איש הברזל

URL: `/admin`  
Default login: `admin@ironman.co.il` / `ChangeMe123!` (change after first login via seed env vars)

---

## Tabs

### תוכן (Content)

All site copy grouped by section:

| Group | Keys |
|-------|------|
| Hero | Title, subtitle, CTA buttons |
| Services | Blocks 01 / 02 / 03 title + description |
| Contact | Title, subtitle, WhatsApp button text |
| Contacts | Manager 1 & 2 — name, phone, WhatsApp number |
| Nav | Services, Projects, Contact labels |
| Footer | Copyright line |

Click **שמור תוכן** to save all content fields at once.

### מדיה (Media)

| Field | Used for |
|-------|----------|
| תמונת Hero | Main hero photograph |
| לוגו | Navbar + footer logo |

Paste a URL or click **העלאת תמונה** to upload (max 5 MB, JPEG/PNG/WebP/GIF/SVG).

Uploaded files are stored at `/uploads/…` on the server.

### מתכות (Materials)

Each card on the services grid:

- **כותרת** — card title (e.g. קניית ברזל)
- **מילת מפתח** — SEO keyword
- **תיאור** — card description
- **תמונה** — card image

Click **שמור** per card. **מחק** removes a material.

### פרויקטים (Projects)

Each project card:

- **כותרת**, **קטגוריה**, **תיאור**, **תמונה**

### SEO

Meta tags and business schema data:

- Page title, meta description, keywords
- Open Graph title + description
- Canonical URL — set to `https://theironman.co.il` in production
- Business name, phone, email, address (המסגר 34, נתניה), city, region, postal code

Used for `<head>` metadata and JSON-LD LocalBusiness structured data.

---

## Content fallbacks

If the database is unavailable, the public site uses defaults from `src/lib/content.ts`.  
The admin panel merges DB values with defaults so new keys always appear.

---

## Security notes

- `/admin` routes are protected by NextAuth middleware
- Upload API requires an authenticated session
- Change default admin password in production (`ADMIN_PASSWORD` in `.env.production`)
- Never commit `.env` or `.env.production` to git
