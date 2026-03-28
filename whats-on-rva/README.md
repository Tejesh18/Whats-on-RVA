# What's On RVA

**Pillar:** A City That Tells Its Stories  

**Problem:** Arts and cultural event discovery in Richmond is fragmented across venue sites, CultureWorks, ticketing platforms, and newsletters. Residents and visitors miss what is already publicly posted.

## Solution overview

What’s On RVA is a **source-linked discovery layer**: a single responsive UI that **normalizes** listings from **existing public sources**, deep-links to **authoritative URLs**, and **degrades gracefully** when a live API is unreachable. It is structured so a **City office, arts council, or community platform** can adopt it with **limited engineering effort**—not as a throwaway demo, but as a **pilot-ready front end** that sits on top of publishers’ own systems.

## Features

- **Hack context banner** — Hack for RVA 2026, pillar, and problem statement.
- **Hero** — Product title, subtitle, and value line: *source-linked discovery for Richmond arts and culture*.
- **Why this matters** — Three concise impact cards.
- **Discovery** — Live search; neighborhood, category, and free/paid filters; **Tonight in RVA** (configurable timezone).
- **Featured**, **Hidden gems**, **All events** — Same UI for live or sample data.
- **Built from existing public sources** — CultureWorks, Eventbrite (strategy), partner RSS (strategy).
- **Ready to integrate** — Four pilot-oriented integration signals for partners and judges.
- **Pilot credibility footer** — Why this could ship without a new events platform.
- **Fallback badge** — *“Demo currently using sample data”* when live fetch fails or returns empty.
- **View source** on every card — Always points at a public listing URL.

## Architecture

| Layer | Responsibility |
|--------|----------------|
| **`src/App.jsx`** | Layout and client state only. Loads data via `getEvents()`; no fetch logic in components. |
| **`src/services/eventService.js`** | Orchestration: `getEvents()`, `fetchMockEvents()`, `fetchCultureWorksEvents()`, skeleton `fetchEventbriteEvents()` / `fetchRssEvents()`. |
| **`src/services/sourceAdapters.js`** | **Source-specific** fetch + **normalize** → shared schema (`NormalizedEvent`). Add new sources here. |
| **`src/lib/normalizedEvent.js`** | JSDoc schema — contract for all adapters. |
| **`src/config/env.js`** | `import.meta.env` (Vite) with safe defaults — URLs, image fallback, timezone. |
| **`src/config/publicSources.js`** | Canonical copy for the “public sources” section (single source of truth with README). |
| **`src/data/mockEvents.js`** | Eight realistic RVA events when APIs fail. |
| **`src/lib/eventFilters.js`** | Search, filters, “tonight” rule, dropdown derivation (pure functions over normalized events). |

## Why this is ready to integrate

This repo is structured as a **thin, replaceable discovery layer** a partner could adopt without rebuilding their publishing stack.

- **Modular service layer** — The UI calls a single entry point, `getEvents()` in `eventService.js`. Raw HTTP and vendor JSON stay in `sourceAdapters.js`. Adding Eventbrite or RSS means extending adapters and merging arrays—not rewriting cards or filters.

- **Normalized schema** — Every listing is mapped to **`NormalizedEvent`** (`lib/normalizedEvent.js`). Components and `eventFilters.js` only use that shape, so the interface stays stable when backends change.

- **Source-linked architecture** — There is no shadow database or duplicate CMS. Each card’s **View source** deep-links to the publisher’s canonical URL; this app aggregates and filters, it does not own the truth.

- **Low operational burden** — Partners keep entering events where they already do (CultureWorks, Eventbrite, RSS-capable sites). Operations scale with **existing** publisher workflows, not a new data-entry team.

- **Fallback safety for unreliable APIs** — If the primary API fails (CORS, outage, empty body), `getEvents()` **automatically** loads the mock adapter so demos and early pilots never show a broken grid. The UI shows a clear **“Demo currently using sample data”** badge whenever fallback is active.

## Data source strategy

1. **CultureWorks Localist API** — `https://calendar.richmondcultureworks.org/api/2/events` (primary; anonymous JSON). Override with `VITE_CULTUREWORKS_EVENTS_URL` if needed.
2. **Eventbrite** — **Org / venue** scoped APIs (avoid deprecated location search). Skeleton in `sourceAdapters.js`; wire tokens/IDs via env + optional proxy when a partner is ready.
3. **Partner RSS** — Venue or media feeds per RSS 2.0. Skeleton in `sourceAdapters.js`; configure feed URLs in env when ready.

## Integration readiness

- **Adapters** — Implement `fetchEventbriteNormalized` / `fetchRssNormalized`, then **merge** (and dedupe) inside `getEvents()` when requirements are clear.
- **Environment** — See `.env.example` for URL and timezone overrides; set the same keys in **Vercel Project → Settings → Environment Variables**.
- **Thin backend (optional)** — If browser CORS blocks a partner API, add a **small serverless proxy** and point `VITE_CULTUREWORKS_EVENTS_URL` (or a new `VITE_API_PROXY_BASE`) at it—**UI and adapters stay unchanged** beyond the fetch URL.

## Fallback behavior

1. `getEvents()` calls `fetchCultureWorksEvents()` (adapter + normalize).
2. On **failure** (network, CORS, bad HTTP) or **zero events**, the app uses **`fetchMockEvents()`** from `mockEvents.js`.
3. When mock data is active, the UI shows: **“Demo currently using sample data.”**

## How to run locally

**Requirements:** Node.js 18+ and npm.

```bash
cd whats-on-rva
cp .env.example .env.local   # optional: customize URLs / timezone
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push the `whats-on-rva` directory to GitHub.
2. **Import** the repo in [Vercel](https://vercel.com).
3. **Framework:** Vite. **Build:** `npm run build`. **Output:** `dist`.
4. Add environment variables from `.env.example` if you use non-default endpoints.

No `vercel.json` is required for this static SPA. Add one later only if you introduce client-side routes or rewrites.

## Future integration points

| Area | Suggested next step |
|------|---------------------|
| Eventbrite | Serverless function with private token; map org events → `NormalizedEvent`. |
| RSS | Fetch feeds in build or edge function; parse with a small RSS parser; same schema. |
| Deduping | Merge arrays in `getEvents()` using `sourceUrl` or fuzzy title + start time. |
| City branding | Replace copy and env defaults; optional `VITE_BRAND_NAME` if you add theme tokens. |
| Analytics | Add privacy-respecting outbound click tracking on “View source” only. |

## Git / GitHub

```bash
cd whats-on-rva
git init
git add .
git commit -m "feat: What's On RVA — pilot-ready discovery layer with source adapters"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

If this environment cannot authenticate to GitHub, run the commands above on your machine.

## MVP data note

Listings may be **live from CultureWorks** or **bundled sample data**. Always confirm time, price, accessibility, and tickets on the **View source** link before attending.
