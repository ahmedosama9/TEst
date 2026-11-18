"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { LOCALE_COOKIE } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type LanguageOption = { locale: string; hreflang: string; nativeName: string; href: string; dir: "ltr" | "rtl" };

/** Remember an explicit choice (functional cookie, 1 year). Only the root URL "/" reads it. */
function rememberLocale(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageSwitcher({
  options,
  current,
  label,
  variant = "dropdown",
}: {
  options: LanguageOption[];
  current: string;
  label: string;
  variant?: "dropdown" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = options.find((o) => o.locale === current);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = options.map((o) => (
    <li key={o.locale}>
      {/* Plain anchors: a full navigation re-applies <html lang/dir> and fonts reliably. */}
      <a
        href={o.href}
        hrefLang={o.hreflang}
        lang={o.hreflang}
        dir={o.dir}
        aria-current={o.locale === current ? "true" : undefined}
        onClick={() => rememberLocale(o.locale)}
        className={cn(
          "flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium",
          variant === "dropdown" ? "text-ink hover:bg-mist" : "border border-white/15 text-white hover:border-aqua",
          o.locale === current && (variant === "dropdown" ? "bg-mist" : "border-aqua text-aqua"),
        )}
      >
        <span>{o.nativeName}</span>
        {o.locale === current ? <Check className="size-4" aria-hidden="true" /> : null}
      </a>
    </li>
  ));

  if (variant === "inline") {
    return (
      <nav aria-label={label}>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-soft">
          <Globe className="size-4" aria-hidden="true" /> {label}
        </p>
        <ul className="grid grid-cols-2 gap-2">{links}</ul>
      </nav>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${active?.nativeName ?? ""}`}
        onClick={() => setOpen((v) => !v)}
        className="on-dark flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-3 text-sm font-medium text-white hover:border-aqua"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span lang={active?.hreflang}>{active?.nativeName}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className="absolute end-0 z-50 mt-2 w-48 rounded-xl border border-line bg-white p-1.5 shadow-card"
      >
        {links}
      </ul>
    </div>
  );
}
