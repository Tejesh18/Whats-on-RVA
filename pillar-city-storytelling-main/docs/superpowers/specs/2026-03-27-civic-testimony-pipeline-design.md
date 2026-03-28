> **Note:** This research was generated using AI assistance (Claude + Parallel.ai) with human expert review. See [methodology](../../methodology.md) for details.

# Civic Testimony Pipeline: Operationalizing Elder Voices in Richmond's Planning Decisions

**Authors:** William Prior and Team
**Date:** March 27, 2026
**Status:** Draft for Richmond Civic Hackathon (March 27-29, 2026)
**Pillar:** A City That Tells Its Stories

---

## 1. The Problem

Richmond is making irreversible decisions about its neighborhoods while the people who best understand what those neighborhoods have already survived are dying.

Every month, the Richmond Planning Commission reviews rezoning applications, Special Use Permits, and Plans of Development that reshape neighborhoods block by block. These decisions have formal public comment periods. The public record for a typical case includes the developer's application, staff analysis, traffic studies, and architectural renderings. What it almost never includes is the voice of someone who was there the last time that block was rezoned, the last time that neighborhood was "revitalized," the last time someone showed up with plans and promises.

Those voices exist. A 90-year-old Black woman in Church Hill remembers what urban renewal did to her street in the 1960s. A retired laborer in Gilpin Court watched three waves of redevelopment promises come and go. A longtime Jackson Ward resident can tell you exactly what happened to the Black businesses on 2nd Street when the Richmond-Petersburg Turnpike was built through the neighborhood in 1958. These are not sentimental memories. They are civic evidence — firsthand accounts of what happens when planning decisions are made without historical context.

But these voices never reach the room where the vote happens. The barriers are structural and compounding:

- **Physical access.** Planning Commission meetings happen at 1:30 PM or 7:00 PM at City Hall. A 90-year-old with mobility limitations, no car, and no broadband is not attending.
- **Digital access.** Richmond's East End census tracts show 66.2% of households lacking broadband, 47.7% lacking smartphone access. Online public comment systems are inaccessible to the population with the most relevant testimony.
- **Institutional distrust.** Richmond's Black communities have experienced generations of extractive engagement — journalists who take stories and leave, academics who publish papers the community never sees, city processes that solicit input and then ignore it. Distrust of formal systems is not irrational; it is earned.
- **Format mismatch.** Public comment periods accept written testimony or three-minute verbal statements. Neither format accommodates the way elders actually share knowledge — through narrative, through digression, through stories that take twenty minutes to reach the point because the context is the point.
- **No matching mechanism.** Even if testimony were captured, there is no system connecting a specific planning decision at a specific address to the specific historical voices relevant to that decision. Stories sit in archives. Decisions happen in hearing rooms. There is no bridge.

The result is a planning process that is technically open to public input but structurally closed to the people whose experience is most relevant. Richmond makes decisions about neighborhoods using traffic counts and market projections while the living memory of what those neighborhoods have already endured sits in living rooms, churches, and senior centers — unrecorded, unrouted, and running out of time.

This is not a technology problem. It is an infrastructure gap. Richmond has civic infrastructure for moving water, electricity, and traffic through neighborhoods. It has no civic infrastructure for moving memory.

**The window is closing.** Richmond's Black population decreased 7% between 2000 and 2016 while its White population increased 35%. The city ranks second nationally in eviction rates at 11.44%. Major public housing redevelopments are underway at Gilpin Court, Creighton Court, and Mosby Court. The neighborhoods where elder testimony is most relevant are the same neighborhoods experiencing the most rapid displacement. Every month without a system to capture and route these voices is a month of irreversible loss.

---

## 2. The Solution

We are building a **Civic Testimony Pipeline** — a system that automatically matches elder testimony to live city planning decisions and surfaces that testimony as part of the public record.

The system has three components:

### 2.1 The Matching Engine

The core innovation is not capture and not storage. It is **routing**.

When a Planning Commission agenda is published, the system parses each case for three attributes: **geographic location** (address, parcel, neighborhood), **decision type** (rezoning, demolition, Special Use Permit, Plan of Development), and **topic signature** (housing density, commercial conversion, historic preservation, affordable housing, displacement risk).

The engine then queries the testimony index for stories that match on three dimensions:

- **Geography.** Stories told by residents of the affected neighborhood or adjacent neighborhoods.
- **Topic.** Stories tagged with civic themes relevant to the decision type — displacement, demolition, segregation, community change, development promises, housing loss.
- **Temporal parallel.** Stories that describe what happened the last time a similar decision was made in that area. This is the most powerful dimension. A 2026 rezoning application for Church Hill becomes contextualized by testimony from residents who lived through Church Hill's previous waves of change. The system does not argue for or against the application. It says: "Here is what the people who were there last time remember about what happened next."

