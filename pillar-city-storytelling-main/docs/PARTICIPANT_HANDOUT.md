> **Note:** This research was generated using AI assistance (Claude + Parallel.ai) with human expert review. See [methodology](methodology.md) for details.

# Participant handout

This file is a copy of [`CHALLENGE.md`](../CHALLENGE.md) plus this cover note so you can share one Markdown document. Official judge categories are described in `RUBRIC.md` at the hackathon repository root (the directory that contains `pillar-repos`). The body below mirrors `CHALLENGE.md` in this repository.

---

# A City That Tells Its Stories: Hackathon Challenge

This file defines the two practical problem statements for this pillar and the top-rated blue sky vision. Read this before reading anything else in the repository.

---

## The Two Problems You're Solving

### Problem 1: Discovering and Participating in Richmond's Arts & Cultural Events

**Statement:**
How might we use technology to improve how residents discover and engage with Richmond's local arts and cultural events so that locally produced creative work is easier to find, support, and experience, while minimizing manual curation and acknowledging City technology, staffing, and budget constraints?

**Why this problem matters:**
Richmond's arts community is vibrant but invisible from the outside. Event information is scattered across galleries, social media, nonprofit newsletters, and word of mouth. No broad view of what is happening exists. The City cannot sustain a manually curated calendar. The opportunity is aggregation: surfacing and connecting what already exists rather than creating new content.

**Build toward:**
- Richmond Arts Aggregator pulling from Eventbrite API, RSS feeds, gallery websites
- "What's On in RVA" discovery feed filtered by neighborhood, type, or date
- Arts & Cultural District map linking to original source event listings

**Key constraints:**
- Aggregate existing information: do not recreate content manually
- Avoid solutions that depend on ongoing staff curation
- Respect preferences of partner organizations whose event info you surface
- Work within City technology approval processes

**Data gaps to work around:**
- No arts/cultural event data in Richmond's open data catalog
- Arts district boundary data not confirmed in GeoHub: verify before building on it
- Richmond.com, Style Weekly, or RVA Magazine may have accessible feeds: check before assuming

#### Participant guide: connecting to the rubric (if you chose this problem)

Optional prompts: judges use [`RUBRIC.md`](../../RUBRIC.md).

- **Impact:** Make **local arts/culture events** easier to find and support by aggregating what already exists: not manual City curation fantasy.
- **User Value:** Resident or visitor who discovers something happening this week with clear links to sources.
- **Feasibility:** Real APIs/feeds or documented scraping limits; respect partner preferences for how listings appear.
- **Innovation:** Neighborhood filters, feeds, or map discovery beyond a single static list.
- **Execution:** Live or sampled aggregation with attribution.
- **Equity and inclusion:** Surface grassroots and smaller venues, not only big institutions.

**What often works well:** Aggregator with filters, map of districts, clear “source” links.

**What to avoid:** Copying events without attribution or violating partner terms.

*Try asking yourself:* Could someone new to RVA find something to do tonight from **real** feeds?

---

### Problem 2: Resident Stories as Civic Insight

**Statement:**
How might we use technology to improve how Richmond gathers and learns from residents' lived experiences so that community stories help inform City decisions, preserve Richmond's social history, and amplify voices that are often underrepresented, while respecting privacy, trust, and limited staff capacity?

**Why this problem matters:**
Richmond is experiencing rapid neighborhood change. Long-time residents: especially from underrepresented communities: hold stories that are not captured anywhere and risk being lost. Existing engagement tools collect issue-specific feedback, not lived experience. The gap between story collection and City decision-making is real and underfilled.

**Build toward:**
- Voice-to-Story Portal with guided prompts and explicit consent mechanism
- "Tell Us Your Story" guided interface, mobile-friendly, structured prompts
- Story-to-Insight Dashboard that surfaces themes and patterns from submitted narratives

**Key constraints:**
- Privacy and consent are non-negotiable: build consent-first
- Complement, do not duplicate, oral history work led by museums (the Valentine, Black History Museum, VCU)
- Avoid heavy manual transcription or processing: staff capacity is limited
- Do not claim to represent "all" Richmond stories without addressing participation bias

**Data gaps to work around:**
- No existing compiled oral history collection is accessible for weekend use
- Community storytelling channels for target populations are undocumented: do not assume digital-only

#### Participant guide: connecting to the rubric (if you chose this problem)

Optional prompts: [`RUBRIC.md`](../../RUBRIC.md) is authoritative for judges.

- **Impact:** Capture or structure **resident voice** for insight or preservation with **consent-first** design: not a replacement for museums’ oral history programs.
- **User Value:** Resident telling a story OR City/partner learning themes: with explicit consent and privacy story.
- **Feasibility:** Lightweight capture (prompts, mobile); honest about transcription/scale limits.
- **Innovation:** Consent UX, theme surfacing, or structured narrative without claiming “all Richmond.”
- **Execution:** Working submit + consent flow or dashboard on sample narratives.
- **Equity and inclusion:** Underrepresented voices; participation bias called out.

**What often works well:** Guided story capture, consent-first portal, theme dashboard on anonymized/approved samples.

**What to avoid:** No consent, claiming representativeness, or heavy manual pipeline you can’t sustain even as a demo story.

*Try asking yourself:* Would I submit my own story through this flow?

---

## The Blue Sky Vision

### Exploring Richmond Through Its Stories

**Statement:**
How might we use technology to help residents and visitors explore Richmond's neighborhoods, history, and culture through the stories of the people who shaped them, so that the city's identity becomes richer, more accessible, and more inclusive for everyone who lives here or comes here?

**Why this fits a weekend build:**
Richmond has one of the most distinct neighborhood histories in the mid-Atlantic, a rich civil rights and transformation history, active oral history institutions (the Valentine, Black History Museum, VCU), and an arts scene that is genuinely neighborhood-rooted. Rapid neighborhood change makes the archive-before-loss framing urgent. The raw material exists. The civic need is real.

**Hackathon path if you're aiming at this vision:**
Scope to one neighborhood or one story type: do not try to cover all of Richmond. Strong approaches:
- Neighborhood history explorer (Jackson Ward jazz history, Church Hill community change)
- Story layer on a map (oral history pins, QR code connection to place)
- Guided walking-tour style app seeded with narratives from a single museum partner

The blue sky is the ceiling. The targeted problem statements above are the floor. A team that builds one of the targeted statements with the blue sky framing in mind will have a compelling pitch for both the Pillar Award and the Moonshot Award.

**Rubric connection (blue sky):** Blends **Problem 2** (stories, place, history) with optional **Problem 1** energy (events/discovery). Use Problem 2’s guide if you lead with narrative; add Problem 1 only where you actually aggregate real event sources.

---

## Judges and the rubric

Hackathon judges evaluate prototypes using the shared categories described in [`RUBRIC.md`](../../RUBRIC.md) at the hackathon repository root. That document lists the category names and what judges are asked to consider.

The **Participant guide** sections under each problem above are optional ways to prepare your pitch. They are not official instructions to judges.
