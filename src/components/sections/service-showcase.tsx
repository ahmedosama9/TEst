import { Camera, Check, Info, MapPin, QrCode, Star } from "lucide-react";
import { Card, Section, SectionHeading } from "@/components/ui/section";
import { catalogEntry, type Billing } from "@/config/service-catalog";
import { commercialTerms } from "@/config/packages";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export type ShowcaseId = keyof Messages["services"]["showcase"];
export const showcaseIds: ShowcaseId[] = ["menu-design", "google-business-profile"];
export const hasShowcase = (id: string): id is ShowcaseId => (showcaseIds as string[]).includes(id);

type Mock = Messages["services"]["showcase"][ShowcaseId]["mock"];

/* ---------- Original, CSS-only illustrations. They are schematic examples, not client work,
   not real photographs and not a reproduction of any third-party interface. ---------- */

function MenuMock({ mock, variant }: { mock: Mock; variant: "before" | "after" }) {
  const [s1, d1, s2, d2, s3, d3] = mock.lines;
  if (variant === "before") {
    return (
      <div className="aspect-[3/4] w-full rounded-lg bg-[#efe6d2] p-5 font-serif text-[#4a3b22] shadow-inner" dir="auto">
        <p className="text-center text-lg font-bold underline">{mock.name}</p>
        <p className="mb-3 text-center text-[0.65rem] tracking-widest uppercase">{mock.subtitle}</p>
        {[[s1, d1], [s2, d2], [s3, d3]].map(([section, dish], i) => (
          <div key={section} className={cn("mb-2 text-[0.7rem] leading-tight", i === 1 && "italic")}>
            <p className={cn("font-bold", i === 2 ? "text-[0.8rem] text-[#8a1c1c]" : "uppercase")}>{section}</p>
            {[0, 1, 2, 3].map((n) => (
              <p key={n} className="flex justify-between gap-1">
                <span className="truncate">{n === 0 ? dish : "· · · · · · · · · · · · · ·"}</span>
                <span className="shrink-0">–,–</span>
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="aspect-[3/4] w-full rounded-lg bg-navy p-6 text-white shadow-xl" dir="auto">
      <p className="font-display text-xl font-extrabold">{mock.name}</p>
      <p className="mb-5 font-display text-[0.65rem] font-bold tracking-[0.2em] text-aqua uppercase">{mock.subtitle}</p>
      {[[s1, d1], [s2, d2], [s3, d3]].map(([section, dish]) => (
        <div key={section} className="mb-4">
          <p className="mb-2 flex items-center gap-2 font-display text-xs font-bold text-aqua">
            {section}
            <span className="h-px flex-1 bg-white/20" />
          </p>
          {[0, 1].map((n) => (
            <div key={n} className="mb-1.5 flex items-baseline justify-between gap-3 text-[0.75rem]">
              <span className="min-w-0">
                <span className="block truncate font-semibold">{n === 0 ? dish : <span className="block h-2 w-24 rounded-full bg-white/25" />}</span>
                <span className="mt-1 block h-1.5 w-28 rounded-full bg-white/15" />
              </span>
              <span className="shrink-0 font-display font-bold text-soft">–,–</span>
            </div>
          ))}
        </div>
      ))}
      <p className="mt-auto flex items-center gap-2 border-t border-white/15 pt-3 text-[0.6rem] text-soft">
        <QrCode className="size-4 text-aqua" aria-hidden="true" />
        <span className="h-1.5 w-24 rounded-full bg-white/15" />
      </p>
    </div>
  );
}

const photoTones = ["from-turquoise to-navy-600", "from-violet to-navy-700", "from-aqua to-violet", "from-navy-600 to-turquoise", "from-violet to-turquoise", "from-turquoise to-aqua"];

function ProfileMock({ mock, variant }: { mock: Mock; variant: "before" | "after" }) {
  const after = variant === "after";
  const tiles = after ? mock.lines.slice(0, 5) : mock.lines.slice(0, 2);
  return (
    <div className="aspect-[3/4] w-full rounded-lg border border-line bg-white p-4 shadow-xl" dir="auto">
      <div
        className={cn("relative mb-3 grid h-[34%] place-items-center rounded-md bg-gradient-to-br text-white", after ? photoTones[0] : "from-slate-500 to-slate-700 opacity-70")}
      >
        <Camera className="size-7 opacity-80" aria-hidden="true" />
        <span className="absolute start-2 bottom-2 rounded bg-navy/70 px-1.5 py-0.5 text-[0.6rem] font-semibold">{mock.lines[5]}</span>
      </div>
      <p className="font-display text-base font-extrabold text-ink">{mock.name}</p>
      <p className="mb-2 flex items-center gap-1 text-[0.7rem] text-body">
        <MapPin className="size-3" aria-hidden="true" />
        {mock.subtitle}
        <span className="ms-auto flex gap-0.5 text-line" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3 fill-current" />)}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {tiles.map((label, i) => (
          <div key={label} className={cn("grid aspect-square place-items-end rounded bg-gradient-to-br p-1", after ? photoTones[(i + 1) % photoTones.length] : "from-slate-400 to-slate-600 opacity-60")}>
            <span className="w-full truncate rounded bg-navy/70 px-1 text-[0.5rem] font-semibold text-white">{label}</span>
          </div>
        ))}
        {!after ? <div className="grid aspect-square place-items-center rounded border border-dashed border-slate-300 text-[0.6rem] text-slate-400">?</div> : <div className="aspect-square rounded bg-mist" />}
      </div>
      <div className="mt-3 space-y-1.5">
        <span className={cn("block h-1.5 rounded-full", after ? "w-4/5 bg-teal-ink/40" : "w-2/5 bg-line")} />
        <span className={cn("block h-1.5 rounded-full", after ? "w-3/5 bg-teal-ink/40" : "w-1/4 bg-line")} />
      </div>
    </div>
  );
}

function formatOptionPrice(price: number | null, locale: Locale, messages: Messages) {
  if (price === null) return messages.common.labels.priceOnRequest;
  return new Intl.NumberFormat(localeConfig[locale].intlLocale, { style: "currency", currency: commercialTerms.currency, maximumFractionDigits: 0 }).format(price);
}

export function billingLabel(billing: Billing, messages: Messages) {
  const l = messages.services.showcaseLabels;
  return billing === "once" ? l.billingOnce : billing === "recurring" ? l.billingRecurring : l.billingOptional;
}

/** Booking options of a service with configurable prices ("Preis auf Anfrage" until set). */
export function ServiceOptions({ id, locale, messages, compact }: { id: ShowcaseId; locale: Locale; messages: Messages; compact?: boolean }) {
  const t = messages.services.showcase[id];
  const entry = catalogEntry(id);
  return (
    <ul className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {t.options.map((option, i) => {
        const cfg = entry.options[i];
        return (
          <li key={option.title}>
            <Card className="flex h-full flex-col p-5 sm:p-5">
              <p className="mb-2 text-xs font-semibold text-teal-ink">{cfg ? billingLabel(cfg.billing, messages) : null}</p>
              <h3 className="text-base">{option.title}</h3>
              <p className="mt-1.5 flex-1 text-sm">{option.text}</p>
              <p className="mt-4 font-display text-sm font-extrabold text-ink">{formatOptionPrice(cfg?.price ?? null, locale, messages)}</p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export function ServiceShowcase({ id, locale, messages }: { id: ShowcaseId; locale: Locale; messages: Messages }) {
  const t = messages.services.showcase[id];
  const l = messages.services.showcaseLabels;
  const Mock = id === "menu-design" ? MenuMock : ProfileMock;
  const example = messages.common.labels.example;
  return (
    <>
      <Section tone="navy" labelledBy="showcase-title">
        <SectionHeading id="showcase-title" dark title={t.title} intro={t.intro} />
        <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]">
          {(["before", "after"] as const).map((variant) => (
            <figure key={variant} className="mx-auto w-full max-w-xs">
              <div role="img" aria-label={`${example} – ${variant === "before" ? l.before : l.after}: ${variant === "before" ? t.beforeCaption : t.afterCaption}`}>
                <Mock mock={t.mock} variant={variant} />
              </div>
              <figcaption className="mt-4 text-sm">
                <span className="mb-1 flex flex-wrap items-center gap-2 font-display font-bold text-white">
                  {variant === "before" ? l.before : l.after}
                  <span className="rounded-full bg-violet/30 px-2.5 py-0.5 text-xs font-semibold text-white">{example}</span>
                </span>
                {variant === "before" ? t.beforeCaption : t.afterCaption}
              </figcaption>
            </figure>
          ))}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-xl text-white">{t.formatsTitle}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {t.formats.map((f) => (
                <li key={f.title} className="flex gap-3 rounded-xl bg-white/5 p-4">
                  <Check className="mt-1 size-4 shrink-0 text-aqua" strokeWidth={3} aria-hidden="true" />
                  <span><span className="block font-display font-bold text-white">{f.title}</span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section labelledBy="options-title">
        <SectionHeading id="options-title" title={l.options} intro={l.combine} />
        <ServiceOptions id={id} locale={locale} messages={messages} />
        <aside aria-labelledby="notes-title" className="mt-10 rounded-2xl border border-violet/30 bg-violet/5 p-6">
          <h2 id="notes-title" className="mb-3 flex items-center gap-2 text-lg"><Info className="size-5 text-violet-ink" aria-hidden="true" />{l.important}</h2>
          <ul className="list-disc space-y-2 ps-5">
            {t.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </aside>
      </Section>
    </>
  );
}
