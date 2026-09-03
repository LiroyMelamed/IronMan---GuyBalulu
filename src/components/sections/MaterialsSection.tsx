import {
  TerexSection,
  TerexSectionHeader,
  TerexNumberBlocks,
  TerexMediaCard,
  TerexMediaGrid,
} from "@/components/ui/terex";
import { TerexImage } from "@/components/ui/terex-image";
import { resolveMaterialImage } from "@/lib/images";
import { getContentValue, getValueBlocksFromContent, type SiteContentMap } from "@/lib/content";

interface MaterialsSectionProps {
  content: SiteContentMap;
  materials: {
    id: string;
    title: string;
    description: string;
    icon: string;
    keyword: string;
    slug: string;
    imageUrl?: string | null;
    sortOrder: number;
  }[];
}

export function MaterialsSection({ content, materials }: MaterialsSectionProps) {
  return (
    <TerexSection id="services" className="bg-white py-4 md:py-8" aria-labelledby="materials-heading">
      <TerexSectionHeader
        label="שירותים"
        title={getContentValue(content, "materials_title")}
        subtitle={getContentValue(content, "materials_subtitle")}
        id="materials-heading"
      />

      <TerexNumberBlocks blocks={getValueBlocksFromContent(content)} />

      <div className="mt-16 md:mt-24">
        <div className="px-6 md:px-12 lg:px-16 mb-8">
          <span className="terex-section-label">מתכות</span>
        </div>
        <TerexMediaGrid>
          {materials.map((material) => (
            <TerexMediaCard
              key={material.id}
              title={material.title}
              description={material.description}
              footerLabel="פרטים"
              href={`/materials/${material.slug}`}
              hideTitle
              image={
                <>
                  <TerexImage
                    src={resolveMaterialImage(material.imageUrl, material.icon)}
                    alt={material.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-terex-navy/75 via-terex-navy/15 to-transparent" />
                  <span className="absolute bottom-4 right-4 text-white font-black text-lg md:text-xl drop-shadow-sm">
                    {material.title}
                  </span>
                </>
              }
            />
          ))}
        </TerexMediaGrid>
      </div>
    </TerexSection>
  );
}
