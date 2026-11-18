import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import de from "../messages/de/common.json";

const valid = { name: "Erika Beispiel", company: "Café Beispiel", email: "erika@example.com", phone: "", industry: "gastronomy", services: ["reels"], message: "Wir möchten regelmäßig Reels veröffentlichen.", privacy: true };

describe("contact form validation", () => {
  it("accepts a valid enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid input with localizable error keys", () => {
    const res = contactSchema.safeParse({ ...valid, name: "", email: "nope", industry: "", services: [], message: "kurz", privacy: false, phone: "abc" });
    expect(res.success).toBe(false);
    const keys = res.error!.issues.map((i) => i.message);
    expect(keys).toEqual(expect.arrayContaining(["nameRequired", "emailInvalid", "industryRequired", "servicesRequired", "messageRequired", "privacyRequired", "phoneInvalid"]));
    for (const k of keys) expect(de.form.errors, k).toHaveProperty(k);
  });
});

describe("rate limiter", () => {
  it("allows the limit and blocks afterwards within the window", () => {
    resetRateLimit();
    for (let i = 0; i < 5; i++) expect(rateLimit("ip", 5, 1000, 100 + i)).toBe(true);
    expect(rateLimit("ip", 5, 1000, 200)).toBe(false);
    expect(rateLimit("ip", 5, 1000, 2000)).toBe(true);
  });
});
