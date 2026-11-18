import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "white" | "mist" | "navy";
const tones: Record<Tone, string> = {
  white: "bg-white",
  mist: "bg-mist",
  navy: "on-dark hero-backdrop text-soft",
};

export function Section({ tone = "white", className, children, id, labelledBy }: { tone?: Tone; className?: string; children: ReactNode; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 sm:py-24", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={cn("mb-3 font-display text-sm font-bold tracking-[0.14em] uppercase", dark ? "text-aqua" : "text-teal-ink")}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  center,
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  center?: boolean;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10 max-w-3xl sm:mb-14", center && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow dark={dark}>{eyebrow}</Eyebrow> : null}
      <Tag id={id} className={cn(Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", dark && "text-white")}>
        {title}
      </Tag>
      {intro ? <p className={cn("mt-4 text-lg", dark ? "text-soft" : "text-body")}>{intro}</p> : null}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7", className)}>{children}</div>;
}
