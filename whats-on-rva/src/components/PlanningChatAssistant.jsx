import { useEffect, useId, useRef, useState } from 'react';
import { getPlanningAssistantReply } from '../lib/planningAssistantReply.js';

/** Renders assistant text: ### headings, **bold**, _italic_ */
function AssistantRichText({ text }) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={bi} className="mt-3 first:mt-0 font-display text-sm font-bold text-violet-950">
          {trimmed.replace(/^###\s+/, '')}
        </h4>
      );
    }
    return (
      <p key={bi} className="mt-2 first:mt-0 whitespace-pre-wrap leading-relaxed">
        {formatInline(trimmed)}
      </p>
    );
  });
}

function formatInline(s) {
  const parts = s.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return (
        <em key={i} className="text-zinc-600">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function PlanningChatAssistant({
  events,
  onSelectEvent,
  onOpenPlanMyNight,
  /** Controlled open state (recommended) */
  isOpen,
  onClose,
  onOpen,
}) {
  const panelId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;

  const doOpen = () => {
    onOpen?.();
    if (isOpen === undefined) setInternalOpen(true);
  };
  const doClose = () => {
    onClose?.();
    if (isOpen === undefined) setInternalOpen(false);
  };

  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: [
        'Hi — I’m your **Richmond planning assistant**.',
        '',
        'Ask me anything in natural language (like you would with ChatGPT). I’ll answer in full sentences, call out how I interpreted your request, and suggest concrete listings from **what’s already loaded** on this site.',
        '',
        'Try: “We’re two people, want something **free** and outdoors **Saturday afternoon**” or “**Jazz** near **Jackson Ward** tonight.”',
      ].join('\n\n'),
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') doClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function send() {
    const t = input.trim();
    if (!t || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: t }]);
    setBusy(true);
    try {
      const { reply, picks, source } = await getPlanningAssistantReply(t, events);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: reply,
          picks: picks || [],
          source,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'Something went wrong on my side — please try again in a moment. If you’re using a custom AI URL, check that it returns JSON with a `reply` string.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={doOpen}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-700 py-3 pl-3.5 pr-5 text-white shadow-lg shadow-violet-900/30 ring-2 ring-white/90 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60 sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-controls={panelId}
        title="Ask me — Richmond planning assistant"
      >
        <span className="text-2xl leading-none" aria-hidden>
          🤖
        </span>
        <span className="text-sm font-extrabold tracking-tight">Ask me</span>
        <span className="sr-only">Open planning assistant</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end sm:items-end sm:justify-end sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Planning assistant"
        >
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close assistant" onClick={doClose} />
          <div
            id={panelId}
            className="relative flex h-[min(100dvh,560px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:h-[min(560px,88vh)] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-violet-700 to-indigo-800 px-4 py-3 text-white">
              <div>
                <p className="font-display text-lg font-bold">Planning assistant</p>
                <p className="text-[11px] font-medium text-violet-100/90">
                  Chat-style answers · local data · optional server AI
                </p>
              </div>
              <button
                type="button"
                onClick={doClose}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-3 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'ml-6 bg-zinc-900 text-white'
                      : 'mr-2 bg-violet-50/90 text-zinc-800 ring-1 ring-violet-100/80'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <AssistantRichText text={msg.text} />
                  )}
                  {msg.source ? (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-violet-600/80">
                      {msg.source === 'remote' ? 'Connected model / server' : 'On-device reasoning'}
                    </p>
                  ) : null}
                  {msg.picks?.length ? (
                    <div className="mt-3 flex flex-col gap-1.5 border-t border-violet-200/60 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-800/80">Quick picks</p>
                      {msg.picks.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => {
                            onSelectEvent?.(e.id);
                            doClose();
                          }}
                          className="rounded-lg bg-white px-2 py-1.5 text-left text-xs font-bold text-violet-950 ring-1 ring-violet-200 hover:bg-violet-100"
                        >
                          {e.title}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {busy ? (
                <p className="text-center text-xs font-medium text-zinc-400" aria-live="polite">
                  Thinking…
                </p>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-zinc-100 p-3">
              {onOpenPlanMyNight ? (
                <button
                  type="button"
                  onClick={() => {
                    onOpenPlanMyNight();
                    doClose();
                  }}
                  className="mb-2 w-full rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100"
                >
                  Open structured “Plan my night” form
                </button>
              ) : null}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Ask anything about your loaded events…"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  disabled={busy}
                  aria-label="Message to planning assistant"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
