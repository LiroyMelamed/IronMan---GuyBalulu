import { getSiteBaseUrl } from "@/lib/seo";
import type { MaterialPageData } from "@/lib/materials";
import { buildMaterialMetaDescription } from "@/lib/materials";

interface MaterialOfferJsonLdProps {
  material: MaterialPageData;
}

export function MaterialOfferJsonLd({ material }: MaterialOfferJsonLdProps) {
  const baseUrl = getSiteBaseUrl();
  const pageUrl = `${baseUrl}/materials/${material.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: material.title,
    description: buildMaterialMetaDescription(material),
    url: pageUrl,
    provider: {
      "@type": ["LocalBusiness", "RecyclingCenter"],
      name: "איש הברזל — קניית מתכות ופינוי מפעלים",
      url: baseUrl,
    },
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
    category: material.keyword,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
