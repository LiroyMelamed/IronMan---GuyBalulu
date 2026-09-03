import { prisma } from "./prisma";
import { cache } from "react";
import { getMaterialSeoDefaults } from "@/lib/material-seo-defaults";
import { getDefaultSeoRecord, type SeoRecord } from "@/lib/seo";

export type SiteContentMap = Record<string, string>;

export const getSiteContent = cache(async (): Promise<SiteContentMap> => {
  try {
    const items = await prisma.siteContent.findMany();
    return mergeContentItems(items).reduce<SiteContentMap>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  } catch {
    return getDefaultContent();
  }
});

export const getMaterials = cache(async () => {
  try {
    return await prisma.material.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return getDefaultMaterials();
  }
});

export const getProjects = cache(async () => {
  try {
    return await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return getDefaultProjects();
  }
});

/**
 * Canonical SEO record for Israel buy-side metal / factory-clearing queries.
 * Falls back to optimized Hebrew defaults when the DB is unavailable.
 */
export const getSeoMetadata = cache(async (): Promise<SeoRecord> => {
  const defaults = getDefaultSeoRecord();
  try {
    const seo = await prisma.seoMetadata.findFirst();
    if (!seo) return defaults;

    // Prefer stored CMS values, but never leave critical SEO fields empty.
    return {
      ...defaults,
      ...seo,
      pageTitle: seo.pageTitle?.trim() || defaults.pageTitle,
      metaDescription: seo.metaDescription?.trim() || defaults.metaDescription,
      keywords: seo.keywords?.trim() || defaults.keywords,
      ogTitle: seo.ogTitle?.trim() || defaults.ogTitle,
      ogDescription: seo.ogDescription?.trim() || defaults.ogDescription,
      canonicalUrl: seo.canonicalUrl?.trim() || defaults.canonicalUrl,
      businessName: seo.businessName?.trim() || defaults.businessName,
    };
  } catch {
    return defaults;
  }
});

