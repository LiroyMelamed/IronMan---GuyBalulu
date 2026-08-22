import {
  getSiteContent,
  getMaterials,
  getProjects,
  getSeoMetadata,
} from "@/lib/content";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { PageBackground } from "@/components/layout/PageBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const [content, materials, projects, seo] = await Promise.all([
    getSiteContent(),
    getMaterials(),
    getProjects(),
    getSeoMetadata(),
  ]);

  return (
    <>
      <LocalBusinessJsonLd
        businessName={seo.businessName}
        description={seo.metaDescription}
        phone={seo.businessPhone}
        email={seo.businessEmail}
        address={seo.businessAddress}
        city={seo.businessCity}
        region={seo.businessRegion}
        postalCode={seo.businessPostal}
        url={seo.canonicalUrl}
        latitude={seo.latitude}
        longitude={seo.longitude}
      />

      <PageBackground>
        <Navbar content={content} />

        <main>
          <HeroSection content={content} />
          <MaterialsSection content={content} materials={materials} />
          <ProjectsSection content={content} projects={projects} />
          <ContactSection
            content={content}
            businessEmail={seo.businessEmail}
            businessAddress={`${seo.businessAddress}, ${seo.businessCity}`}
          />
        </main>

        <Footer content={content} />
      </PageBackground>
    </>
  );
}
