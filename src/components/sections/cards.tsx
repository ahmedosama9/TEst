import {
  BookOpenText,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  Clapperboard,
  Compass,
  Dumbbell,
  Images,
  type LucideIcon,
  MapPinned,
  MessagesSquare,
  Minus,
  PenLine,
  Play,
  Scissors,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { ArrowLink } from "@/components/sections/shared";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { commercialTerms, packages, type PackageConfig } from "@/config/packages";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { href, industryIds, serviceIds, type IndustryId, type ServiceId } from "@/lib/routes";
import { cn, fmt } from "@/lib/utils";

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  "social-media-management": CalendarCheck,
  "content-creation": Camera,
  "reels-video-production": Clapperboard,
  "social-media-strategy": Compass,
  "community-management": MessagesSquare,
  "menu-design": BookOpenText,
  "google-business-profile": MapPinned,
};

export const industryIcons: Record<IndustryId, LucideIcon> = {
  gastronomy: UtensilsCrossed,
  "beauty-salons": Scissors,
  "fitness-studios": Dumbbell,
  "local-businesses": Store,
};

export function IconBadge({ icon: Icon, dark }: { icon: LucideIcon; dark?: boolean }) {
  return (
    <span className={cn("mb-5 grid size-12 place-items-center rounded-xl", dark ? "bg-white/10 text-aqua" : "bg-navy text-aqua")}>
      <Icon className="size-6" aria-hidden="true" />
    </span>
  );
}

export function ServiceCards({
  locale,
  messages,
  exclude,
  ids: only,
  extra,
}: {
  locale: Locale;
  messages: Messages;
  exclude?: ServiceId;
  /** Restrict to these services (default: all). */
  ids?: readonly ServiceId[];
  /** Optional extra card appended to the grid (e.g. a group teaser on the home page). */
  extra?: React.ReactNode;
}) {
  const ids = (only ?? serviceIds).filter((id) => id !== exclude);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id) => {
        const s = messages.services.items[id];
        return (
          <li key={id}>
            <Reveal className="h-full">
              <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-turquoise sm:p-7">
                <IconBadge icon={serviceIcons[id]} />
                <h3 className="text-xl">
                  <Link href={href(`service:${id}`, locale)} className="after:absolute after:inset-0 after:rounded-2xl">
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-3 flex-1">{s.short}</p>
                <span className="mt-5 font-display text-sm font-bold text-teal-ink" aria-hidden="true">
                  {messages.common.cta.learnMore} <span className="rtl-flip inline-block">→</span>
                </span>
              </article>
            </Reveal>
          </li>
        );
      })}
      {extra ? <li>{extra}</li> : null}
    </ul>
  );
}

