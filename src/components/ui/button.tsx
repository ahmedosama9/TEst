import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold transition duration-200 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-brand-gradient text-navy shadow-glow hover:brightness-105 active:brightness-95",
        dark: "bg-navy text-white hover:bg-navy-700",
        outline: "border border-navy/20 bg-white text-ink hover:border-navy/50",
        outlineDark: "on-dark border border-white/30 text-white hover:border-aqua hover:text-aqua",
        ghost: "text-teal-ink hover:text-ink",
      },
      size: {
        md: "min-h-11 px-5 py-2.5 text-sm",
        lg: "min-h-13 px-7 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
