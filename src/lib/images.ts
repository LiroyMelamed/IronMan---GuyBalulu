import { FALLBACK_MATERIAL_IMAGES, FALLBACK_PROJECT_IMAGES } from "@/lib/site-images";

export function resolveMaterialImage(
  imageUrl: string | null | undefined,
  icon: string
): string {
  if (imageUrl) return imageUrl;
  const key = icon as keyof typeof FALLBACK_MATERIAL_IMAGES;
  return FALLBACK_MATERIAL_IMAGES[key] ?? FALLBACK_MATERIAL_IMAGES.metal;
}

export function resolveProjectImage(
  imageUrl: string | null | undefined,
  index: number
): string {
  if (imageUrl) return imageUrl;
  return FALLBACK_PROJECT_IMAGES[index % FALLBACK_PROJECT_IMAGES.length];
}
