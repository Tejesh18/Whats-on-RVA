# What's On RVA

A **Richmond, Virginia** web app for discovering **arts and culture events**: search, filters, browse tabs, and an **interactive map**. Listings link out to organizers and venues for tickets and up-to-date details.

## Overview

The app loads public event data from the **CultureWorks** calendar when available and shows it in a fast, mobile-friendly UI. If that feed is unavailable, **example Richmond-area events** are shown so the site still works.

## Features

- Search, area, category, and price filters; **Tonight** shortcut
- Tabs: **All** / **Featured** / **Hidden gems**
- **Map** (OpenStreetMap) with pins when coordinates exist; list and map stay in sync
- **Get tickets / details** on every card → official URL
- Collapsible **Where listings come from** on the site
- Short status when **example events** are shown instead of the live calendar

## Project layout

| Path | Role |
|------|------|
| `src/App.jsx` | Layout and UI state; calls `getEvents()` for listings |
| `src/services/eventService.js` | Loads events (CultureWorks + local fallback) |
| `src/services/sourceAdapters.js` | Fetches and maps CultureWorks JSON → app event shape |
| `src/lib/normalizedEvent.js` | Shared event field definitions (JSDoc) |
| `src/config/env.js` | `VITE_*` env vars (URLs, timezone, default image) |
| `src/data/mockEvents.js` | Example events when the live feed fails |
| `src/lib/eventFilters.js` | Search, filters, “tonight”, sort helpers |
| `src/components/EventMap.jsx` | Leaflet map and markers |

## Data sources

- **Primary:** [CultureWorks calendar API](https://calendar.richmondcultureworks.org/api/2/events) (override with `VITE_CULTUREWORKS_EVENTS_URL`).
- **Fallback:** Bundled example events in `mockEvents.js`.

## When the live feed fails

If the request errors or returns no events, the app loads example data and shows a small **example events** notice in the UI.

## Configure your product

Defaults work for demos (`contact@example.com`, etc.). For a real launch, set in **`.env.local`** (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `VITE_CONTACT_EMAIL` | Optional — overrides the sample contact email |
| `VITE_LEGAL_ENTITY` | Legal name on policies and copyright line |
| `VITE_PUBLIC_SITE_URL` | Your live URL (policies and meta) |

Update **`policiesLastUpdated`** in `src/config/siteConfig.js` when you edit Privacy or Terms.

Optional: have a lawyer review the policy text for your jurisdiction and data practices.

## Run locally

**Node.js 18+** and npm.

```bash
cd whats-on-rva
cp .env.example .env.local   # optional
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. Connect the repo in [Vercel](https://vercel.com).
2. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
3. Set any `VITE_*` variables from `.env.example` if you change endpoints.

## Git

```bash
cd whats-on-rva
git init
git add .
git commit -m "feat: What's On RVA"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## Accuracy

Times, prices, and accessibility may change on the organizer’s site. Always confirm on their page before you go.

## Product pages included

- **`#privacy`** — Privacy policy (template; customize + legal review as needed)
- **`#terms`** — Terms of use
- **`#contact`** — Contact section with mailto

Navigation: header and footer on the home page; legal pages include a minimal footer. Favicon: `public/favicon.svg`.
