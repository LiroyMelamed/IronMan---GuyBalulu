import Image from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_LOGO_IMAGE } from "@/lib/site-images";

type LogoVariant = "full" | "compact" | "icon";

interface IshHaBarzelLogoProps {
  src?: string;
  variant?: LogoVariant;
  className?: string;
  inverted?: boolean;
}

const LOGO_SIZES: Record<LogoVariant, { width: number; height: number; className: string }> = {
  full: { width: 320, height: 120, className: "h-14 md:h-16 w-auto" },
  compact: { width: 220, height: 80, className: "h-10 w-auto" },
  icon: { width: 120, height: 48, className: "h-8 w-auto" },
};

export function IshHaBarzelLogo({
  src = FALLBACK_LOGO_IMAGE,
  variant = "full",
  className,
  inverted = false,
}: IshHaBarzelLogoProps) {
  const size = LOGO_SIZES[variant];

  return (
    <Image
      src={src}
      alt="איש הברזל — קנייה • פינוי תעשייתי"
      width={size.width}
      height={size.height}
      priority={variant === "full"}
      className={cn(
        size.className,
        "object-contain object-right",
        inverted && "brightness-0 invert",
        className
      )}
    />
  );
}
