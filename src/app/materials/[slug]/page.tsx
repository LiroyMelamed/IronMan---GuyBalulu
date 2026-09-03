import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { PageBackground } from "@/components/layout/PageBackground";
import { TerexHeroBackdrop, TerexLabel, TerexButton } from "@/components/ui/terex";
import { TerexImage } from "@/components/ui/terex-image";
import { MaterialOfferJsonLd } from "@/components/seo/MaterialOfferJsonLd";
import { getSiteContent } from "@/lib/content";
import { resolveMaterialImage } from "@/lib/images";
import {
  buildMaterialMetadata,
  buildMaterialWhatsAppUrl,
  getActiveMaterialSlugs,
  getMaterialBySlug,
} from "@/lib/materials";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getActiveMaterialSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) return {};
  return buildMaterialMetadata(material);
}

function LongDescription({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-base leading-relaxed text-terex-muted md:text-lg">
          {paragraph.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {line}
              {lineIndex < paragraph.split("\n").length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default async function MaterialPage({ params }: PageProps) {
  const { slug } = await params;
  const [material, content] = await Promise.all([getMaterialBySlug(slug), getSiteContent()]);

  if (!material) notFound();

  const whatsappUrl = buildMaterialWhatsAppUrl(material);
  const imageSrc = resolveMaterialImage(material.imageUrl, material.icon);

  return (
    <>
      <MaterialOfferJsonLd material={material} />

      <PageBackground>
        <Navbar content={content} />

        <main>
          {/* Hero */}
          <section
            className="relative min-h-[70vh] bg-terex-gray overflow-hidden"
            aria-labelledby="material-hero-heading"
          >
            <TerexHeroBackdrop text={material.keyword.replace(/^קניית\s|^קונה\s/, "")} />

            <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-16">
              <div className="mb-6 flex items-center justify-between gap-4">
                <TerexLabel>מתכות — {material.slug.toUpperCase()}</TerexLabel>
                <Link
                  href="/#services"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-terex-blue hover:text-terex-navy transition-colors"
                >
                  ← חזרה לכל המתכות
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
                <div className="bg-terex-navy p-8 md:p-10 lg:p-12">
                  <h1
                    id="material-hero-heading"
                    className="text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
                  >
                    {material.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                    {material.description}
                  </p>
                </div>

                <div className="relative aspect-[4/3] w-full max-h-[360px] bg-terex-gray">
                  <TerexImage
                    src={imageSrc}
                    alt={material.title}
                    priority
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Content + pricing */}
          <section className="bg-white py-12 md:py-20" aria-labelledby="material-content-heading">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-3 lg:gap-16 lg:px-16">
              <div className="lg:col-span-2">
                <TerexLabel>01 — תוכן</TerexLabel>
                <h2
                  id="material-content-heading"
                  className="mt-2 text-2xl font-black text-terex-charcoal md:text-4xl"
                >
                  {material.keyword}
                </h2>
                <div className="mt-8 border-t border-terex-gray pt-8">
                  <LongDescription text={material.longDescription} />
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="border-2 border-terex-navy bg-terex-gray p-8 md:p-10">
                  <TerexLabel>טווח מחיר משוער</TerexLabel>
                  <p className="mt-4 text-3xl font-black text-terex-navy md:text-4xl">
                    {material.priceRange ?? "הצעת מחיר לפי שוק"}
                  </p>
                  <p className="mt-6 border-t border-terex-navy/20 pt-6 text-sm leading-relaxed text-terex-muted">
                    שימו לב: מחירי המתכות בבורסה (LME) נתונים לשינויים על בסיס יומי.
                  </p>
                </div>

                <div className="mt-8">
                  <TerexButton
                    href={whatsappUrl}
                    external
                    className="w-full py-5 text-sm md:text-base"
                  >
                    <MessageCircle className="ml-2 h-5 w-5" aria-hidden="true" />
                    לקבלת הצעת מחיר מעודכנת להיום ב-WhatsApp
                  </TerexButton>
                </div>
              </aside>
            </div>
          </section>

          {/* Bottom CTA strip */}
          <section className="bg-terex-navy py-16 md:py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center md:px-12 lg:px-16">
              <div>
                <TerexLabel className="!text-white/70">צור קשר</TerexLabel>
                <p className="mt-2 text-xl font-black text-white md:text-2xl">
                  מוכנים למכור {material.title.replace(/^קניית\s|^קונה\s/, "")}?
                </p>
                <p className="mt-2 max-w-lg text-sm text-white/75 md:text-base">
                  תשלום הוגן, איסוף מהיר ושירות מקצועי — אנחנו קונים, לא מוכרים.
                </p>
              </div>
              <TerexButton href={whatsappUrl} external variant="white" className="shrink-0 py-5">
                <MessageCircle className="ml-2 h-5 w-5" aria-hidden="true" />
                WhatsApp
              </TerexButton>
            </div>
          </section>
        </main>

        <Footer content={content} />
      </PageBackground>
    </>
  );
}
