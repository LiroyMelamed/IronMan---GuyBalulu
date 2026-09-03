import type { Metadata } from "next";

/** Absolute public site URL — never trailing slash. */
export function getSiteBaseUrl(canonicalUrl?: string | null): string {
  const raw =
    canonicalUrl?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://theironman.co.il";
  return raw.replace(/\/$/, "");
}

/**
 * High-intent Hebrew keyword clusters for Google Israel.
 * Buy-side only — never "מכירת מתכת" / selling metal.
 */
export const SEO_KEYWORD_CLUSTERS = {
  factoryClearing: [
    "פינוי מפעלים",
    "פירוק תשתיות מתכת",
    "קבלן פינוי מפעלים",
    "פינוי ברזל מאתרי בנייה",
    "קונה פסולת תעשייתית",
  ],
  highValueMetals: [
    "קונה נחושת",
    "קניית כבלי חשמל",
    "מחיר נחושת לקילו למחזור",
    "קניית אלומיניום",
    "קונה פליז",
  ],
  bulkAndSpecific: [
    "קונה ברזל",
    "קניית מצברים ישנים",
    "קניית מנועי חשמל",
    "קונה מזגנים למחזור",
    "פינוי פסולת ברזל",
  ],
} as const;

export const ALL_SEO_KEYWORDS: string[] = [
  "קונה מתכות",
  ...SEO_KEYWORD_CLUSTERS.factoryClearing,
  ...SEO_KEYWORD_CLUSTERS.highValueMetals,
  ...SEO_KEYWORD_CLUSTERS.bulkAndSpecific,
  "קניית ברזל",
  "קניית נחושת",
  "פינוי בינוי",
];

/** ≤60 chars — primary + secondary + brand */
export const SEO_PAGE_TITLE =
  "קונה מתכות ופינוי מפעלים | קניית ברזל ונחושת — איש הברזל";

/** ≤160 chars — CTA + high-value buy-side keywords */
export const SEO_META_DESCRIPTION =
  "קונה מתכות מקצועי — אנו קונים ברזל, נחושת, אלומיניום, מצברים וכבלי חשמל. מתמחים בפינוי מפעלים, אתרי בנייה ופסולת תעשייתית. תשלום הוגן ומיידי. צרו קשר.";

export const SEO_OG_TITLE =
  "קונה מתכות ופינוי מפעלים | איש הברזל — קניית ברזל ונחושת";

export const SEO_OG_DESCRIPTION = SEO_META_DESCRIPTION;

export const SEO_BUSINESS_NAME =
  "איש הברזל — קניית מתכות ופינוי מפעלים";

export const SEO_KEYWORDS_STRING = ALL_SEO_KEYWORDS.join(", ");

export type SeoRecord = {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  businessPostal: string;
  latitude?: number | null;
  longitude?: number | null;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function getDefaultSeoRecord(): SeoRecord {
  return {
    id: "default",
    pageTitle: SEO_PAGE_TITLE,
    metaDescription: SEO_META_DESCRIPTION,
    keywords: SEO_KEYWORDS_STRING,
    ogTitle: SEO_OG_TITLE,
    ogDescription: SEO_OG_DESCRIPTION,
    canonicalUrl: getSiteBaseUrl(),
    businessName: SEO_BUSINESS_NAME,
    businessPhone: "+972 50-756-2842",
    businessEmail: "info@ironman.co.il",
    businessAddress: "המסגר 34",
    businessCity: "נתניה",
    businessRegion: "השרון",
    businessPostal: "4240202",
    latitude: 32.3315,
    longitude: 34.8568,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

/** Offer catalog for schema.org makesOffer — maps to keyword clusters. */
export function getSchemaOffers(baseUrl: string) {
  const url = baseUrl.replace(/\/$/, "");
  return [
    {
      "@type": "Offer" as const,
      name: "פינוי מפעלים ופירוק תשתיות מתכת",
      description:
        "קבלן פינוי מפעלים — פינוי מפעלים, פירוק תשתיות מתכת, פינוי ברזל מאתרי בנייה וקונה פסולת תעשייתית ברחבי ישראל.",
      url: `${url}/#projects`,
      category: "פינוי מפעלים",
      areaServed: { "@type": "Country" as const, name: "Israel" },
    },
    {
      "@type": "Offer" as const,
      name: "קניית נחושת וכבלי חשמל",
      description:
        "קונה נחושת, קניית כבלי חשמל ומחיר נחושת לקילו למחזור — הערכה מקצועית ותשלום מיידי.",
      url: `${url}/#services`,
      category: "קניית נחושת",
      areaServed: { "@type": "Country" as const, name: "Israel" },
    },
    {
      "@type": "Offer" as const,
      name: "קניית אלומיניום ופליז",
      description:
        "קניית אלומיניום וקונה פליז — פסולת תעשייתית, פרופילים ורכיבים למחזור.",
      url: `${url}/#services`,
      category: "קניית אלומיניום",
      areaServed: { "@type": "Country" as const, name: "Israel" },
    },
    {
      "@type": "Offer" as const,
      name: "קונה ברזל ופינוי פסולת ברזל",
      description:
        "קונה ברזל ופינוי פסולת ברזל מאתרי בנייה, מפעלים ומחסנים — איסוף מהיר ותשלום הוגן.",
      url: `${url}/#services`,
      category: "קונה ברזל",
      areaServed: { "@type": "Country" as const, name: "Israel" },
    },
    {
      "@type": "Offer" as const,
      name: "קניית מצברים, מנועי חשמל ומזגנים למחזור",
      description:
        "קניית מצברים ישנים, קניית מנועי חשמל וקונה מזגנים למחזור — רכישה מקצועית לכל סוגי הציוד.",
      url: `${url}/#services`,
      category: "מחזור ציוד",
      areaServed: { "@type": "Country" as const, name: "Israel" },
    },
  ];
}

/** Absolute OG image URL — WhatsApp / Facebook require a fetchable absolute URL. */
export function getOgImageUrl(baseUrl?: string): string {
  return `${getSiteBaseUrl(baseUrl)}/og.jpg`;
}

export function buildNextMetadata(seo: SeoRecord): Metadata {
  const baseUrl = getSiteBaseUrl(seo.canonicalUrl);
  const ogImage = getOgImageUrl(baseUrl);
  const keywords = seo.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seo.pageTitle,
      template: `%s | ${seo.businessName}`,
    },
    description: seo.metaDescription,
    keywords,
    applicationName: seo.businessName,
    authors: [{ name: seo.businessName }],
    creator: seo.businessName,
    publisher: seo.businessName,
    category: "RecyclingCenter",
    alternates: {
      canonical: baseUrl,
      languages: {
        "he-IL": baseUrl,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: baseUrl,
      siteName: seo.businessName,
      locale: "he_IL",
      type: "website",
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: seo.businessName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "IL",
      "geo.placename": seo.businessCity,
      language: "Hebrew",
    },
  };
}
