import { cn } from "@/lib/utils";

/** Discreet “built by MelaMedia” attribution — matches Barber / FlyGift / MelaMotion. */
export function PoweredByMelaMedia({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <a
      href="https://mela-media.co.il"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center text-[11px] tracking-wide transition-colors",
        variant === "dark"
          ? "text-white/50 hover:text-white/75"
          : "text-terex-muted/70 hover:text-terex-muted",
        className
      )}
    >
      נבנה ע״י{" "}
      <span
        className={cn(
          "ms-1 font-semibold",
          variant === "dark" ? "text-white/70" : "text-terex-charcoal/70"
        )}
      >
        MelaMedia
      </span>
    </a>
  );
}
