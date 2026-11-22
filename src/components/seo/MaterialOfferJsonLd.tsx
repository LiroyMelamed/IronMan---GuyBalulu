import { getSiteBaseUrl } from "@/lib/seo";
import { COPPER_BUYING } from "@/lib/copper-buying";
import type { MaterialPageData } from "@/lib/materials";
import { buildMaterialMetaDescription } from "@/lib/materials";

interface MaterialOfferJsonLdProps {
  material: MaterialPageData;
}

export function buildMaterialServiceJsonLd(material: MaterialPageData, siteUrl?: string) {
  const baseUrl = getSiteBaseUrl(siteUrl);
  const pageUrl = `${baseUrl}/materials/${material.slug}`;
  const copper = material.slug === COPPER_BUYING.slug;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: copper ? COPPER_BUYING.heading : material.title,
    description: buildMaterialMetaDescription(material),
    url: pageUrl,
    provider: {
      "@type": ["LocalBusiness", "RecyclingCenter"],
      name: "איש הברזל — קניית מתכות ופינוי מפעלים",
      url: baseUrl,
    },
    ...(!copper ? {
      areaServed: {
        "@type": "Country",
        name: "Israel",
      },
      offers: {
        "@type": "Offer",
        name: material.title,
        description: buildMaterialMetaDescription(material),
        url: pageUrl,
        priceCurrency: "ILS",
        availability: "https://schema.org/InStock",
        ...(material.priceRange
          ? { priceSpecification: { "@type": "PriceSpecification", description: material.priceRange } }
          : {}),
      },
    } : {}),
    category: material.keyword,
  };
}

export function MaterialOfferJsonLd({ material }: MaterialOfferJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildMaterialServiceJsonLd(material)) }}
    />
  );
}
