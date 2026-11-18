import type { ServiceId } from "@/lib/routes";

/**
 * Service catalog — the single list of what the agency sells. The website uses it for grouping
 * and booking options; the future agency platform / CRM is meant to import the same file so that
 * website, quotes and project tracking never drift apart (see docs/AGENCY_PLATFORM.md).
 *
 * Texts live in messages/<locale>/services.json. Prices live here and stay `null`
 * ("Preis auf Anfrage") until the owner approves them.
 */
export type ServiceGroupId = "core" | "local";
export type Billing = "once" | "recurring" | "optional";

export type ServiceOption = {
  /** Stable id used by quotes and the CRM. */
  id: string;
  billing: Billing;
  /** Net price in EUR, or null → "Preis auf Anfrage". */
  price: number | null;
};

export type CatalogEntry = {
  id: ServiceId;
  group: ServiceGroupId;
  /** Can be booked without a monthly package. */
  standalone: boolean;
  /** Can be combined with monthly social media management. */
  combinable: boolean;
  /** Needs an on-site visit (travel distance must be checked per client). */
  onSiteVisit: "always" | "optional" | "never";
  /** Work happens in a third-party account the client must authorize first. */
  requiresClientAuthorization: boolean;
  /** Booking options, in the same order as services.showcase.<id>.options in the messages. */
  options: ServiceOption[];
};

export const serviceCatalog: CatalogEntry[] = [
  { id: "social-media-management", group: "core", standalone: true, combinable: true, onSiteVisit: "optional", requiresClientAuthorization: true, options: [] },
  { id: "content-creation", group: "core", standalone: true, combinable: true, onSiteVisit: "optional", requiresClientAuthorization: false, options: [] },
  { id: "reels-video-production", group: "core", standalone: true, combinable: true, onSiteVisit: "always", requiresClientAuthorization: false, options: [] },
  { id: "social-media-strategy", group: "core", standalone: true, combinable: true, onSiteVisit: "never", requiresClientAuthorization: false, options: [] },
  { id: "community-management", group: "core", standalone: true, combinable: true, onSiteVisit: "never", requiresClientAuthorization: true, options: [] },
  {
    id: "menu-design",
    group: "local",
    standalone: true,
    combinable: true,
    onSiteVisit: "optional",
    requiresClientAuthorization: false,
    options: [
      { id: "menu-new-design", billing: "once", price: null },
      { id: "menu-redesign", billing: "once", price: null },
      { id: "menu-seasonal-updates", billing: "recurring", price: null },
      { id: "menu-print-preparation", billing: "optional", price: null },
    ],
  },
  {
    id: "google-business-profile",
    group: "local",
    standalone: true,
    combinable: true,
    onSiteVisit: "always",
    requiresClientAuthorization: true,
    options: [
      { id: "gbp-photo-refresh", billing: "once", price: null },
      { id: "gbp-on-site-photography", billing: "once", price: null },
      { id: "gbp-photo-profile-maintenance", billing: "recurring", price: null },
    ],
  },
];

export const serviceGroups: Record<ServiceGroupId, ServiceId[]> = {
  core: serviceCatalog.filter((s) => s.group === "core").map((s) => s.id),
  local: serviceCatalog.filter((s) => s.group === "local").map((s) => s.id),
};

export const catalogEntry = (id: ServiceId) => serviceCatalog.find((s) => s.id === id)!;

/**
 * Status vocabularies for project tracking in the future platform. Not used by the website.
 */
export const workflowStatuses = {
  content: ["briefing", "assets-requested", "in-design", "internal-review", "client-review", "revision", "approved", "delivered"],
  approval: ["not-requested", "requested", "changes-requested", "approved"],
  delivery: ["not-started", "scheduled", "delivered", "published", "archived"],
} as const;
