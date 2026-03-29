/**
 * Product identity — edit this file (or use Vite env) before a public launch.
 *
 * VITE_PUBLIC_SITE_URL   — full URL, e.g. https://whatsonrva.com
 * VITE_CONTACT_EMAIL     — optional; defaults to sample address below
 * VITE_LEGAL_ENTITY      — company or person legally operating the site
 */

const env = import.meta.env;

export const siteConfig = {
  /** Public name of the product */
  siteName: "What's On RVA",

  /**
   * Legal operator (LLC, individual, nonprofit, etc.).
   * Example: "RVA Cultural Guide LLC" or "Jane Doe"
   */
  legalEntity: env.VITE_LEGAL_ENTITY || "What's On RVA",

  /** Sample until you set VITE_CONTACT_EMAIL */
  contactEmail: env.VITE_CONTACT_EMAIL || 'contact@example.com',

  /** Canonical site URL (sharing, future canonical tags) */
  publicSiteUrl: (env.VITE_PUBLIC_SITE_URL || 'https://whatsonrva.com').replace(/\/$/, ''),

  /** Shown in policies / hero */
  regionLabel: 'Richmond, Virginia · RVA',

  /** Update when you change Privacy or Terms */
  policiesLastUpdated: 'March 28, 2026',
};
