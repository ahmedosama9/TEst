import { cn } from "@/lib/utils";

/**
 * Brand mark: geometric S-shaped ribbon with an integrated play button.
 * Pure SVG, scales to any size. `idPrefix` keeps gradient ids unique when rendered twice.
 */
export function LogoMark({ className, idPrefix = "smk" }: { className?: string; idPrefix?: string }) {
  const g = `${idPrefix}-g`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00D4B3" />
          <stop offset="1" stopColor="#33F6E0" />
        </linearGradient>
      </defs>
      {/* upper ribbon */}
      <path
        fill={`url(#${g})`}
        d="M50 6H26C15 6 6 15 6 26s9 20 20 20h4V34h-4a8 8 0 0 1 0-16h24a6 6 0 0 0 0-12Z"
        opacity=".95"
      />
      {/* lower ribbon */}
      <path
        fill={`url(#${g})`}
        d="M14 58h24c11 0 20-9 20-20S49 18 38 18h-4v12h4a8 8 0 0 1 0 16H14a6 6 0 0 0 0 12Z"
        opacity=".78"
      />
      {/* play button */}
      <path fill="#0B1026" d="M28.5 25.6v12.8a1.6 1.6 0 0 0 2.4 1.4l11-6.4a1.6 1.6 0 0 0 0-2.8l-11-6.4a1.6 1.6 0 0 0-2.4 1.4Z" />
    </svg>
  );
}

export function Logo({ className, tone = "light", idPrefix }: { className?: string; tone?: "light" | "dark"; idPrefix?: string }) {
  return (
    <span className={cn("ltr-isolate inline-flex items-center gap-2.5", className)} dir="ltr">
      <LogoMark className="size-9 shrink-0" idPrefix={idPrefix} />
      <span
        className={cn(
          "font-[family-name:var(--font-montserrat),sans-serif] text-[1.05rem] leading-none font-extrabold tracking-tight",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        Social Media <span className={tone === "light" ? "text-aqua" : "text-teal-ink"}>Komplett</span>
      </span>
    </span>
  );
}
