import { CalendarDays, Camera, Heart, MessageCircle, Play } from "lucide-react";
import type { Messages } from "@/i18n/messages";

const bars = [28, 40, 34, 52, 64, 82];

/**
 * Decorative hero illustration in the brand style: tilted phone with a growth chart and
 * floating content tiles. CSS/SVG only (no image request, no layout shift). The tiles use
 * neutral icons on purpose — no third-party platform logos.
 */
export function PhoneMockup({ t }: { t: Messages["home"]["hero"]["mockup"] }) {
  return (
    <div role="img" aria-label={t.alt} className="relative mx-auto h-[26rem] w-full max-w-md select-none sm:h-[29rem]" dir="ltr">
      <div className="absolute inset-x-6 inset-y-10 rounded-full bg-turquoise/25 blur-3xl" aria-hidden="true" />
      {/* phone */}
      <div className="animate-float absolute start-1/2 top-4 w-[13.5rem] -translate-x-1/2 sm:w-[15rem]">
        <div className="rotate-[9deg] rounded-[2.4rem] border border-white/20 bg-navy-800 p-2.5 shadow-[0_40px_80px_-20px_rgb(0_212_179/0.45)]">
          <div className="overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-navy-700 to-navy">
            <div className="flex items-center gap-2 px-4 pt-4">
              <span className="bg-brand-gradient size-6 shrink-0 rounded-full" />
              <span className="text-[0.7rem] font-semibold text-white">{t.profile}</span>
              <span className="ms-auto rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-semibold text-aqua">{t.reelLabel}</span>
            </div>
            {/* growth chart */}
            <div className="relative mx-4 mt-6 h-52 sm:h-60">
              <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-2">
                {bars.map((h, i) => (
                  <span key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-turquoise/25 to-aqua" style={{ height: `${h}%`, opacity: 0.45 + i * 0.11 }} />
                ))}
              </div>
              <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" fill="none">
                <path d="M8 170C60 160 110 120 176 34" stroke="#33F6E0" strokeWidth="7" strokeLinecap="round" />
                <path d="m190 14-36 10 24 26Z" fill="#33F6E0" />
              </svg>
            </div>
            <div className="flex items-center gap-3 px-4 py-4 text-white/80">
              <Heart className="size-4" />
              <MessageCircle className="size-4" />
              <span className="ms-auto block h-1.5 w-16 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>
      {/* floating content tiles */}
      <span className="absolute start-[8%] top-[10%] grid size-14 -rotate-12 place-items-center rounded-2xl bg-gradient-to-br from-violet to-[#b06bff] text-white shadow-xl">
        <Camera className="size-7" />
      </span>
      <span className="absolute end-[6%] top-[6%] grid size-12 rotate-12 place-items-center rounded-2xl bg-navy-700 text-aqua shadow-xl ring-1 ring-white/15">
        <Heart className="size-6 fill-aqua" />
      </span>
      <span className="absolute end-[2%] top-[42%] grid size-14 rotate-6 place-items-center rounded-2xl bg-brand-gradient text-navy shadow-xl">
        <Play className="size-7 fill-navy" />
      </span>
      {/* editorial plan card */}
      <div className="absolute start-0 bottom-4 w-max max-w-[16rem] rounded-2xl border border-white/15 bg-navy-700/95 p-4 text-white shadow-xl backdrop-blur">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold">
          <CalendarDays className="size-4 text-aqua" /> {t.planTitle}
        </p>
        <ul className="space-y-2 text-[0.7rem]">
          {t.planItems.map((item, i) => (
            <li key={item} className="flex items-center justify-between gap-3 whitespace-nowrap">
              <span>{item}</span>
              <span className={i === 0 ? "rounded-full bg-aqua/20 px-1.5 py-0.5 text-aqua" : "rounded-full bg-white/10 px-1.5 py-0.5 text-soft"}>
                {i === 0 ? t.statusApproved : t.statusPlanned}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
