"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { submitContact } from "@/app/actions/contact";
import { buttonVariants } from "@/components/ui/button";
import type { Messages } from "@/i18n/messages";
import { contactSchema, industryOptions, serviceOptions, type ContactResult, type ContactValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

type FormMessages = Messages["common"]["form"];
type FormInput = Omit<ContactValues, "industry" | "privacy"> & { industry: ContactValues["industry"] | ""; privacy: boolean };

const fieldClass =
  "mt-1.5 block w-full rounded-xl border border-navy/25 bg-white px-4 py-3 text-base text-ink placeholder:text-body/60 focus:border-violet focus:outline-none focus:ring-3 focus:ring-violet/25 aria-[invalid=true]:border-red-600";

export function ContactForm({ t, locale, privacyHref, fallbackEmail }: { t: FormMessages; locale: string; privacyHref: string; fallbackEmail: string | null }) {
  const uid = useId();
  const [startedAt, setStartedAt] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<ContactResult | null>(null);
  const [website, setWebsite] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only timestamp for the anti-spam timing check
    setStartedAt(Date.now());
  }, []);
  // Move focus to the status message (success or failure) once a result arrives.
  useEffect(() => {
    if (result) statusRef.current?.focus();
  }, [result]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<FormInput, unknown, ContactValues>,
    defaultValues: { name: "", company: "", email: "", phone: "", industry: "", services: [], message: "", privacy: false },
    mode: "onTouched",
  });

  const errorText = (key?: string) => (key ? (t.errors as Record<string, string>)[key] ?? t.errors.summary : undefined);

  const onSubmit = handleSubmit(async (values) => {
    setResult(null);
    let res: ContactResult;
    try {
      res = await submitContact(values, { locale, website, startedAt });
    } catch {
      res = { ok: false, error: "sendFailed" };
    }
    if (!res.ok && res.fieldErrors) {
      for (const [name, message] of Object.entries(res.fieldErrors)) setError(name as keyof FormInput, { message });
    }
    setResult(res);
  });

  if (result?.ok) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-turquoise/50 bg-turquoise/10 p-8 text-center outline-none">
        <CircleCheck className="mx-auto size-12 text-teal-ink" aria-hidden="true" />
        <h3 className="mt-4 text-2xl">{t.successTitle}</h3>
        <p className="mt-2">{t.successText}</p>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          onClick={() => {
            reset();
            setResult(null);
            setStartedAt(Date.now());
          }}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const id = (name: string) => `${uid}-${name}`;
  const err = (name: keyof FormInput) => {
    const message = errorText(errors[name]?.message as string | undefined);
    return message ? (
      <p id={id(`${name}-error`)} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
    ) : null;
  };
  const aria = (name: keyof FormInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
  });
  const label = "block text-sm font-semibold text-ink";
  const failure = result && !result.ok ? (result.error === "invalid" ? t.errors.summary : t.errors[result.error]) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={id("hint")}>
      <p id={id("hint")} className="text-sm">{t.requiredHint}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={label}>{t.name} *</label>
          <input id={id("name")} type="text" autoComplete="name" required className={fieldClass} {...aria("name")} {...register("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("company")} className={label}>{t.company} *</label>
          <input id={id("company")} type="text" autoComplete="organization" required className={fieldClass} {...aria("company")} {...register("company")} />
          {err("company")}
        </div>
        <div>
          <label htmlFor={id("email")} className={label}>{t.email} *</label>
          {/* E-mail and phone are always typed left-to-right, also on RTL pages. */}
          <input id={id("email")} type="email" inputMode="email" autoComplete="email" spellCheck={false} dir="ltr" required className={cn(fieldClass, "text-start")} {...aria("email")} {...register("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={id("phone")} className={label}>{t.phoneOptional}</label>
          <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className={cn(fieldClass, "text-start")} {...aria("phone")} {...register("phone")} />
          {err("phone")}
        </div>
      </div>

      <div>
        <label htmlFor={id("industry")} className={label}>{t.industry} *</label>
        <select id={id("industry")} required className={fieldClass} {...aria("industry")} {...register("industry")}>
          <option value="">{t.industryPlaceholder}</option>
          {industryOptions.map((o) => (
            <option key={o} value={o}>{t.industries[o]}</option>
          ))}
        </select>
        {err("industry")}
      </div>

      <fieldset {...aria("services")}>
        <legend className={label}>{t.services} *</legend>
        <p className="mt-1 text-sm">{t.servicesHint}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {serviceOptions.map((o) => (
            <label key={o} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-medium text-ink has-checked:border-teal-ink has-checked:bg-turquoise/10">
              <input type="checkbox" value={o} className="size-4.5 shrink-0 accent-[#00705f]" {...register("services")} />
              {t.serviceOptions[o]}
            </label>
          ))}
        </div>
        {err("services")}
      </fieldset>

      <div>
        <label htmlFor={id("message")} className={label}>{t.message} *</label>
        <textarea id={id("message")} rows={5} required placeholder={t.messagePlaceholder} className={fieldClass} {...aria("message")} {...register("message")} />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
      <div className="absolute -start-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id("website")}>{t.honeypot}</label>
        <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" required className="mt-1 size-4.5 shrink-0 accent-[#00705f]" {...aria("privacy")} {...register("privacy")} />
          <span>{t.privacy} *</span>
        </label>
        <p className="ms-7.5 mt-1 text-sm">
          <Link href={privacyHref} target="_blank" className="font-medium text-teal-ink underline underline-offset-4">{t.privacyLinkText}</Link>
        </p>
        {err("privacy")}
      </div>

      <div ref={statusRef} tabIndex={-1} role="alert" aria-live="assertive" className="outline-none">
        {failure ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              {failure}
              {fallbackEmail && result && !result.ok && result.error !== "invalid" ? (
                <>
                  {" "}
                  <a href={`mailto:${fallbackEmail}`} dir="ltr" className="ltr-isolate underline">{fallbackEmail}</a>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      <button type="submit" disabled={isSubmitting} className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
        {isSubmitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
