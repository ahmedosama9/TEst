import { describe, expect, it } from "vitest";
import { serviceCatalog, serviceGroups } from "@/config/service-catalog";
import { locales } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { serviceOptions } from "@/lib/contact-schema";
import { serviceIds } from "@/lib/routes";

describe("service catalog", () => {
  it("covers every service exactly once and groups them", () => {
    expect(serviceCatalog.map((s) => s.id).sort()).toEqual([...serviceIds].sort());
    expect(serviceGroups.local).toEqual(["menu-design", "google-business-profile"]);
    expect(serviceGroups.core).toHaveLength(5);
  });

  it("keeps prices unpublished until approved", () => {
    for (const s of serviceCatalog) for (const o of s.options) expect(o.price).toBeNull();
  });

  it("has texts for every service, option and form choice in every language", async () => {
    for (const locale of locales) {
      const m = await loadMessages(locale);
      for (const id of serviceIds) expect(m.services.items[id].name, `${locale} ${id}`).toBeTruthy();
      for (const id of serviceGroups.local) {
        const entry = serviceCatalog.find((s) => s.id === id)!;
        const showcase = m.services.showcase[id as keyof typeof m.services.showcase];
        expect(showcase.options, `${locale} ${id}`).toHaveLength(entry.options.length);
        expect(showcase.mock.lines).toHaveLength(6);
      }
      for (const o of serviceOptions) expect(m.common.form.serviceOptions[o], `${locale} ${o}`).toBeTruthy();
    }
  });
});
