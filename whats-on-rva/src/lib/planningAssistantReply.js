import {
  isTonightRichmond,
  isThisWeekendRichmond,
  formatEventWhen,
  neighborhoodMatchesFilter,
} from './eventFilters.js';
import { NEIGHBORHOOD_SPOTLIGHTS } from '../data/neighborhoodStories.js';

function buildLocalReply(userText, events) {
  const t = userText.trim();
  if (!t) {
    return {
      reply:
        'Try asking things like: “What’s good tonight in Jackson Ward?”, “Free events this weekend”, or “Jazz near Carytown”. I use your loaded listings only — nothing leaves your browser unless you add an AI backend URL.',
      picks: [],
    };
  }

  const lower = t.toLowerCase();
  const now = new Date();
  let pool = events.filter((e) => new Date(e.startTime) >= now);

  if (/\btonight\b|\btonite\b|\bthis evening\b/i.test(t)) {
    pool = pool.filter((e) => isTonightRichmond(e));
  } else if (/\bweekend\b|\bsaturday\b|\bsunday\b|\bthis weekend\b/i.test(t)) {
    pool = pool.filter((e) => isThisWeekendRichmond(e));
  }

  if (/\bfree\b|\bno cover\b|\bzero cost\b/i.test(t)) {
    pool = pool.filter((e) => e.isFree);
  }

  let matchedSpotlight = null;
  for (const s of NEIGHBORHOOD_SPOTLIGHTS) {
    if (s.match.test(t) || lower.includes(s.label.toLowerCase())) {
      matchedSpotlight = s;
      pool = pool.filter((e) => neighborhoodMatchesFilter(e.neighborhood, s.label));
      break;
    }
  }

  if (!matchedSpotlight && /\bblackwell\b|\bblack well\b/i.test(t)) {
    pool = pool.filter((e) =>
      /\bblackwell|southside|manchester|river\b/i.test(`${e.neighborhood} ${e.venue} ${e.title}`)
    );
  }

  const blob = (e) =>
    `${e.title} ${e.description} ${e.category} ${(e.tags || []).join(' ')} ${(e.accessibilityBadges || []).join(' ')}`;

  if (/jazz|live music|concert|\bband\b|dj set|soul|blues/i.test(t)) {
    pool = pool.filter((e) => /jazz|live music|concert|band|music|soul|blues|dj|karaoke/i.test(blob(e)));
  }
  if (/mural|gallery|visual art|opening reception|exhibit/i.test(t)) {
    pool = pool.filter((e) => /mural|gallery|art|exhibit|opening|studio|craft/i.test(blob(e)));
  }
  if (/family|kid|children|all ages/i.test(t)) {
    pool = pool.filter((e) => /family|kid|children|all ages/i.test(blob(e)));
  }
  if (/theatre|theater|play|comedy show|performance/i.test(t)) {
    pool = pool.filter((e) => /theatre|theater|play|comedy|performance|drama|dance/i.test(blob(e)));
  }

  pool.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const picks = pool.slice(0, 8);

  if (picks.length === 0) {
    return {
      reply:
        'No upcoming matches for that combo in the listings currently loaded. Clear filters on the main feed, load live data, or rephrase (e.g. drop “tonight” to see later dates).',
      picks: [],
    };
  }

  const lines = picks.map((e) => {
    const when = formatEventWhen(e.startTime);
    const where = [e.venue, e.neighborhood].filter(Boolean).join(' · ');
    return `• ${e.title}\n  ${when} · ${where}${e.isFree ? ' · Free' : ''}`;
  });

  const head =
    picks.length >= 8
      ? `Here are up to 8 ideas from your calendar data:`
      : `Here are ${picks.length} idea${picks.length === 1 ? '' : 's'}:`;

  const tail =
    '\n\n— For a step-by-step evening, open “Plan my night” in the discovery panel. Tap a card below to focus it on the map.';

  return { reply: `${head}\n\n${lines.join('\n\n')}${tail}`, picks };
}

/**
 * Planning helper: optional remote AI (`VITE_PLANNING_ASSISTANT_URL` POST JSON `{ message, context }` → `{ reply, eventIds? }`),
 * otherwise on-device keyword + listing match.
 */
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
          context: {
            eventCount: events.length,
            events: events.slice(0, 50).map((e) => ({
              id: e.id,
              title: e.title,
              startTime: e.startTime,
              neighborhood: e.neighborhood,
              venue: e.venue,
              category: e.category,
              isFree: e.isFree,
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
