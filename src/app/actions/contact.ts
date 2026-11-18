"use server";

import { headers } from "next/headers";
import { isLocale, localeConfig } from "@/i18n/config";
import { contactSchema, type ContactResult, type ContactValues } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

type Extra = { locale: string; website: string; startedAt: number };

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Contact enquiry: validate → spam checks → rate limit → send via Resend (REST API, no SDK).
 * Never returns ok:true unless the provider accepted the message.
 */
export async function submitContact(values: ContactValues, extra: Extra): Promise<ContactResult> {
  // 1. Spam: hidden honeypot field must stay empty; humans need more than 3 seconds.
  if (extra.website !== "" || !Number.isFinite(extra.startedAt) || Date.now() - extra.startedAt < 3000) {
    return { ok: false, error: "spam" };
  }

  // 2. Server-side validation (never trust the client).
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactValues;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "invalid", fieldErrors };
  }
  const data = parsed.data;

  // 3. Rate limit per client IP: 5 enquiries per 10 minutes.
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, error: "rateLimited" };

  // 4. Delivery. Credentials are server-only environment variables.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[contact] Email delivery is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL).");
    return { ok: false, error: "notConfigured" };
  }

  const language = isLocale(extra.locale) ? localeConfig[extra.locale].nativeName : extra.locale;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Unternehmen", data.company],
    ["E-Mail", data.email],
    ["Telefon", data.phone || "–"],
    ["Branche", data.industry],
    ["Leistungen", data.services.join(", ")],
    ["Sprache der Website", language],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nNachricht:\n${data.message}\n`;
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Neue Anfrage: ${data.company} (${data.name})`.replace(/[\r\n]+/g, " "),
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[contact] Provider rejected the message: ${res.status} ${await res.text().catch(() => "")}`);
      return { ok: false, error: "sendFailed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] Sending failed:", err);
    return { ok: false, error: "sendFailed" };
  }
}