The output is a **Civic Testimony Packet** — a structured document containing relevant story excerpts, historical context, source attribution, consent status, and links to full recordings. The packet is formatted for submission as public comment into the formal planning record.

### 2.2 The Story Index

The testimony index is a structured repository of stories, each anchored to:

- **Who:** Storyteller identity (or pseudonym, per consent level)
- **Where:** Neighborhood, specific location if provided, and residential history (where they lived and when)
- **When:** The era(s) the story describes (not when it was recorded — when it happened)
- **What:** Civic theme tags (displacement, housing, segregation, development, community institutions, policing, infrastructure, education, employment, faith communities)
- **Consent:** Three-tier model — (1) public/attributed, (2) public/pseudonymous, (3) private/research-only. Consent is revocable at any time. Stories with revoked public consent are removed from testimony packets but preserved in the private archive.

**Seed content for the hackathon demo** comes from existing, publicly accessible Richmond oral history collections:

| Collection | Stories | Content | Access |
|-----------|---------|---------|--------|
| VCU Libraries — Historic Fulton Oral History Project | 17 interviews, 32 participants | Demolished African-American Fulton neighborhood, 1930s-1950s | Public streaming + searchable transcripts |
| VCU Libraries — Carver Oral History Collection | 15 interviews | Carver neighborhood history, 1999-2000 | Public MP3 + PDF transcripts |
| StoryCorps Archive — Richmond | 500+ conversations | Diverse Richmond voices | Searchable with audio |

These collections are not hypothetical. They are live, accessible, and already transcribed. For the hackathon demo, we index 5-10 stories from the Fulton and Carver collections, tag them with civic themes and temporal anchors, and match them against a real Planning Commission agenda item.

**Long-term archival** follows Library of Congress American Folklife Center standards for oral history preservation — the same framework used by StoryCorps for its national archive. Stories are preserved in original audio format with transcripts, metadata, and consent documentation. The civic routing layer is an access mechanism on top of archival-grade storage, not a replacement for it.

### 2.3 The Capture Protocol (Post-Hackathon Vision)

The hackathon demo uses existing archived testimony. The full system adds a capture layer designed for the specific population we are trying to reach.

**The Trigger Model.** When a planning decision enters the pipeline that affects a specific neighborhood, the system does not passively wait for relevant stories to exist. It triggers capture. Community facilitators in the affected neighborhood — church leaders, senior center staff, community health workers, barbers — receive a notification: "A rezoning application has been filed for [address]. We need voices from people who remember what happened the last time this neighborhood changed."

This solves the two hardest problems simultaneously:

1. **Trust.** The facilitator is a known, trusted community member. The storyteller is not talking to an app or a city official. They are talking to someone they already trust, about something that directly threatens their neighborhood.
2. **Motivation.** "Tell your story" is abstract. "Someone is about to change your block and your voice should be in that room" is concrete. The civic urgency is the reason to sit down and talk. The framing is not "oral history" — it is **testimony in defense of your neighborhood**.

**Capture design:**
- Voice-first. Phone hotline, in-person recording at community anchor locations, home visits by trained facilitators.
- Guided prompts tied to the specific decision: "What was this block like when you moved here?" "What happened the last time someone tried to change this neighborhood?" "What should the people making this decision know?"
- Consent collected verbally and documented by facilitator. Three tiers. Revocable.
- Immediate return of value: storyteller receives their recording (audio file, printed transcript, or both). The story is theirs. They are lending it to the public record, not giving it away.
- Incentives are cash-equivalent and immediate (grocery gift cards). No digital transfers. No bank account requirements.

**Who the facilitators are (and are not):**
- ARE: People who already hold trust in the community — pastors, barbers, senior center coordinators, community health workers, hospice chaplains, public housing resident council members.
- ARE NOT: City employees, academic researchers, journalists, or app users. The system does not disintermediate existing trust relationships. It equips them.

---

## 3. Why This Is Different

### 3.1 What exists today

**StoryCorps** proved that people will share deeply personal stories when paired with someone they trust in a structured conversation. StoryCorps archives at the Library of Congress. But StoryCorps does not route stories to decision-makers. A Richmond StoryCorps recording about Church Hill displacement sits in an archive. It does not show up when a Church Hill rezoning application hits the Planning Commission.

