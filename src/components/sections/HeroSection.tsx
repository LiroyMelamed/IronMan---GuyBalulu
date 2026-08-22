"use client";

import Link from "next/link";
import { TerexLabel, TerexButton } from "@/components/ui/terex";
import { TerexImage } from "@/components/ui/terex-image";
import { FALLBACK_HERO_IMAGE } from "@/lib/site-images";
import { getContentValue, type SiteContentMap } from "@/lib/content";

interface HeroSectionProps {
  content: SiteContentMap;
}

export function HeroSection({ content }: HeroSectionProps) {
  const heroImage = getContentValue(content, "hero_image", FALLBACK_HERO_IMAGE);

  return (
    <section className="relative min-h-screen bg-terex-gray overflow-hidden" aria-labelledby="hero-heading">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-10 pt-24 md:px-12 md:pb-14 md:pt-28 lg:px-16">
        <div className="mb-6 flex shrink-0 justify-end lg:mb-8">
          <TerexLabel>01 — 03</TerexLabel>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-14 xl:gap-20">
          <div className="relative aspect-[4/3] w-full max-w-xl shrink-0 lg:max-w-none lg:flex-1 lg:max-h-[min(52vh,520px)] lg:aspect-auto lg:h-[min(52vh,520px)]">
            <TerexImage
              src={heroImage}
              alt="ערימת פסולת מתכת וברזל למחזור"
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              objectPosition="center 60%"
            />
          </div>

          <div className="flex w-full max-w-xl shrink-0 flex-col items-center text-center lg:max-w-lg lg:flex-1 lg:items-start lg:text-right">
            <h1
              id="hero-heading"
              className="text-2xl font-black leading-tight text-terex-charcoal sm:text-3xl md:text-4xl xl:text-5xl"
            >
              {getContentValue(content, "hero_title")}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-terex-muted md:mt-5 md:text-base lg:max-w-none">
              {getContentValue(content, "hero_subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:mt-8 lg:justify-start">
              <TerexButton href="#contact">{getContentValue(content, "hero_cta")}</TerexButton>
              <Link
                href="#services"
                className="inline-flex h-[46px] items-center border-b border-terex-blue/30 font-mono text-xs uppercase tracking-[0.2em] text-terex-blue transition-colors hover:text-terex-navy"
              >
                {getContentValue(content, "hero_secondary")} ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
