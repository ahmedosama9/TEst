/**
 * Consent state for optional categories. Nothing optional is loaded by default.
 * To add analytics later, wrap the script in <ConsentGate category="analytics"> —
 * it renders its children only after an explicit opt-in.
 */
export const CONSENT_KEY = "smk_consent";
export const CONSENT_EVENT = "smk:consent";
export type ConsentCategory = "analytics" | "marketing";
export type ConsentState = Record<ConsentCategory, boolean>;
export const defaultConsent: ConsentState = { analytics: false, marketing: false };

export function readConsent(): ConsentState {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return defaultConsent;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return { analytics: parsed.analytics === true, marketing: parsed.marketing === true };
  } catch {
    return defaultConsent;
  }
}

export function writeConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: consent simply stays at "nothing optional" */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}
