"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ComponentType } from "react";
import type { ContactForm as ContactFormType } from "./contact-form";

type Props = ComponentProps<typeof ContactFormType> & { fallbackHref: string; fallbackLabel: string };

/**
 * The enquiry form at the bottom of the home page. Its code (React Hook Form + Zod) is only
 * downloaded when the visitor scrolls towards it, so it does not compete with the hero for
 * bandwidth and main-thread time. Until then (and without JavaScript) a link to the contact
 * page — which renders the full form on the server — is shown in its place.
 */
export function LazyContactForm({ fallbackHref, fallbackLabel, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [Form, setForm] = useState<ComponentType<ComponentProps<typeof ContactFormType>> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import("./contact-form").then((m) => setForm(() => m.ContactForm));
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (Form) return <Form {...props} />;
  return (
    <div ref={ref} className="grid min-h-[40rem] place-items-center">
      <Link href={fallbackHref} className="font-display font-bold text-teal-ink underline underline-offset-4">
        {fallbackLabel}
      </Link>
    </div>
  );
}
