import { prisma } from "./prisma";
import { cache } from "react";
import { getMaterialSeoDefaults } from "@/lib/material-seo-defaults";
import { getDefaultSeoRecord, type SeoRecord } from "@/lib/seo";
import { DEFAULT_CONTENT_ITEMS, mergeContentItems, type SiteContentMap } from "./content-values";

export type { ManagerContact, SiteContentItem, SiteContentMap } from "./content-values";
export {
  DEFAULT_CONTENT_ITEMS,
  getContentValue,
  getManagersFromContent,
  getValueBlocksFromContent,
  mergeContentItems,
} from "./content-values";

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
