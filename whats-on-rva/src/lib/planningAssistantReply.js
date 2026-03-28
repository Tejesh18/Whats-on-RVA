import {
  isTonightRichmond,
  isThisWeekendRichmond,
  formatEventWhen,
  neighborhoodMatchesFilter,
} from './eventFilters.js';
import { NEIGHBORHOOD_SPOTLIGHTS } from '../data/neighborhoodStories.js';

/** Build a natural, ChatGPT-style answer from filtered listings (no API required). */
function buildLocalReply(userText, events) {
  const t = userText.trim();
  if (!t) {
    return {
      reply: [
        'Thanks for stopping by — I help you plan around **what’s already loaded** in this tab (your Richmond event list).',
        '',
        'You can ask in plain English, for example:',
        '• “What should we do **tonight** if we like jazz?”',
        '• “**Free** things **this weekend** near Church Hill.”',
        '• “Family-friendly **art** or markets coming up.”',
        '',
        '**Note:** I don’t browse the live web — I only reason over the calendar data in this page. For deeper AI, set `VITE_PLANNING_ASSISTANT_URL` to your own backend.',
      ].join('\n'),
      picks: [],
    };
  }

  const lower = t.toLowerCase();
  const now = new Date();
  let pool = events.filter((e) => new Date(e.startTime) >= now);

  const intentBits = [];

  if (/\btonight\b|\btonite\b|\bthis evening\b/i.test(t)) {
    pool = pool.filter((e) => isTonightRichmond(e));
    intentBits.push('**Tonight** (Richmond “today” window)');
  } else if (/\bweekend\b|\bsaturday\b|\bsunday\b|\bthis weekend\b/i.test(t)) {
    pool = pool.filter((e) => isThisWeekendRichmond(e));
    intentBits.push('**This weekend**');
  }

  if (/\bfree\b|\bno cover\b|\bzero cost\b/i.test(t)) {
    pool = pool.filter((e) => e.isFree);
    intentBits.push('**Free or no ticket**');
  }

  let matchedSpotlight = null;
  for (const s of NEIGHBORHOOD_SPOTLIGHTS) {
    if (s.match.test(t) || lower.includes(s.label.toLowerCase())) {
      matchedSpotlight = s;
      pool = pool.filter((e) => neighborhoodMatchesFilter(e.neighborhood, s.label));
      intentBits.push(`**Near ${s.label}**`);
      break;
    }
  }

  if (!matchedSpotlight && /\bblackwell\b|\bblack well\b/i.test(t)) {
    pool = pool.filter((e) =>
      /\bblackwell|southside|manchester|river\b/i.test(`${e.neighborhood} ${e.venue} ${e.title}`)
    );
    intentBits.push('**Southside / Blackwell angle**');
  }

  const blob = (e) =>
    `${e.title} ${e.description} ${e.category} ${(e.tags || []).join(' ')} ${(e.accessibilityBadges || []).join(' ')}`;

  if (/jazz|live music|concert|\bband\b|dj set|soul|blues/i.test(t)) {
    pool = pool.filter((e) => /jazz|live music|concert|band|music|soul|blues|dj|karaoke/i.test(blob(e)));
    intentBits.push('**Live music / jazz vibe**');
  }
  if (/mural|gallery|visual art|opening reception|exhibit/i.test(t)) {
    pool = pool.filter((e) => /mural|gallery|art|exhibit|opening|studio|craft/i.test(blob(e)));
    intentBits.push('**Visual art / murals**');
  }
  if (/family|kid|children|all ages/i.test(t)) {
    pool = pool.filter((e) => /family|kid|children|all ages/i.test(blob(e)));
    intentBits.push('**Family-friendly**');
  }
  if (/theatre|theater|play|comedy show|performance/i.test(t)) {
    pool = pool.filter((e) => /theatre|theater|play|comedy|performance|drama|dance/i.test(blob(e)));
    intentBits.push('**Theatre / performance**');
  }

  pool.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const picks = pool.slice(0, 8);

  const understood =
    intentBits.length > 0
      ? `Here’s how I interpreted your message: ${intentBits.join(' · ')}.`
      : `I didn’t catch a super-specific filter, so I’m showing **upcoming** listings broadly — feel free to add “tonight”, a neighborhood name, or “free”.`;

  if (picks.length === 0) {
    return {
      reply: [
        '### Quick answer',
        'I couldn’t find **upcoming listings** in the current data that match those constraints. That usually means either the filters are tight (e.g. “tonight” + a rare combo) or the feed hasn’t loaded many events yet.',
        '',
        '### What I’d try next',
        '1. Open the **Events** tab and loosen date or neighborhood filters.',
        '2. Remove “tonight” and ask again for the **next 7 days**.',
        '3. Reload data from the banner if you’re on sample listings.',
        '',
        understood,
      ].join('\n'),
      picks: [],
    };
  }

  const lines = picks.map((e, i) => {
    const when = formatEventWhen(e.startTime);
    const where = [e.venue, e.neighborhood].filter(Boolean).join(' · ');
    const price = e.isFree ? 'Free' : e.price || 'Paid';
    return `${i + 1}. **${e.title}**\n   _${when}_ · ${where} · ${price}`;
  });

  const reply = [
    '### Here’s what I’d suggest',
    understood,
    '',
    'These are **ordered by start time** from your loaded calendar:',
    '',
    ...lines,
    '',
    '### Tips',
    `• Tap a **Quick pick** below to focus it on the map and list.\n• Use **Plan my night** (form) for a structured evening.\n• I can refine further if you tell me budget, neighborhood, or “no music”.`,
  ].join('\n');

  return { reply, picks };
}

function resolveAssistantUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const t = raw.trim();
  if (!t) return '';
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (typeof window !== 'undefined') {
    const path = t.startsWith('/') ? t : `/${t}`;
    return `${window.location.origin}${path}`;
  }
  return '';
}

export async function getPlanningAssistantReply(userText, events) {
  const url = resolveAssistantUrl(import.meta.env.VITE_PLANNING_ASSISTANT_URL);
  if (url) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          style: 'conversational_markdown',
          context: {
            eventCount: events.length,
            events: events.slice(0, 55).map((e) => ({
              id: e.id,
              title: e.title,
              startTime: e.startTime,
              neighborhood: e.neighborhood,
              venue: e.venue,
              category: e.category,
              isFree: e.isFree,
              description: (e.description || '').slice(0, 280),
            })),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = typeof data?.reply === 'string' ? data.reply : null;
        if (reply) {
          const ids = Array.isArray(data.eventIds) ? data.eventIds : [];
          const picks = ids.length
            ? ids.map((id) => events.find((e) => e.id === id)).filter(Boolean).slice(0, 8)
            : [];
          return { reply, picks, source: 'remote' };
        }
      }
    } catch {
      /* fall through */
    }
  }

  const local = buildLocalReply(userText, events);
  return { ...local, source: 'local' };
}
