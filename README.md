What's On RVA
A Richmond, Virginia web app for discovering arts and culture events: search, filters, an interactive map, neighborhood stories, and planning tools. Listings use a Get tickets (or organizer) link for the canonical URL — always confirm details on that page before going out.

This repo sits under the Pillar / Pillar City storytelling umbrella and was shaped for Hack for RVA — Richmond’s civic-tech and community-build weekend — as a practical front door to what’s happening in the city.

Overview
Primary feed: CultureWorks calendar JSON (configurable URL).
Optional second feed: Partner ticket listings via a server-side proxy (see Optional ticket API) — browsers cannot call the provider API directly because of CORS.
Geography: Events are filtered to a Richmond city bounding box plus text rules (e.g. obvious out-of-city venues dropped when coordinates or copy allow it).
Fallback: If live requests fail or return no events, example Richmond events from src/data/mockEvents.js load and the UI shows a status notice.
Tech stack
React 18 + Vite 6
Tailwind CSS
Leaflet + react-leaflet (map)
Optional local demo auth (localStorage + hashed passwords — not a production backend)
Features (high level)
Hero: “Live listings. One city.” with a Richmond skyline image (Unsplash — see credit line under the photo in HeroSection.jsx).
Home tabs: Events (search, discovery, browse, map) · Neighborhood stories (spotlight + story map) · Plan & personalize (assistant, trails, “For you”).
Why us: Value props live near the bottom of the home page (before the footer); hero links to #why-us.
Events map: CARTO Voyager basemap, Richmond bounds overlay, optional arts/district polygons, category-colored pins (music / visual / theatre / family / free / other), hover tooltips (title + category), click for full popup (transit hints, multi-mode Maps links, Get tickets), Near me + list selection sync.
Getting there: On-page estimates are illustrative; Google Maps / Apple Maps links open live transit, driving (traffic), walking, and biking.
Planning assistant: Floating Ask me control (bottom-right); optional VITE_PLANNING_ASSISTANT_URL for server-backed replies, else on-device rules.
Personalization: Saved favorites, categories, story views (browser storage).
Legal: #privacy, #terms, contact section; update policiesLastUpdated in src/config/siteConfig.js when you change policies.
Project layout
Path	Role
src/App.jsx	Shell: tabs, filters, map column, assistant, modals
src/components/HeroSection.jsx	Hero + Richmond hero image URL + credit
src/components/WhyUsSection.jsx	Why us (rendered low on the home page)
src/components/PlanningChatAssistant.jsx	Floating Ask me + chat panel
src/components/EventCard.jsx	Feed cards, Get tickets, transit strip
src/components/EventMap.jsx	Events map (markers, tooltips, popups)
src/components/EventTransitStrip.jsx	“Getting there” + Maps handoff
src/services/eventService.js	Loads feeds, merge, dedupe, fallback
src/services/sourceAdapters.js	CultureWorks + optional ticket feed → normalized events
src/lib/richmondBounds.js	City box + text gates
src/lib/mergeEvents.js	Dedupe when merging sources
src/lib/mapPinCategory.js	Map pin color bucket from listing text/category
src/lib/mapContentFilters.js	Map “filter pins” semantics
src/lib/travelHandoff.js	Google / Apple Maps direction URLs
src/lib/transitEstimates.js	Rough walk / Pulse-style hints
src/lib/eventFilters.js	Search, filters, sort, display helpers
src/config/siteConfig.js	Site name, legal copy, policy date
src/config/env.js	VITE_* usage
Environment variables
Copy .env.example → .env.local for local overrides. Never commit secrets or private API tokens.

Product / site
Variable	Purpose
VITE_PUBLIC_SITE_URL	Canonical URL (e.g. https://yourdomain.com) — sharing, policies
VITE_CONTACT_EMAIL	Contact mailto target
VITE_LEGAL_ENTITY	Legal name on policies and footer
Data / display
Variable	Purpose
VITE_CULTUREWORKS_EVENTS_URL	CultureWorks JSON endpoint (default is Richmond)
VITE_DEFAULT_EVENT_IMAGE_URL	Fallback image when a listing has no image
VITE_EVENT_TIMEZONE	IANA zone for “tonight” / date logic (default America/New_York)
Optional ticket API (Eventbrite)
The app can merge Eventbrite search results when configured. Tokens must not use the VITE_ prefix (they stay off the client).

Variable	Purpose
EVENTBRITE_PRIVATE_TOKEN	Local dev only: Vite proxy adds Authorization: Bearer … to /eventbrite-api → https://www.eventbriteapi.com/v3
VITE_EVENTBRITE_PROXY	Production: HTTPS base URL of your proxy that forwards to the Eventbrite API with the token server-side
Optional planning assistant
Variable	Purpose
VITE_PLANNING_ASSISTANT_URL	POST { message, context } → { reply, eventIds? }. If unset, chat uses on-device rules only.
Other optional keys (VITE_RSS_FEED_URLS, etc.) are documented in .env.example.

Run locally
Node.js 18+ and npm.

cd whats-on-rva
cp .env.example .env.local   # optional
npm install
npm run dev
Open the URL Vite prints (usually http://localhost:5173).

npm run build    # output: dist/
npm run preview  # local production preview
Deploy
Any static host (S3, Cloudflare Pages, GitHub Pages, etc.)
Build: npm ci && npm run build.
Publish the dist folder.
Set VITE_* environment variables in the host’s dashboard to match production (especially VITE_PUBLIC_SITE_URL and any feed URLs).
This app uses hash routes for some pages (#privacy, #terms) — no special SPA rewrite is required for those. If you add history-based routes later, configure fallback to index.html.
Vercel
New project → import the repo; set Root Directory to whats-on-rva if the repo is monorepo-style.
Framework preset: Vite. Build: npm run build. Output: dist.
Add environment variables (see above). Do not put EVENTBRITE_PRIVATE_TOKEN in client-exposed vars; use VITE_EVENTBRITE_PROXY pointing to your worker.
Netlify
Build command: npm run build
Publish directory: dist
Same env var rules as Vercel.
Pre-launch checklist
 Set VITE_PUBLIC_SITE_URL, VITE_CONTACT_EMAIL, VITE_LEGAL_ENTITY
 Confirm CultureWorks URL and timezone
 If using ticket merge in production: deploy HTTPS proxy + VITE_EVENTBRITE_PROXY
 Update policiesLastUpdated in siteConfig.js if you edited Privacy/Terms
 Run npm run build locally and fix any errors
 Spot-check hero image load (Unsplash), map, Get tickets links, legal links, and #why-us on production
Accounts (demo)
Sign-in / register uses browser localStorage only — suitable for demos. For production accounts, replace with Supabase, Clerk, or your API and update Privacy/Terms accordingly.

Accuracy
Times, prices, and accessibility change on organizers’ sites. Users should always confirm on the official listing (Get tickets target) before going out.

Maintenance scripts (optional)
Under scripts/ there are helpers to import GRTC GTFS into JSON (PowerShell / Node / Python). They are not required to run the app; the live UI uses heuristic transit hints plus Maps links unless you wire generated stop data in yourself.

License / third-party
Hero image: Richmond skyline — Stephen Poore on Unsplash (Unsplash License). To avoid a runtime dependency on Unsplash, download the image and serve it from public/ (then point HeroSection.jsx at that path).
Map tiles: OpenStreetMap contributors + CARTO (see on-map attribution).
Event data: Subject to CultureWorks and any optional feed terms you enable.