**Public comment systems** accept written and verbal testimony during planning processes. But they require the commenter to know about the hearing, physically or digitally attend, and compress their experience into a three-minute statement or a written letter. They are structurally hostile to the population with the most relevant testimony.

**Richmond's oral history institutions** (The Valentine, VCU Libraries, Black History Museum) preserve stories with professional archival standards. But their collections are organized for research access, not civic routing. You can find Fulton neighborhood oral histories on VCU's digital repository. You cannot find them by searching "what do residents say about the block where a demolition permit was just filed."

**No existing system connects the planning pipeline to the testimony archive.** That bridge is the innovation.

### 3.2 What this changes

| Today | With Civic Testimony Pipeline |
|-------|-------------------------------|
| Planning decisions reference traffic studies and market data | Planning decisions also reference lived experience from affected neighborhoods |
| Elder testimony is captured for archival purposes | Elder testimony is captured for immediate civic use AND long-term archival |
| Public comment requires attendance at hearings | Public comment includes pre-recorded testimony from people who cannot attend |
| Stories are organized by collection and date | Stories are indexed by neighborhood, civic theme, and era — queryable by planning case |
| Historical parallels to current decisions are invisible | Historical parallels are surfaced automatically: "The last time this neighborhood was rezoned, here is what residents say happened" |
| Trust networks (churches, senior centers) are disconnected from planning processes | Trust networks become the capture infrastructure for civic testimony |

### 3.3 The temporal parallel is the breakthrough

Other systems collect stories. Other systems accept public comment. No system takes a live planning decision, identifies the historical parallel, and surfaces firsthand testimony from people who lived through that parallel.

A developer files a rezoning application to convert affordable housing to mixed-use luxury in Church Hill. The system surfaces testimony from Fulton residents describing what happened when their neighborhood was demolished for urban renewal in the 1950s and 1960s. Not as argument — as context. As memory made structurally available to the people who need it before they vote.

This is not sentiment analysis. It is not AI-generated policy recommendations. It is the actual voices of actual people who were actually there, matched to the specific decision that their experience illuminates, delivered into the formal record where that decision is being made.

---

## 4. Hackathon Demo Design

### 4.1 What we show on Sunday

**The full loop, with real content and a real planning decision, simulated pipeline.**

1. **Open on a real Planning Commission agenda item.** Pull an actual recent or upcoming case — a rezoning, SUP, or Plan of Development in Church Hill, Jackson Ward, or the East End. Show the case number, address, application type.

2. **The system parses the case.** Extracts neighborhood (Church Hill), decision type (rezoning), topic signature (residential to commercial conversion, displacement risk). This parsing can be rule-based for the demo — no ML required.

3. **The matching engine queries the story index.** Searches for testimony matching Church Hill + displacement/housing change + historical era. Returns ranked results from the seeded VCU oral history collections.

4. **Display the Civic Testimony Packet.** A formatted document showing:
   - Case reference (number, address, application type)
   - Matched testimony excerpts with attribution
   - Historical context: "This neighborhood experienced [specific change] in [year]. The following residents describe what happened."
   - Audio clips or transcript excerpts
   - Source attribution (VCU Libraries, The Valentine)
   - Consent status for each story
   - Note: "This testimony was surfaced automatically based on geographic, thematic, and temporal relevance to Planning Commission Case #[X]."

5. **Close with the vision.** "This demo used archived testimony from the 1990s. The full system triggers new capture — when this rezoning application was filed, community facilitators in Church Hill would have been notified to collect testimony from elders who remember what happened the last time. Their voices would be in this packet. In the room. Part of the record. Before the vote."

### 4.2 Technical architecture for the demo

