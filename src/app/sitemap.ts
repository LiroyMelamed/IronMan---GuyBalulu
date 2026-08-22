import type { MetadataRoute } from "next";
import { getSeoMetadata } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoMetadata();

  return [
    {
      url: seo.canonicalUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