function getDefaultContent(): SiteContentMap {
  return DEFAULT_CONTENT_ITEMS.reduce<SiteContentMap>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export type SiteContentItem = {
  key: string;
  value: string;
  group: string;
  label: string;
};

export const DEFAULT_CONTENT_ITEMS: SiteContentItem[] = [
  { key: "hero_title", value: "קונה מתכות — קניית ברזל, נחושת ואלומיניום", group: "hero", label: "כותרת ראשית" },
  { key: "hero_subtitle", value: "אנחנו קונים מתכות ופסולת מתכת במחירים הוגנים. פינוי מפעלים, פרויקטי פינוי בינוי ורכישת כל סוגי המתכות — ברזל, נחושת, אלומיניום, פליז, מצברים, כבלי חשמל, מנועי חשמל ומזגנים למחזור.", group: "hero", label: "תת-כותרת" },
  { key: "hero_cta", value: "קבלו הצעת מחיר עכשיו", group: "hero", label: "כפתור CTA" },
  { key: "hero_secondary", value: "גלו את השירותים שלנו", group: "hero", label: "כפתור משני" },
  { key: "hero_image", value: "/images/hero-metal.jpg", group: "media", label: "תמונת Hero" },
  { key: "logo_image", value: "/logo.png", group: "media", label: "לוגו" },
  { key: "materials_title", value: "מתכות שאנחנו קונים", group: "materials", label: "כותרת מתכות" },
  { key: "materials_subtitle", value: "אנחנו קונים את כל סוגי המתכות והפסולת התעשייתית — לא מוכרים. מחירים תחרותיים, איסוף מהיר ותשלום מיידי.", group: "materials", label: "תת-כותרת מתכות" },
  { key: "value_block_1_title", value: "קניית ברזל ומתכות", group: "services", label: "בלוק 01 — כותרת" },
  { key: "value_block_1_description", value: "רכישת ברזל, נחושת, אלומיניום וכל סוגי המתכות — במחירים הוגנים ובהערכה מקצועית.", group: "services", label: "בלוק 01 — תיאור" },
  { key: "value_block_2_title", value: "פינוי מפעלים ובינוי", group: "services", label: "בלוק 02 — כותרת" },
  { key: "value_block_2_description", value: "פינוי מפעלים, אתרי בנייה ופרויקטים תעשייתיים — עבודה מהירה, בטוחה ומקצועית.", group: "services", label: "בלוק 02 — תיאור" },
  { key: "value_block_3_title", value: "תשלום מיידי ואיסוף מהיר", group: "services", label: "בלוק 03 — כותרת" },
  { key: "value_block_3_description", value: "תשלום מיידי, איסוף מהיר ושירות אישי — אנחנו קונים, לא מוכרים.", group: "services", label: "בלוק 03 — תיאור" },
  { key: "projects_title", value: "פרויקטי פינוי בקנה מידה גדול", group: "projects", label: "כותרת פרויקטים" },
  { key: "projects_subtitle", value: "ניסיון מוכח בפינוי מפעלים, פינוי בינוי ופרויקטים תעשייתיים מורכבים ברחבי הארץ.", group: "projects", label: "תת-כותרת פרויקטים" },
  { key: "contact_title", value: "רוצים למכור מתכות? דברו איתנו", group: "contact", label: "כותרת יצירת קשר" },
  { key: "contact_subtitle", value: "מלאו את הטופס או שלחו הודעה ב-WhatsApp — נחזור אליכם עם הצעת מחיר תוך שעות.", group: "contact", label: "תת-כותרת יצירת קשר" },
  { key: "contact_whatsapp_cta", value: "שלחו הודעה ב-WhatsApp", group: "contact", label: "כפתור WhatsApp" },
  { key: "manager_1_name", value: "גיא בלולו", group: "contacts", label: "מנהל 1 — שם" },
  { key: "manager_1_phone", value: "+972 50-756-2842", group: "contacts", label: "מנהל 1 — טלפון" },
  { key: "manager_1_whatsapp", value: "972507562842", group: "contacts", label: "מנהל 1 — WhatsApp (ללא +)" },
  { key: "manager_2_name", value: "יוספי בלולו", group: "contacts", label: "מנהל 2 — שם" },
  { key: "manager_2_phone", value: "+972 54-330-0447", group: "contacts", label: "מנהל 2 — טלפון" },
  { key: "manager_2_whatsapp", value: "972543300447", group: "contacts", label: "מנהל 2 — WhatsApp (ללא +)" },
  { key: "footer_text", value: "© 2026 איש הברזל — קניית מתכות ופינוי מפעלים. כל הזכויות שמורות.", group: "footer", label: "טקסט פוטר" },
  { key: "nav_services", value: "שירותים", group: "nav", label: "ניווט - שירותים" },
  { key: "nav_projects", value: "פרויקטים", group: "nav", label: "ניווט - פרויקטים" },
  { key: "nav_contact", value: "צור קשר", group: "nav", label: "ניווט - צור קשר" },
];

export function mergeContentItems(items: SiteContentItem[]): SiteContentItem[] {
  const map = new Map(items.map((item) => [item.key, item]));
  return DEFAULT_CONTENT_ITEMS.map((defaults) => {
    const existing = map.get(defaults.key);
    return existing ? { ...defaults, ...existing, label: defaults.label, group: defaults.group } : defaults;
  });
}

function buildDefaultMaterial(
  id: string,
  title: string,
  description: string,
  icon: string,
  keyword: string,
  imageUrl: string,
  sortOrder: number
) {
  const seo = getMaterialSeoDefaults(icon);
  return {
    id,
    title,
    description,
    icon,
    keyword,
    imageUrl,
    sortOrder,
    isActive: true,
    slug: seo?.slug ?? icon,
    longDescription: seo?.longDescription ?? description,
    priceRange: seo?.priceRange ?? null,
    seoTitle: seo?.seoTitle ?? null,
    seoDescription: seo?.seoDescription ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getDefaultMaterials() {
  return [
    buildDefaultMaterial(
      "1",
      "קניית ברזל",
      "רכישת ברזל, פסולת ברזל, קונסטרוקציה וברזל מבנים במחירים תחרותיים.",
      "iron",
      "קניית ברזל",
      "/images/materials/iron.jpg",
      0
    ),
    buildDefaultMaterial(
      "2",
      "קניית נחושת",
      "קונים נחושת, כבלי נחושת, צינורות וכל סוגי פסולת הנחושת.",
      "copper",
      "קניית נחושת",
      "/images/materials/copper.jpg",
      1
    ),
    buildDefaultMaterial(
      "3",
      "קניית אלומיניום",
      "רכישת אלומיניום, פרופילים, שאריות ייצור ופסולת אלומיניום.",
      "aluminum",
      "קניית אלומיניום",
      "/images/materials/aluminum.jpg",
      2
    ),
    buildDefaultMaterial(
      "4",
      "קניית מצברים",
      "קונים מצברים ישנים, סוללות רכב וסוללות תעשייתיות למחזור.",
      "battery",
      "קניית מצברים",
      "/images/materials/battery.jpg",
      3
    ),
    buildDefaultMaterial(
      "5",
      "קניית כבלי חשמל",
      "רכישת כבלי חשמל, כבלי תקשורת ופסולת חשמלית מכל סוג.",
      "cable",
      "קניית כבלי חשמל",
      "/images/materials/cable.jpg",
      4
    ),
    buildDefaultMaterial(
      "6",
      "קניית פליז",
      "קונים פליז, שבבי פליז, ברזים ורכיבי פליז ישנים.",
      "brass",
      "קניית פליז",
      "/images/materials/brass.jpg",
      5
    ),
    buildDefaultMaterial(
      "7",
      "קניית מנועי חשמל",
      "רכישת מנועי חשמל, ממסרים, טרנספורמטורים וציוד חשמלי תעשייתי.",
      "motor",
      "קניית מנועי חשמל",
      "/images/materials/motor.jpg",
      6
    ),
    buildDefaultMaterial(
      "8",
      "קניית מזגנים למחזור",
      "קונים מזגנים ישנים, יחידות HVAC וציוד קירור למחזור.",
      "ac",
      "קניית מזגנים למחזור",
      "/images/materials/ac.jpg",
      7
    ),
  ];
}

function getDefaultProjects() {
  return [
    {
      id: "1",
      title: "פינוי מפעלים",
      description:
        "פינוי מפעלים שלמים — ציוד, מכונות, מתכות ופסולת תעשייתית. עבודה מהירה, מקצועית ובטוחה.",
      category: "פינוי מפעלים",
      imageUrl: "/images/projects/factory.jpg",
      sortOrder: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "פרויקטי פינוי בינוי",
      description:
        "פינוי אתרי בנייה, הריסות ופרויקטי בינוי — ברזל, בטון, מתכות ופסולת בניין.",
      category: "פרויקטי פינוי בינוי",
      imageUrl: "/images/projects/demolition.jpg",
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "פינוי מחסנים ולוגיסטיקה",
      description:
        "פינוי מחסנים, מרכזי לוגיסטיקה ומתחמי אחסון — כולל רכישת המתכות שנמצאו באתר.",
      category: "פינוי מפעלים",
      imageUrl: "/images/projects/warehouse.jpg",
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

function getDefaultSeo(): SeoRecord {
  return getDefaultSeoRecord();
}

export function getContentValue(
  content: SiteContentMap,
  key: string,
  fallback = ""
): string {
  return content[key] ?? fallback;
}

export type ManagerContact = {
  name: string;
  phone: string;
  whatsapp: string;
};

export function getManagersFromContent(content: SiteContentMap): ManagerContact[] {
  const managers = [
    {
      name: getContentValue(content, "manager_1_name"),
      phone: getContentValue(content, "manager_1_phone"),
      whatsapp: getContentValue(content, "manager_1_whatsapp"),
    },
    {
      name: getContentValue(content, "manager_2_name"),
      phone: getContentValue(content, "manager_2_phone"),
      whatsapp: getContentValue(content, "manager_2_whatsapp"),
    },
  ];

  return managers.filter((manager) => manager.name && manager.phone);
}

export function getValueBlocksFromContent(content: SiteContentMap) {
  return [
    {
      number: "01",
      title: getContentValue(content, "value_block_1_title"),
      description: getContentValue(content, "value_block_1_description"),
    },
    {
      number: "02",
      title: getContentValue(content, "value_block_2_title"),
      description: getContentValue(content, "value_block_2_description"),
    },
    {
      number: "03",
      title: getContentValue(content, "value_block_3_title"),
      description: getContentValue(content, "value_block_3_description"),
      accent: true,
    },
  ];
}
