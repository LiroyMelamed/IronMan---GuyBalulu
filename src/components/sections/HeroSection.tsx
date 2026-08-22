"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TerexLabel, TerexButton, TerexHeroBackdrop } from "@/components/ui/terex";
import { TerexImage } from "@/components/ui/terex-image";
import { FALLBACK_HERO_IMAGE } from "@/lib/site-images";
import { getContentValue, type SiteContentMap } from "@/lib/content";

interface HeroSectionProps {
  content: SiteContentMap;
}

export function HeroSection({ content }: HeroSectionProps) {
  const heroImage = getContentValue(content, "hero_image", FALLBACK_HERO_IMAGE);

  return (
    <section className="relative h-screen bg-terex-gray overflow-hidden" aria-labelledby="hero-heading">
      <TerexHeroBackdrop text="איש הברזל" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex shrink-0 justify-end px-6 md:px-12 lg:px-16 pt-24 md:pt-28 pb-2">
          <TerexLabel>01 — 03</TerexLabel>
        </div>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 pb-8 md:pb-12 gap-6 md:gap-8">
          <motion.div
            className="relative w-full max-w-4xl flex-1 min-h-[180px] max-h-[45vh] bg-terex-gray"
            initial={false}
          >
            <TerexImage
              src={heroImage}
              alt="ערימת פסולת מתכת וברזל למחזור"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              objectPosition="center 60%"
            />
          </motion.div>

          <div className="shrink-0 text-center max-w-3xl">
            <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-terex-charcoal leading-tight">
              {getContentValue(content, "hero_title")}
            </h1>
            <p className="mt-4 md:mt-6 text-sm md:text-lg text-terex-muted leading-relaxed max-w-2xl mx-auto line-clamp-3 md:line-clamp-none">
              {getContentValue(content, "hero_subtitle")}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center justify-center gap-4">
            <TerexButton href="#contact">{getContentValue(content, "hero_cta")}</TerexButton>
            <Link
              href="#services"
              className="inline-flex items-center h-[46px] font-mono text-xs uppercase tracking-[0.2em] text-terex-blue hover:text-terex-navy transition-colors border-b border-terex-blue/30"
            >
              {getContentValue(content, "hero_secondary")} ←
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
