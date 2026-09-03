import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getMaterialSeoDefaults } from "@/lib/material-seo-defaults";
import { getOgImageUrl, getSiteBaseUrl } from "@/lib/seo";
import type { Metadata } from "next";

export type MaterialPageData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  keyword: string;
  slug: string;
  longDescription: string;
  priceRange: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

function enrichMaterial(material: MaterialPageData): MaterialPageData {
  const defaults = getMaterialSeoDefaults(material.icon);
  return {
    ...material,
    slug: material.slug || defaults?.slug || material.icon,
    longDescription: material.longDescription?.trim() || defaults?.longDescription || material.description,
    priceRange: material.priceRange?.trim() || defaults?.priceRange || null,
    seoTitle: material.seoTitle?.trim() || defaults?.seoTitle || `${material.title} | איש הברזל`,
    seoDescription:
      material.seoDescription?.trim() ||
      defaults?.seoDescription ||
      material.description,
  };
}

export const getMaterialBySlug = cache(async (slug: string): Promise<MaterialPageData | null> => {
  try {
    const material = await prisma.material.findFirst({
      where: { slug, isActive: true },
    });
    if (!material) return null;
    return enrichMaterial(material);
  } catch {
    return null;
  }
});

export const getActiveMaterialSlugs = cache(async (): Promise<string[]> => {
  try {
    const materials = await prisma.material.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    return materials.map((m) => m.slug);
  } catch {
    return [];
  }
});

export function buildMaterialPageTitle(material: MaterialPageData): string {
  return material.seoTitle ?? `${material.title} — איש הברזל`;
}

export function buildMaterialMetaDescription(material: MaterialPageData): string {
  return material.seoDescription ?? material.description;
}

export function buildMaterialMetadata(
  material: MaterialPageData,
  baseUrl?: string
): Metadata {
  const siteUrl = getSiteBaseUrl(baseUrl);
  const pageUrl = `${siteUrl}/materials/${material.slug}`;
  const ogImage = getOgImageUrl(siteUrl);
  const title = buildMaterialPageTitle(material);
  const description = buildMaterialMetaDescription(material);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [material.keyword, material.title, "קונה מתכות", "איש הברזל"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "איש הברזל — קניית מתכות ופינוי מפעלים",
      locale: "he_IL",
      type: "website",
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: material.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function buildMaterialWhatsAppUrl(material: MaterialPageData): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "972507562842";
  const text = encodeURIComponent(
    `שלום, אני מעוניין/ת למכור ${material.title}. אשמח לקבל הצעת מחיר מעודכנת להיום.`
  );
  return `https://wa.me/${number}?text=${text}`;
}
