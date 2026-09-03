import type { MetadataRoute } from "next";
import { getSeoMetadata } from "@/lib/content";
import { getActiveMaterialSlugs } from "@/lib/materials";
import { getSiteBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoMetadata();
  const baseUrl = getSiteBaseUrl(seo.canonicalUrl);
  const slugs = await getActiveMaterialSlugs();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${baseUrl}/materials/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