export function IndustryCards({ locale, messages, exclude }: { locale: Locale; messages: Messages; exclude?: IndustryId }) {
  const ids = industryIds.filter((id) => id !== exclude);
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", ids.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {ids.map((id, i) => {
        const s = messages.industries.items[id];
        return (
          <li key={id}>
            <Reveal delay={i * 0.05} className="h-full">
              <article className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-aqua">
                <IconBadge icon={industryIcons[id]} dark />
                <h3 className="text-xl text-white">
                  <Link href={href(`industry:${id}`, locale)} className="after:absolute after:inset-0 after:rounded-2xl">
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-soft">{s.short}</p>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export function ProcessSteps({ messages, detailed }: { messages: Messages; detailed?: boolean }) {
  const p = messages.pages.process;
  return (
    <ol className={cn("grid gap-5", detailed ? "lg:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-5")}>
      {p.steps.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={detailed ? 0 : i * 0.05} className="h-full">
            <div className={cn("h-full rounded-2xl border border-line bg-white p-6 shadow-card", detailed && "grid gap-4 sm:grid-cols-[auto_1fr_1fr] sm:items-start sm:gap-8 sm:p-8")}>
              <span className="bg-brand-gradient mb-4 grid size-11 place-items-center rounded-full font-display text-lg font-extrabold text-navy" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg">
                  <span className="sr-only">{fmt(p.stepLabel, { n: i + 1 })}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.95rem]">{step.text}</p>
              </div>
              {detailed ? (
                <ul className="space-y-2 text-[0.95rem]">
                  {step.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0 text-teal-ink" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

const formatIcons: LucideIcon[] = [Play, Images, Play, Camera, PenLine, Play];
const tileGradients = [
  "from-turquoise/90 to-navy-700",
  "from-violet/80 to-navy-700",
  "from-aqua/80 to-violet/70",
  "from-navy-600 to-turquoise/70",
  "from-violet/70 to-turquoise/70",
  "from-turquoise/70 to-violet/80",
];

/** Demonstration tiles — clearly labelled as examples, never presented as client work. */
export function PortfolioGrid({ messages, limit, detailed }: { messages: Messages; limit?: number; detailed?: boolean }) {
  const p = messages.pages.portfolio;
  const items = p.items.slice(0, limit ?? p.items.length);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = formatIcons[i % formatIcons.length];
        return (
          <li key={item.title}>
            <Reveal delay={i * 0.04} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <div className={cn("relative grid aspect-[4/3] place-items-center bg-gradient-to-br", tileGradients[i % tileGradients.length])} aria-hidden="true">
                  <span className="grid size-16 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur">
                    <Icon className="size-7" />
                  </span>
                  <span className="absolute start-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white">{item.format}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-violet/10 px-2.5 py-1 text-violet-ink">{messages.common.labels.example}</span>
                    <span className="text-body">{item.industry}</span>
                  </p>
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-2 text-[0.95rem]">{item.description}</p>
                  {detailed ? (
                    <p className="mt-4 border-t border-line pt-4 text-sm">
                      <span className="font-semibold text-ink">{p.goalLabel}:</span> {item.goal}
                    </p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export function formatPrice(pkg: PackageConfig, locale: Locale, messages: Messages): string {
  if (pkg.price === null) return messages.common.labels.priceOnRequest;
  const amount = new Intl.NumberFormat(localeConfig[locale].intlLocale, {
    style: "currency",
    currency: commercialTerms.currency,
    maximumFractionDigits: 0,
  }).format(pkg.price);
  return `${amount} ${messages.common.labels.perMonth}`;
}

export function PackageCards({ locale, messages, headingLevel: H = "h3" }: { locale: Locale; messages: Messages; headingLevel?: "h2" | "h3" }) {
  const p = messages.pages.packages;
  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {packages.map((pkg, i) => {
        const t = p.items[pkg.id];
        return (
          <li key={pkg.id}>
            <Reveal delay={i * 0.06} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col rounded-3xl border p-7 sm:p-8",
                  pkg.highlighted ? "on-dark hero-backdrop border-turquoise/50 text-soft shadow-glow" : "border-line bg-white shadow-card",
                )}
              >
                <H className={cn("text-2xl", pkg.highlighted && "text-white")}>{t.name}</H>
                <p className={cn("mt-1 font-display text-sm font-bold", pkg.highlighted ? "text-aqua" : "text-teal-ink")}>{t.tagline}</p>
                <p className={cn("mt-5 font-display text-2xl font-extrabold", pkg.highlighted ? "text-white" : "text-ink")}>{formatPrice(pkg, locale, messages)}</p>
                <p className="mt-3 text-[0.95rem]">{t.audience}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-[0.95rem]">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className={cn("mt-1 size-4 shrink-0", pkg.highlighted ? "text-aqua" : "text-teal-ink")} strokeWidth={3} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={href("contact", locale)} variant={pkg.highlighted ? "primary" : "dark"} className="mt-8 w-full">
                  {messages.common.cta.requestQuote}
                  <span className="sr-only">: {t.name}</span>
                </ButtonLink>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export function PackageCompareTable({ locale, messages }: { locale: Locale; messages: Messages }) {
  const p = messages.pages.packages;
  const l = messages.common.labels;
  const num = (v: number | null) => (v === null ? l.onRequest : String(v));
  const bool = (v: boolean) =>
    v ? (
      <span className="inline-flex items-center gap-1.5 text-teal-ink"><Check className="size-4" strokeWidth={3} aria-hidden="true" />{l.included}</span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-body"><Minus className="size-4" aria-hidden="true" />{l.notIncluded}</span>
    );
  const rows: [string, (pkg: PackageConfig) => React.ReactNode][] = [
    [p.rows.price, (pkg) => <strong className="text-ink">{formatPrice(pkg, locale, messages)}</strong>],
    [p.rows.channels, (pkg) => num(pkg.channels)],
    [p.rows.posts, (pkg) => num(pkg.postsPerMonth)],
    [p.rows.reels, (pkg) => num(pkg.reelsPerMonth)],
    [p.rows.shoots, (pkg) => num(pkg.onSiteShootsPerMonth)],
    [p.rows.community, (pkg) => bool(pkg.communityManagement)],
    [p.rows.strategy, (pkg) => bool(pkg.strategyWorkshop)],
    [p.rows.report, (pkg) => bool(pkg.monthlyReport)],
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card" tabIndex={0} role="region" aria-label={p.compareCaption}>
      <table className="w-full min-w-[40rem] border-collapse text-start text-[0.95rem]">
        <caption className="sr-only">{p.compareCaption}</caption>
        <thead>
          <tr className="bg-navy text-white">
            <th scope="col" className="px-5 py-4 text-start font-display font-bold">{p.compareFeature}</th>
            {packages.map((pkg) => (
              <th key={pkg.id} scope="col" className="px-5 py-4 text-start font-display font-bold">{p.items[pkg.id].name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, render]) => (
            <tr key={label} className="border-t border-line">
              <th scope="row" className="px-5 py-3.5 text-start font-semibold text-ink">{label}</th>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-5 py-3.5">{render(pkg)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RelatedLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  if (!links.length) return null;
  return (
    <aside className="rounded-2xl border border-line bg-mist p-6">
      <h2 className="mb-2 flex items-center gap-2 text-lg"><Building2 className="size-5 text-teal-ink" aria-hidden="true" />{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}><ArrowLink href={l.href}>{l.label}</ArrowLink></li>
        ))}
      </ul>
    </aside>
  );
}
