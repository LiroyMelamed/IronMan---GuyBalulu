"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IshHaBarzelLogo } from "@/components/brand/IshHaBarzelLogo";
import { PoweredByMelaMedia } from "@/components/layout/PoweredByMelaMedia";
import { TerexButton } from "@/components/ui/terex";
import { getContentValue, type SiteContentMap } from "@/lib/content";

export function NavbarClient({ content }: { content: SiteContentMap }) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-terex-gray backdrop-blur-sm"
      initial={false}
    >
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-12 lg:px-16"
        aria-label="ניווט ראשי"
      >
        <Link href="/" aria-label="איש הברזל — דף הבית">
          <IshHaBarzelLogo src={getContentValue(content, "logo_image")} variant="full" />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {[
            { href: "#services", label: getContentValue(content, "nav_services") },
            { href: "#projects", label: getContentValue(content, "nav_projects") },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-terex-muted hover:text-terex-navy transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <TerexButton href="#contact" className="!py-2.5 !px-6">
              {getContentValue(content, "nav_contact")}
            </TerexButton>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}

export function FooterClient({ content }: { content: SiteContentMap }) {
  return (
    <motion.footer
      className="w-full border-t border-white/10 bg-terex-navy py-10 px-6 md:px-12 lg:px-16"
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:items-center md:gap-16">
        <Link href="/" aria-label="איש הברזל — דף הבית" className="shrink-0">
          <IshHaBarzelLogo
            src={getContentValue(content, "logo_image")}
            variant="full"
            className="h-12 md:h-14 brightness-0 invert"
          />
        </Link>
        <p className="max-w-3xl text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-white/60 md:text-left">
          {getContentValue(content, "footer_text")}
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <PoweredByMelaMedia variant="dark" />
      </div>
    </motion.footer>
  );
}
