import { cn } from "@/lib/utils";

/**
 * Brand mark: angular, forward-leaning "S" made of two folded ribbons with an integrated
 * play button (see docs/brand/brand-reference.jpg). Pure SVG, scales to any size.
 * `idPrefix` keeps gradient ids unique when the logo is rendered more than once per page.
 */
export function LogoMark({ className, idPrefix = "smk", play = "#FFFFFF" }: { className?: string; idPrefix?: string; play?: string }) {
  const g = `${idPrefix}-g`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33F6E0" />
          <stop offset="1" stopColor="#00D4B3" />
        </linearGradient>
      </defs>
      <g transform="rotate(-9 32 32) translate(4.2 4.2) scale(.87)">
        {/* folds (darker) */}
        <path fill="#00A88F" d="M16.88 18 L30.88 18 L25.42 31 L11.42 31Z" />
        <path fill="#00A88F" d="M38.58 33 L52.58 33 L47.12 46 L33.12 46Z" />
        {/* ribbons */}
        <path fill={`url(#${g})`} d="M22.34 5 L64.34 5 L58.88 18 L16.88 18Z" />
        <path fill={`url(#${g})`} d="M5.12 46 L47.12 46 L41.66 59 L-0.34 59Z" />
        {/* play button */}
        <path fill={play} d="M25.5 22 L25.5 42 L43 32Z" />
      </g>
    </svg>
  );
}

/** Mark + two-line italic wordmark with the slanted divider from the brand sheet. */
export function Logo({ className, tone = "light", idPrefix }: { className?: string; tone?: "light" | "dark"; idPrefix?: string }) {
  const light = tone === "light";
  return (
    <span className={cn("ltr-isolate inline-flex items-center gap-2", className)} dir="ltr">
      <LogoMark className="size-11 shrink-0" idPrefix={idPrefix} play={light ? "#FFFFFF" : "#0B1026"} />
      <span className={cn("h-9 w-px rotate-12", light ? "bg-white/40" : "bg-navy/30")} aria-hidden="true" />
      <span className="flex flex-col font-[family-name:var(--font-montserrat),sans-serif] text-[1.02rem] leading-[1.02] font-extrabold tracking-tight italic">
        <span className={light ? "text-white" : "text-ink"}>Social Media</span>
        <span className={light ? "text-aqua" : "text-teal-ink"}>Komplett</span>
      </span>
    </span>
  );
}
