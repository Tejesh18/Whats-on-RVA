# What's On RVA

A **Richmond, Virginia** web app for discovering **arts and culture events**: search, filters, browse tabs, and an **interactive map**. Listings link out to organizers and venues for tickets and up-to-date details.

## Overview

The app merges **CultureWorks** and (optionally) **Eventbrite** listings, scoped to **Richmond city limits**, in a modern discovery UI. If feeds return nothing, **example events** are shown.

## Features

- Search, area, category, and price filters; **Tonight** shortcut
- Tabs: **All** / **Featured** / **Hidden gems**
- **Map** (CARTO Voyager + OSM data) with pins, popups, Richmond bounds overlay, **Near me**, and list sync
- Optional **Sign in / Register** (browser-local demo accounts)
- **Get tickets / details** on every card → official URL
- Collapsible **Where listings come from** on the site
- Short status when **example events** are shown instead of the live calendar

## Project layout

| Path | Role |
|------|------|
| `src/App.jsx` | Layout and UI state; calls `getEvents()` for listings |
| `src/services/eventService.js` | Loads CultureWorks + Eventbrite, dedupes, fallback |
| `src/services/sourceAdapters.js` | CultureWorks + Eventbrite → normalized events |
| `src/lib/richmondBounds.js` | City box + text rules (drop Petersburg, etc.) |
| `src/lib/mergeEvents.js` | Dedupe merged feeds |
| `src/lib/normalizedEvent.js` | Shared event field definitions (JSDoc) |
| `src/config/env.js` | `VITE_*` env vars (URLs, timezone, default image) |
| `src/data/mockEvents.js` | Example events when the live feed fails |
| `src/lib/eventFilters.js` | Search, filters, “tonight”, sort helpers |
| `src/components/EventMap.jsx` | Leaflet map and markers |

## Data sources

- **CultureWorks:** [Richmond CultureWorks calendar API](https://calendar.richmondcultureworks.org/api/2/events) (override with `VITE_CULTUREWORKS_EVENTS_URL`).
- **Eventbrite (optional):** Search near Richmond is merged in when configured — see **Eventbrite** below.
- **Geography:** Listings are filtered to a **Richmond city bounding box** plus text checks so places like Petersburg drop out when coordinates or city names are present.
- **Fallback:** Example events in `mockEvents.js` if live feeds return nothing.

## Eventbrite API

Eventbrite blocks browser CORS. **Local dev:** add `EVENTBRITE_PRIVATE_TOKEN` to `.env.local` (no `VITE_` prefix). Vite proxies `/eventbrite-api` to `https://www.eventbriteapi.com/v3` and attaches `Authorization: Bearer …`. **Production:** set `VITE_EVENTBRITE_PROXY` to your own HTTPS endpoint that forwards to Eventbrite with the token server-side (e.g. Cloudflare Worker, Vercel serverless function).

## Accounts (sign in / register)

Optional auth stores **hashed passwords and session in this browser’s local storage only** — fine for demos. For a public product, replace with Supabase, Clerk, or your API and update the Privacy copy.

| Path | Role |
|------|------|
| `src/context/AuthContext.jsx` | Session + sign-in / register / sign-out |
| `src/lib/localAuth.js` | SHA-256 + `localStorage` users |
| `src/components/AuthModal.jsx` | Modal UI |

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
