"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { ArrowUpLeft, Play } from "lucide-react";

/* ─── Labels ─── */

export function TerexLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("terex-spec-label", className)}>{children}</span>
  );
}

/* ─── Buttons ─── */

interface TerexButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: ReactNode;
  variant?: "primary" | "outline" | "white";
  className?: string;
  external?: boolean;
}

export function TerexButton({
  href,
  onClick,
  type = "button",
  children,
  variant = "primary",
  className,
  external,
}: TerexButtonProps) {
  const styles = {
    primary: "bg-terex-navy text-white hover:bg-terex-blue",
    outline: "bg-transparent text-terex-navy border border-terex-navy hover:bg-terex-navy hover:text-white",
    white: "bg-transparent text-white border border-white/60 hover:bg-white/10",
  };

  const cls = cn(
    "inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200",
    styles[variant],
    className
  );

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ─── Hero backdrop text ─── */

export function TerexHeroBackdrop({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      <span className="terex-giant-bg-text">{text}</span>
    </div>
  );
}

/* ─── Section header ─── */

interface TerexSectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  id?: string;
  light?: boolean;
}

export function TerexSectionHeader({ label, title, subtitle, id, light = false }: TerexSectionHeaderProps) {
  return (
    <motion.header
      className="px-6 md:px-12 lg:px-16 py-12 md:py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <TerexLabel className={light ? "!text-white/70" : undefined}>{label}</TerexLabel>
      <h2
        id={id}
        className={cn(
          "text-3xl md:text-5xl font-black leading-tight mt-2",
          light ? "text-white" : "text-terex-charcoal"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base md:text-lg leading-relaxed",
            light ? "text-white/75" : "text-terex-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}

/* ─── Numbered feature blocks (01/02/03) ─── */

interface NumberBlock {
  number: string;
  title: string;
  description: string;
  accent?: boolean;
}

export function TerexNumberBlocks({ blocks }: { blocks: NumberBlock[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 terex-grid-gap mx-6 md:mx-12 lg:mx-16">
      {blocks.map((block, i) => (
        <motion.div
          key={block.number}
          className={cn(
            "relative p-8 md:p-10 min-h-[280px] flex flex-col",
            block.accent ? "bg-terex-navy text-white" : "bg-terex-gray"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <div className="flex items-start gap-3 mb-8">
            <span
              className={cn(
                "inline-block w-3 h-3 mt-1 shrink-0",
                block.accent ? "bg-white" : "bg-terex-blue"
              )}
            />
            <span
              className={cn(
                "terex-outline-number text-[5rem] md:text-[6rem]",
                block.accent && "[-webkit-text-stroke-color:rgba(255,255,255,0.3)]"
              )}
            >
              {block.number}
            </span>
          </div>
          <h3 className={cn("text-lg font-black mb-3", block.accent ? "text-white" : "text-terex-charcoal")}>
            {block.title}
          </h3>
          <p className={cn("text-sm leading-relaxed flex-1", block.accent ? "text-white/80" : "text-terex-muted")}>
            {block.description}
          </p>
          {block.accent && (
            <ArrowUpLeft className="absolute bottom-6 left-6 h-4 w-4 text-white/50" aria-hidden="true" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Media card ─── */

interface TerexMediaCardProps {
  image?: ReactNode;
  tag?: string;
  meta?: string;
  title: string;
  description?: string;
  footerLabel?: string;
  footerIcon?: "photo" | "video";
  href?: string;
  hideTitle?: boolean;
}

export function TerexMediaCard({
  image,
  tag,
  meta,
  title,
  description,
  footerLabel,
  footerIcon = "photo",
  href,
  hideTitle = false,
}: TerexMediaCardProps) {
  const content = (
    <motion.article
      className="bg-white flex flex-col h-full group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[4/3] bg-terex-gray overflow-hidden">
        {image ?? (
          <div className="absolute inset-0 bg-gradient-to-br from-terex-gray to-terex-muted/30" />
        )}
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 border-t border-terex-gray">
        {(meta || tag) && (
          <div className="flex items-center justify-between gap-2 mb-3">
            {meta && <span className="terex-spec-label text-[9px]">{meta}</span>}
            {tag && <span className="terex-spec-label text-[9px] mr-auto">{tag}</span>}
          </div>
        )}
        {!hideTitle && (
          <h3 className="text-base md:text-lg font-black text-terex-charcoal leading-snug group-hover:text-terex-blue transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-2 text-sm text-terex-muted leading-relaxed line-clamp-2">{description}</p>
        )}
        {footerLabel && (
          <div className="mt-auto pt-4 flex items-center justify-between gap-3 min-h-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terex-muted leading-none">
              {footerLabel}
            </span>
            {footerIcon === "video" ? (
              <Play className="h-4 w-4 shrink-0 text-terex-blue fill-terex-blue" aria-hidden="true" />
            ) : (
              <ArrowUpLeft className="h-4 w-4 shrink-0 text-terex-blue" aria-hidden="true" />
            )}
          </div>
        )}
      </div>
    </motion.article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

/* ─── Media grid ─── */

export function TerexMediaGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 terex-grid-gap mx-6 md:mx-12 lg:mx-16">
      {children}
    </div>
  );
}

/* ─── Section wrapper ─── */

export function TerexSection({
  id,
  children,
  className,
  "aria-labelledby": ariaLabelledby,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("relative", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Panel ─── */

export function TerexPanel({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative",
        dark ? "bg-terex-navy text-white" : "bg-white",
        className
      )}
    >
      {children}
    </div>
  );
}
