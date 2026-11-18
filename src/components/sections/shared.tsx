import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { Crumb } from "@/lib/seo";
import { href } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Dark hero used by all inner pages. */
export function PageHero({
  crumbs,
  breadcrumbLabel,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  breadcrumbLabel: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="on-dark hero-backdrop text-soft">
      <div className="container-page py-14 sm:py-20">
        <Breadcrumbs crumbs={crumbs} label={breadcrumbLabel} dark />
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow dark>{eyebrow}</Eyebrow> : null}
          <h1 className="text-4xl text-white sm:text-5xl">{title}</h1>
          {intro ? <p className="mt-5 text-lg sm:text-xl">{intro}</p> : null}
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line rounded-2xl border border-line bg-white", className)}>
      {items.map((item) => (
        <details key={item.q} className="group px-5 sm:px-6">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-base font-bold text-ink sm:text-lg [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown className="size-5 shrink-0 text-teal-ink transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="pb-5 text-body">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CheckList({ items, dark }: { items: readonly string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full", dark ? "bg-aqua/15 text-aqua" : "bg-turquoise/15 text-teal-ink")}>
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className={dark ? "text-soft" : undefined}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ArrowLink({ href: to, children, dark }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link href={to} className={cn("group inline-flex min-h-11 items-center gap-1.5 font-display text-sm font-bold", dark ? "text-aqua" : "text-teal-ink hover:text-ink")}>
      {children}
      <ArrowRight className="rtl-flip size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
    </Link>
  );
}

/** Closing call-to-action band used on inner pages. */
export function CtaBanner({ locale, messages }: { locale: Locale; messages: Messages }) {
  const c = messages.common;
  return (
    <section className="on-dark hero-backdrop">
      <div className="container-page py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl text-white sm:text-4xl">{c.banner.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-soft">{c.banner.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
          <ButtonLink href={href("packages", locale)} size="lg" variant="outlineDark">{c.cta.viewPackages}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
