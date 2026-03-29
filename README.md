# What's On RVA

Built for Hack for RVA 2026 under the “A City That Tells Its Stories” pillar, What’s On RVA is a source-linked platform that helps residents and visitors discover Richmond’s arts, culture, neighborhoods, and stories in one place.

Rather than creating a new manually curated City calendar, the project aggregates existing public event information and connects it with neighborhood history, local identity, and community stories.

This project was created specifically for the Hack for RVA challenge:

> How might we use technology to improve how residents discover and engage with Richmond's local arts and cultural events so that locally produced creative work is easier to find, support, and experience, while minimizing manual curation and acknowledging City technology, staffing, and budget constraints?

---

## Hackathon Track
**Pillar:** A City That Tells Its Stories  
**Problem Statement:** Arts & Cultural Event Discovery

Our submission focuses on:
- Aggregating arts and cultural events from existing public sources
- Making it easy for someone new to Richmond to find something happening tonight or this weekend
- Highlighting smaller and grassroots venues, not only large institutions
- Connecting events with neighborhood stories and Richmond’s cultural identity

---

## Why We Built This
Richmond has a vibrant arts community, but event information is scattered across:
- Gallery websites
- Instagram pages
- Nonprofit newsletters
- Eventbrite listings
- Community feeds

Today, there is no simple way to see what is happening across the city in one place.

What’s On RVA solves that by creating a lightweight discovery layer built on top of existing public sources.

---

## What the App Includes

### Arts & Cultural Event Discovery
- Search and filtering by neighborhood, category, date, and accessibility
- “Tonight in RVA” and “This Weekend” quick actions
- Featured Events and Hidden Gems sections
- Interactive map with event pins
- Save / Favorite events
- Source-linked event cards with direct links back to the original listing

### Neighborhood Storytelling
- Jackson Ward Jazz History
- Church Hill Community Change
- Blackwell Arts Trail
- Neighborhood spotlight cards
- Story pages connected to nearby current events

### Blue Sky Vision
Future versions of What’s On RVA could evolve into a full cultural exploration platform with:
- Guided walking tours
- Cultural trails
- Oral histories
- Community voices
- Story layers on a map
- Personalized cultural itineraries

---

## Data Sources
The project is designed around aggregation rather than manual content entry.

Primary and planned sources:
- CultureWorks Localist API
- Eventbrite organization / venue feeds
- Partner RSS feeds
- Future museum and oral history partners such as:
  - The Valentine
  - Black History Museum
  - VCU oral histories

Every event in the interface links back to its original source.

---

## Why This Is Ready to Integrate
This project was intentionally designed to fit Hack for RVA’s emphasis on feasibility and low operational burden.

- Uses existing public event sources
- Does not require a new City-managed content system
- Uses a modular service layer for future integrations
- Falls back to local sample data if APIs fail
- Can expand to include museums, oral history organizations, and neighborhood partners
- Could realistically be piloted by the City, arts organizations, or community groups

---

## Running the Project
```bash
npm install
npm run dev
