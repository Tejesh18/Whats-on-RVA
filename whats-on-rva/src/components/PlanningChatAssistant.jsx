import { useEffect, useId, useRef, useState } from 'react';
import { getPlanningAssistantReply } from '../lib/planningAssistantReply.js';

/** Renders assistant text: ### headings, **bold**, _italic_ */
function AssistantRichText({ text }) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={bi} className="mt-3 first:mt-0 font-display text-sm font-bold text-rva-river">
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
        'Hi — I’m your **RVA night-out copilot**.',
        '',
        'Ask in plain English. I only see **what’s already loaded** from Richmond feeds in this tab, answer in full sentences, and point to concrete listings when they match.',
        '',
        'Try: “Two of us, **free**, outdoors **Saturday afternoon** near the James” or “**Jazz** around **Jackson Ward** tonight after dinner on Broad.”',
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
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full bg-gradient-to-r from-rva-brick to-rva-river py-3 pl-3.5 pr-5 text-white shadow-lg shadow-rva-slate/35 ring-2 ring-white/90 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-rva-gold/55 sm:bottom-6 sm:right-6"
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
            className="relative flex h-[min(100dvh,560px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-rva-river/15 bg-white shadow-2xl sm:h-[min(560px,88vh)] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-rva-river to-rva-james px-4 py-3 text-white">
              <div>
                <p className="font-display text-lg font-bold">Planning assistant</p>
                <p className="text-[11px] font-medium text-white/85">
                  RVA listings · chat answers · optional server AI
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
                      ? 'ml-6 bg-rva-river text-white'
                      : 'mr-2 bg-rva-cream/95 text-zinc-800 ring-1 ring-rva-river/12'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <AssistantRichText text={msg.text} />
                  )}
                  {msg.source ? (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-rva-james">
                      {msg.source === 'remote' ? 'Connected model / server' : 'On-device reasoning'}
                    </p>
                  ) : null}
                  {msg.picks?.length ? (
                    <div className="mt-3 flex flex-col gap-1.5 border-t border-rva-river/15 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-rva-river">Quick picks</p>
                      {msg.picks.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => {
                            onSelectEvent?.(e.id);
                            doClose();
                          }}
                          className="rounded-lg bg-white px-2 py-1.5 text-left text-xs font-bold text-rva-slate ring-1 ring-rva-river/20 hover:bg-rva-cream"
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
                  className="mb-2 w-full rounded-xl border border-rva-gold/40 bg-[#faf6e8] py-2 text-xs font-bold text-rva-brick-deep hover:bg-rva-gold/15"
                >
                  Open structured “Plan my night” form
                </button>
              ) : null}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Ask about tonight in RVA, the Fan, free stuff, kids…"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-rva-river focus:ring-2 focus:ring-rva-river/20"
                  disabled={busy}
                  aria-label="Message to planning assistant"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="shrink-0 rounded-xl bg-rva-river px-4 py-2 text-sm font-bold text-white hover:bg-rva-river-light disabled:opacity-40"
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
