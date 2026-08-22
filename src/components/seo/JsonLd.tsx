interface JsonLdProps {
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
}: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description,
    url,
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: "IL",
    },
    ...(latitude && longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }
      : {}),
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    priceRange: "$$",
    knowsAbout: [
      "קניית ברזל",
      "קניית נחושת",
      "קניית אלומיניום",
      "קניית מצברים",
      "קניית כבלי חשמל",
      "קניית פליז",
      "קניית מנועי חשמל",
      "קניית מזגנים למחזור",
      "פינוי מפעלים",
      "פרויקטי פינוי בינוי",
      "קונה מתכות",
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
