import {
  TerexSection,
  TerexSectionHeader,
  TerexMediaCard,
  TerexMediaGrid,
} from "@/components/ui/terex";
import { TerexImage } from "@/components/ui/terex-image";
import { resolveProjectImage } from "@/lib/images";
import { getContentValue, type SiteContentMap } from "@/lib/content";

interface ProjectsSectionProps {
  content: SiteContentMap;
  projects: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string | null;
    sortOrder: number;
  }[];
}

export function ProjectsSection({ content, projects }: ProjectsSectionProps) {
  return (
    <TerexSection id="projects" className="bg-terex-gray py-4 md:py-8" aria-labelledby="projects-heading">
      <TerexSectionHeader
        label="פרויקטים"
        title={getContentValue(content, "projects_title")}
        subtitle={getContentValue(content, "projects_subtitle")}
        id="projects-heading"
      />

      <TerexMediaGrid>
        {projects.map((project, index) => (
          <TerexMediaCard
            key={project.id}
            title={project.title}
            description={project.description}
            footerLabel="פרטים"
            footerIcon="photo"
            href="#contact"
            hideTitle
            image={
              <>
                <TerexImage
                  src={resolveProjectImage(project.imageUrl, index)}
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terex-navy/70 via-terex-navy/20 to-transparent" />
                <span className="absolute bottom-4 right-4 text-white font-black text-xl md:text-2xl drop-shadow-sm">
                  {project.title}
                </span>
              </>
            }
          />
        ))}
      </TerexMediaGrid>
    </TerexSection>
  );
}
