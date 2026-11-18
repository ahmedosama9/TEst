import { CalendarDays, Heart, MessageCircle, Play, Send } from "lucide-react";
import type { Messages } from "@/i18n/messages";

/** Decorative hero illustration built with CSS only (no image request, no layout shift). */
export function PhoneMockup({ t }: { t: Messages["home"]["hero"]["mockup"] }) {
  return (
    <div role="img" aria-label={t.alt} className="relative mx-auto w-full max-w-md select-none" dir="ltr">
      <div className="absolute -inset-6 rounded-full bg-turquoise/20 blur-3xl" aria-hidden="true" />
      {/* phone */}
      <div className="animate-float relative mx-auto w-[15.5rem] rounded-[2.4rem] border border-white/15 bg-navy-800 p-2.5 shadow-2xl">
        <div className="overflow-hidden rounded-[1.9rem] bg-white">
          <div className="flex items-center gap-2 px-3.5 py-3">
            <span className="bg-brand-gradient size-7 rounded-full" />
            <span className="text-xs font-semibold text-ink">{t.profile}</span>
          </div>
          <div className="relative grid aspect-[4/5] place-items-center bg-gradient-to-br from-turquoise via-aqua to-violet">
            <span className="grid size-14 place-items-center rounded-full bg-white/25 ring-1 ring-white/60 backdrop-blur">
              <Play className="size-6 fill-white text-white" />
            </span>
            <span className="absolute start-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[0.65rem] font-semibold text-white">{t.reelLabel}</span>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3 text-ink">
            <Heart className="size-4.5" />
            <MessageCircle className="size-4.5" />
            <Send className="size-4.5" />
          </div>
          <div className="space-y-1.5 px-3.5 pb-4">
            <span className="block h-2 w-4/5 rounded-full bg-line" />
            <span className="block h-2 w-3/5 rounded-full bg-line" />
          </div>
        </div>
      </div>
      {/* editorial plan card */}
      <div className="absolute -start-2 bottom-8 w-44 rounded-2xl border border-white/15 bg-navy-700/95 p-4 text-white shadow-xl backdrop-blur sm:start-0">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold">
          <CalendarDays className="size-4 text-aqua" /> {t.planTitle}
        </p>
        <ul className="space-y-2 text-[0.7rem]">
          {t.planItems.map((item, i) => (
            <li key={item} className="flex items-center justify-between gap-2">
              <span>{item}</span>
              <span className={i === 0 ? "rounded-full bg-aqua/20 px-1.5 py-0.5 text-aqua" : "rounded-full bg-white/10 px-1.5 py-0.5 text-soft"}>
                {i === 0 ? t.statusApproved : t.statusPlanned}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute end-0 top-10 grid size-16 place-items-center rounded-2xl bg-violet text-white shadow-xl sm:end-2" aria-hidden="true">
        <Play className="size-7 fill-white" />
      </div>
    </div>
  );
}
