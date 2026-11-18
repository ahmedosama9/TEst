import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The approved Social Media Komplett logo, rendered from the supplied artwork
 * (master: public/brand/source/logo-original.png — never edited).
 *
 * - tone "light": for dark backgrounds (header, footer) → white wordmark variant
 * - tone "dark":  for light backgrounds → the original colours
 * Both files are produced by scripts/derive-brand-variants.py and share the same
 * dimensions, so the logo is never stretched or redrawn.
 */
const LOGO = { width: 1987, height: 573 } as const;

export function Logo({ className, tone = "light", eager = false }: { className?: string; tone?: "light" | "dark"; eager?: boolean }) {
  return (
    <Image
      src={tone === "light" ? "/brand/logo-on-dark.png" : "/brand/logo.png"}
      alt="Social Media Komplett"
      width={LOGO.width}
      height={LOGO.height}
      sizes="(min-width: 640px) 190px, 160px"
      loading={eager ? "eager" : "lazy"}
      className={cn("h-11 w-auto sm:h-[3.25rem]", className)}
    />
  );
}
