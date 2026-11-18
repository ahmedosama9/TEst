import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle scroll-reveal for below-the-fold blocks, done in CSS only (scroll-driven animation,
 * see `.reveal` in globals.css). No JavaScript is shipped for it: browsers without
 * `animation-timeline` and visitors who prefer reduced motion simply see the content.
 */
export function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
