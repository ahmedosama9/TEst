"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { Messages } from "@/i18n/messages";
import { CONSENT_EVENT, defaultConsent, readConsent, writeConsent, type ConsentCategory, type ConsentState } from "@/lib/consent";
import { cn } from "@/lib/utils";

/** Optional services currently integrated per category. Empty = toggles are informational and disabled. */
const activeServices: Record<ConsentCategory, string[]> = { analytics: [], marketing: [] };

export function ConsentSettings({ t }: { t: Messages["legal"]["cookies"] }) {
  const [state, setState] = useState<ConsentState>(defaultConsent);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setState(readConsent());
  }, []);

  const save = (next: ConsentState) => {
    setState(next);
    writeConsent(next);
    setSaved(true);
  };

  const row = (category: ConsentCategory, title: string, text: string) => {
    const inUse = activeServices[category].length > 0;
    return (
      <section>
        <h2>{title}</h2>
        <p>{text}</p>
        <label className="mt-3 flex min-h-11 items-center gap-3 text-sm font-medium text-ink">
          <input
            type="checkbox"
            className="size-5 accent-[#00705f]"
            checked={inUse && state[category]}
            disabled={!inUse}
            onChange={(e) => {
              setSaved(false);
              setState({ ...state, [category]: e.target.checked });
            }}
          />
          {inUse ? t.allow : t.noneActive}
        </label>
      </section>
    );
  };

  return (
    <>
      {row("analytics", t.analyticsTitle, t.analyticsText)}
      {row("marketing", t.marketingTitle, t.marketingText)}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={buttonVariants({ variant: "dark" })} onClick={() => save(state)}>{t.save}</button>
        <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={() => save(defaultConsent)}>{t.rejectAll}</button>
        <p role="status" className="text-sm font-medium text-teal-ink">{saved ? t.saved : ""}</p>
      </div>
    </>
  );
}

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Renders children (e.g. an analytics <Script>) only after an explicit opt-in for the category. */
export function ConsentGate({ category, children }: { category: ConsentCategory; children: ReactNode }) {
  const allowed = useSyncExternalStore(subscribe, () => readConsent()[category], () => false);
  return allowed ? <>{children}</> : null;
}
