import { z } from "zod";

export const industryOptions = ["gastronomy", "beauty", "fitness", "retail", "crafts", "other"] as const;
export const serviceOptions = ["management", "content", "reels", "strategy", "community", "menuDesign", "googleProfile", "unsure"] as const;

/**
 * Shared by the client form and the server action. Error messages are message KEYS
 * (messages/<locale>/common.json → form.errors.*), so validation is localized in one place.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(120, "tooLong"),
  company: z.string().trim().min(2, "companyRequired").max(160, "tooLong"),
  email: z.string().trim().min(1, "emailRequired").max(200, "tooLong").email("emailInvalid"),
  phone: z
    .string()
    .trim()
    .max(40, "tooLong")
    .refine((v) => v === "" || /^[+()\d][\d\s()/.-]{5,}$/.test(v), "phoneInvalid"),
  industry: z.enum(industryOptions, { error: "industryRequired" }),
  services: z.array(z.enum(serviceOptions)).min(1, "servicesRequired"),
  message: z.string().trim().min(10, "messageRequired").max(4000, "messageTooLong"),
  privacy: z.literal(true, { error: "privacyRequired" }),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactErrorKey =
  | "nameRequired" | "companyRequired" | "emailRequired" | "emailInvalid" | "phoneInvalid" | "industryRequired"
  | "servicesRequired" | "messageRequired" | "messageTooLong" | "tooLong" | "privacyRequired";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "rateLimited" | "notConfigured" | "sendFailed" | "spam"; fieldErrors?: Partial<Record<keyof ContactValues, string>> };
