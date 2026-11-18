"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

export type MobileLink = { href: string; label: string; current?: boolean; children?: { href: string; label: string }[] };

/** Mobile navigation in a native <dialog>: focus trap, Esc and scroll lock come from the platform. */
export function MobileMenu({
  links,
  labels,
  cta,
  languageSlot,
}: {
  links: MobileLink[];
  labels: { open: string; close: string; nav: string };
  cta: { href: string; label: string };
  languageSlot: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label={labels.open}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
        className="on-dark grid size-11 place-items-center rounded-full border border-white/20 text-white lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <dialog
        ref={ref}
        aria-label={labels.nav}
        onClick={(e) => e.target === ref.current && close()}
        className="on-dark m-0 ms-auto h-dvh max-h-none w-full max-w-sm overflow-y-auto bg-navy p-0 text-white backdrop:bg-navy/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center justify-end p-4">
          <button type="button" aria-label={labels.close} onClick={close} className="grid size-11 place-items-center rounded-full border border-white/20">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label={labels.nav} className="flex-1 px-6 pb-6">
          <ul className="divide-y divide-white/10">
            {links.map((l) => (
              <li key={l.href} className="py-1">
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={l.current ? "page" : undefined}
                  className="flex min-h-12 items-center font-display text-lg font-bold aria-[current=page]:text-aqua"
                >
                  {l.label}
                </Link>
                {l.children ? (
                  <ul className="mb-3 space-y-1 border-s border-white/15 ps-4">
                    {l.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={close} className="flex min-h-10 items-center text-sm text-soft hover:text-white">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link
            href={cta.href}
            onClick={close}
            className="bg-brand-gradient mt-6 flex min-h-13 items-center justify-center rounded-full px-6 font-display font-bold text-navy"
          >
            {cta.label}
          </Link>
          <div className="mt-8">{languageSlot}</div>
        </nav>
      </dialog>
    </>
  );
}
