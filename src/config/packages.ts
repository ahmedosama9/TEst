/**
 * Commercial configuration for the three packages. Texts live in messages/<locale>/pages.json
 * (packages.*); numbers and switches live here so they can change without touching copy.
 *
 * Until prices are approved, `price: null` renders "Preis auf Anfrage".
 */
export type PackageId = "starter" | "business" | "komplett";

export type PackageConfig = {
  id: PackageId;
  /** Monthly net price in EUR, or null → "Preis auf Anfrage". */
  price: number | null;
  /** Visually emphasised column (design emphasis only — not a popularity claim). */
  highlighted: boolean;
  /** Deliverables per month; null → shown as "nach Absprache". */
  postsPerMonth: number | null;
  reelsPerMonth: number | null;
  onSiteShootsPerMonth: number | null;
  channels: number | null;
  communityManagement: boolean;
  strategyWorkshop: boolean;
  monthlyReport: boolean;
};

export const packages: PackageConfig[] = [
  { id: "starter", price: null, highlighted: false, postsPerMonth: null, reelsPerMonth: null, onSiteShootsPerMonth: null, channels: null, communityManagement: false, strategyWorkshop: false, monthlyReport: true },
  { id: "business", price: null, highlighted: true, postsPerMonth: null, reelsPerMonth: null, onSiteShootsPerMonth: null, channels: null, communityManagement: true, strategyWorkshop: true, monthlyReport: true },
  { id: "komplett", price: null, highlighted: false, postsPerMonth: null, reelsPerMonth: null, onSiteShootsPerMonth: null, channels: null, communityManagement: true, strategyWorkshop: true, monthlyReport: true },
];

export const commercialTerms = {
  currency: "EUR",
  /** Minimum contract term in months; null → "nach Vereinbarung". */
  minimumTermMonths: null as number | null,
  /** Travel: radius in km around the base city included in on-site shoots; null → "nach Absprache". */
  travelIncludedKm: null as number | null,
  /** Add-on ids; labels are in messages (packages.addons.items). */
  addons: ["extraReels", "extraShoot", "adsManagement", "photoShoot"] as const,
};
