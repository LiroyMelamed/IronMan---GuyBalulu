import {
  getOgImageUrl,
  getSchemaOffers,
  getSiteBaseUrl,
  ALL_SEO_KEYWORDS,
  SEO_BUSINESS_NAME,
} from "@/lib/seo";

export interface LocalBusinessJsonLdProps {
  businessName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  url: string;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Advanced LocalBusiness + RecyclingCenter JSON-LD for Google Israel.
 * Buy-side offers only (קונה / קניית / פינוי) — never selling metal.
 */
export function LocalBusinessJsonLd({
  businessName,
  description,
  phone,
  email,
  address,
  city,
  region,
  postalCode,
  url,
  latitude,
  longitude,
}: LocalBusinessJsonLdProps) {
  const baseUrl = getSiteBaseUrl(url);
  const name = businessName?.trim() || SEO_BUSINESS_NAME;
  const ogImage = getOgImageUrl(baseUrl);
  const logoUrl = `${baseUrl}/logo.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RecyclingCenter"],
    "@id": `${baseUrl}/#business`,
    name,
    alternateName: ["איש הברזל", "Iron Man Guy Balulu", "קונה מתכות"],
    description,
    url: baseUrl,
    image: [ogImage, logoUrl],
    logo: logoUrl,
    telephone: phone,
    email,
    priceRange: "$$",
    currenciesAccepted: "ILS",
    paymentAccepted: "Cash, Bank Transfer",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: "IL",
    },
    ...(latitude != null && longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }
      : {}),
    areaServed: [
      {
        "@type": "Country",
        name: "Israel",
        sameAs: "https://www.wikidata.org/wiki/Q801",
      },
      {
        "@type": "AdministrativeArea",
        name: "מרכז",
      },
      {
        "@type": "City",
        name: city,
      },
    ],
    knowsAbout: ALL_SEO_KEYWORDS,
    makesOffer: getSchemaOffers(baseUrl),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "שירותי קניית מתכות ופינוי מפעלים",
      itemListElement: getSchemaOffers(baseUrl).map((offer, index) => ({
        "@type": "OfferCatalog",
        name: offer.name,
        itemListElement: [
          {
            ...offer,
            position: index + 1,
          },
        ],
      })),
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "sales",
        areaServed: "IL",
        availableLanguage: ["Hebrew", "he"],
      },
    ],
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