```
┌─────────────────────────────────────────────────────────────┐
│                    CIVIC TESTIMONY PIPELINE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │   DECISION    │    │   MATCHING    │    │    STORY      │  │
│  │   INGEST      │───▶│   ENGINE      │◀───│    INDEX      │  │
│  │              │    │              │    │               │  │
│  │ Planning      │    │ Geo match    │    │ VCU Fulton    │  │
│  │ Commission    │    │ Topic match  │    │ VCU Carver    │  │
│  │ agenda parser │    │ Temporal     │    │ StoryCorps    │  │
│  │              │    │ parallel     │    │ New capture   │  │
│  └──────────────┘    └──────┬───────┘    └───────────────┘  │
│                             │                                │
│                             ▼                                │
│                    ┌──────────────────┐                      │
│                    │  TESTIMONY PACKET │                      │
│                    │                  │                      │
│                    │  Case context    │                      │
│                    │  Matched stories │                      │
│                    │  Historical      │                      │
│                    │  parallels       │                      │
│                    │  Audio/transcript│                      │
│                    │  Attribution     │                      │
│                    │  Consent status  │                      │
│                    └────────┬─────────┘                      │
│                             │                                │
│              ┌──────────────┼──────────────┐                 │
│              ▼              ▼              ▼                 │
│     ┌──────────────┐ ┌───────────┐ ┌──────────────┐        │
│     │ PUBLIC RECORD │ │ ADVOCATES │ │  LONG-TERM   │        │
│     │ Submitted as  │ │ Community │ │  ARCHIVE     │        │
│     │ public comment│ │ orgs get  │ │  LoC-standard│        │
│     │ to Planning   │ │ testimony │ │  preservation│        │
│     │ Commission    │ │ packets   │ │              │        │
│     └──────────────┘ └───────────┘ └──────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Stack:**
- Frontend: React (Vite) or Next.js — case viewer + testimony packet display
- Backend: Python FastAPI — agenda parsing, matching logic, story index queries
- Story Index: SQLite or JSON for hackathon; tagged oral history records with geo/topic/era fields
- Content: Pre-indexed VCU oral history transcripts (public, no auth required)
- Maps: Leaflet + OpenStreetMap + Richmond GeoHub neighborhood boundaries (GeoJSON)
- No ML required for demo — matching is rule-based on pre-tagged metadata

### 4.3 What we do NOT show

- We do not claim the system is automated end-to-end. The agenda parsing and story tagging are manual for the demo.
- We do not claim the testimony represents all Richmond voices. Mandatory disclaimer on every packet.
- We do not claim the system replaces public comment. It supplements it.
- We do not claim city adoption. We say: "We'd want to talk with the Planning Commission and The Valentine about whether this has a home."

---

## 5. Consent Architecture

Consent is not a feature of this system. It is a load-bearing structural element. If consent fails, the system fails — not technically, but ethically and practically, because the target population will refuse to participate.

### 5.1 Three-tier consent model

| Tier | What it means | Who sees the story |
|------|--------------|-------------------|
| **Public / Attributed** | Full name, full story, in public testimony packets and archive | Planning Commission, public record, researchers, anyone |
| **Public / Pseudonymous** | Story appears in testimony packets with pseudonym and neighborhood only | Same visibility, identity protected |
| **Private / Research-only** | Story is archived but never appears in testimony packets or public output | Archivists and approved researchers only |

### 5.2 Consent is revocable

A storyteller can change their consent tier or withdraw entirely at any time. If a story has already been submitted in a testimony packet to the public record, withdrawal applies to all future use — the packet already in the record cannot be retracted (it is a public document), but the system flags it as withdrawn and excludes it from all future matching.

This is explained to storytellers at capture: "Once your words are part of the public record for a specific case, that record is permanent. But you can stop your story from being used in any future case at any time."

### 5.3 High-risk content protocols

Stories touching displacement, discrimination, criminal justice, or family hardship undergo editorial review before inclusion in public testimony packets:
- Full names of third parties redacted unless they are public officials acting in official capacity
- Geographic precision reduced to block or neighborhood level for displacement narratives
- Storyteller reviews excerpt selection before packet submission (when timeline allows)

---

## 6. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Storytellers feel exploited** — voices used for civic purposes they didn't intend | Critical | Framing is explicitly civic from the start ("testify for your neighborhood"). No bait-and-switch. Consent is granular and revocable. |
| **Stories misrepresented as community consensus** | High | Every packet carries disclaimer: "Based on voluntarily shared testimony. Not a representative sample of community opinion." Per AAPOR standards. |
| **System weaponized by either side** — developers or opponents cherry-pick testimony | High | System surfaces ALL matched testimony, not curated selections. Packet includes all relevant voices, not just those supporting one position. |
| **Institutional capture** — City adopts system and controls what gets surfaced | Medium | System is community-operated with open matching criteria. City receives packets; City does not control the index or matching logic. |
| **Cold-start problem** — not enough stories to generate meaningful packets | Medium | Seed with existing VCU and StoryCorps collections. Trigger model generates new testimony in response to live decisions. |
| **Facilitator network doesn't materialize** | Medium | Start with 2-3 partner institutions (churches, senior centers). Expand based on demonstrated value, not speculative recruitment. |
| **Stories are too long / unstructured for packet format** | Low | Facilitators use guided prompts. Packets include curated excerpts with links to full recordings. Storyteller reviews excerpts when possible. |
| **Copyright and attribution** | Low | VCU collections are public with attribution requirements. The Valentine requires credit as copyright holder. All sources cited on every packet. |

---

## 7. Success Metrics

### 7.1 Hackathon success (Sunday demo)

- Working demo with real Planning Commission case matched to real VCU oral history testimony
- Testimony packet generated with geographic, thematic, and temporal matching visible
- Judges understand the full vision: archive → match → route → public record
- At least one institutional champion identified (The Valentine, VCU Libraries, Planning Commission staff)

### 7.2 Post-hackathon success (90 days)

- 3+ new stories captured through facilitator-mediated sessions in one neighborhood
- 1 testimony packet submitted as actual public comment to a Planning Commission case
- Partnership formalized with at least one archival institution (The Valentine or VCU Libraries)
- Consent framework reviewed by community advisory group

### 7.3 System success (12 months)

- Active facilitator network in 3+ Richmond neighborhoods
- Testimony packets generated for every Planning Commission agenda (automated parsing)
- 50+ stories in the index with full geo/topic/era tagging
- At least one documented instance where testimony visibly informed a planning decision
- Long-term archival agreement in place with institution meeting Library of Congress preservation standards

---

## 8. What This Is Really About

There is a room in Richmond City Hall where votes happen that reshape neighborhoods. In that room there are staff reports, traffic studies, developer renderings, and market analyses. There are sometimes three or four residents who managed to show up and speak for three minutes each.

There is no mechanism to bring into that room the voice of a 90-year-old woman who watched the same thing happen to her block fifty years ago and knows exactly how the promises turned out.

This system builds that mechanism.

It does not replace public comment. It does not make policy recommendations. It does not claim to represent all of Richmond. It does one thing: when a decision is about to be made about a neighborhood, it finds the people who remember what happened last time, and it puts their words in the record.

The stories serve the living by informing decisions that affect their neighborhoods today. Then they outlive the storyteller — preserved to archival standards, indexed by place and time, available to the next generation the next time someone shows up with plans and promises for that same block.

The 90-year-old woman does not need to get to City Hall. She does not need to compress her life into three minutes. She does not need to trust an app. She needs someone she already trusts to sit with her, ask her what she remembers, and tell her: your words will be in that room. On the record. Before the vote.

That is what this system does.

---

## Appendix A: Richmond Planning Commission Data Access

Planning Commission agendas and case files are published on the City of Richmond website. Each case includes:
- Case number
- Property address and parcel ID
- Application type (rezoning, SUP, POD, etc.)
- Staff report with recommendation
- Applicant materials

For the hackathon demo, one real case will be manually parsed. Post-hackathon, agenda parsing can be automated via web scraping of published PDFs or integration with the city's permitting system.

## Appendix B: Existing Oral History Collections for Seed Content

**VCU Libraries — Historic Fulton Oral History Project**
- URL: https://scholarscompass.vcu.edu/ful/
- 17 interviews with 32 participants describing the demolished African-American Fulton neighborhood (1930s-1950s)
- Format: Streaming audio + searchable transcripts
- Copyright: The Valentine (non-commercial use permitted)
- Relevance: Direct testimony about neighborhood destruction through urban planning decisions

**VCU Libraries — Carver Oral History Collection**
- URL: https://scholarscompass.vcu.edu/car/
- 15 interviews (1999-2000) about Carver neighborhood history
- Format: MP3 audio + PDF transcripts
- Relevance: Neighborhood change, community institutions, residential experience

**StoryCorps Archive — Richmond, VA**
- URL: https://archive.storycorps.org
- 500+ Richmond "One Small Step" conversations
- Relevance: Diverse Richmond voices; searchable for neighborhood and theme

## Appendix C: Named Institutional Partners

| Person | Institution | Relevance |
|--------|------------|-----------|
| Todd B. Waldo | Shockoe Institute | Richmond history advocacy; storytelling focus |
| Meg Hughes | The Valentine | Oral history collections; archival standards |
| Sylvio Lynch III | History & Culture Commission | City-connected champion; civic routing |
| Chaya Braxton | Office of Strategic Communications | City adoption pathway |

## Appendix D: Demographic Context — East End Richmond

| Indicator | Rate | Source |
|-----------|------|--------|
| Households lacking broadband | 66.2% | Census ACS, East End tracts |
| Households lacking smartphone | 47.7% | Census ACS, East End tracts |
| Age 55+ internet access gap | 73% more likely to lack | Census ACS |
| Black residents internet gap | 115% more likely to lack | Census ACS |
| Black residents unbanked | 138% more likely | FDIC survey |
| Richmond eviction rate | 11.44% (2nd nationally) | Eviction Lab |
| Black population change 2000-2016 | -7% | Census |
| White population change 2000-2016 | +35% | Census |
