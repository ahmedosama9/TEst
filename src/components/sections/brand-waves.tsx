import { cn } from "@/lib/utils";

/**
 * Decorative brand backdrop: the sweeping teal ribbons from the brand sheet.
 * Purely presentational; mirrored automatically in RTL.
 */
export function BrandWaves({ className, idPrefix = "bw" }: { className?: string; idPrefix?: string }) {
  const a = `${idPrefix}-a`;
  const b = `${idPrefix}-b`;
  return (
    <svg
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 size-full rtl:-scale-x-100", className)}
    >
      <defs>
        <linearGradient id={a} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#00D4B3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#33F6E0" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#33F6E0" stopOpacity="0.05" />
          <stop offset="1" stopColor="#00D4B3" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* bottom-left sweep */}
      <path fill={`url(#${a})`} opacity="0.55" d="M0 640V520c180 40 380 10 560-70 150-66 260-150 420-190-170 90-270 200-440 280C380 615 180 650 0 640Z" />
      <path fill={`url(#${a})`} opacity="0.3" d="M0 640V470c120 70 330 60 520-20-150 110-330 170-520 190Z" />
      {/* top-right sweep */}
      <path fill={`url(#${b})`} opacity="0.35" d="M1440 0v150c-130-60-300-70-470-30 130-70 300-110 470-120Z" />
    </svg>
  );
}
