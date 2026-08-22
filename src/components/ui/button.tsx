import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "secondary" | "outline" | "ghost" | "whatsapp";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "default", ...props }, ref) => {
    const variants = {
      solid: "bg-terex-navy text-white border-2 border-terex-navy hover:bg-terex-blue",
      secondary: "bg-terex-blue text-white border-2 border-terex-blue hover:bg-terex-navy",
      outline: "border-2 border-terex-navy bg-transparent text-terex-navy hover:bg-terex-navy hover:text-white",
      ghost: "text-terex-navy hover:bg-terex-gray border-2 border-transparent hover:border-terex-gray",
      whatsapp: "bg-[#25D366] text-white border-2 border-[#25D366] hover:bg-[#20BD5A]",
    };

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 px-4 text-xs",
      lg: "h-14 px-8 text-base",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terex-blue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
