import { useEffect, useId, useRef, useState } from 'react';
import { getPlanningAssistantReply } from '../lib/planningAssistantReply.js';

export default function PlanningChatAssistant({ events, onSelectEvent, onOpenPlanMyNight }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: "Hi — I'm your Richmond planning assistant. Ask about tonight, the weekend, a neighborhood, jazz, free stuff, or family-friendly picks. I read the events already loaded in this page.",
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
      if (e.key === 'Escape') setOpen(false);
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
        { role: 'assistant', text: 'Something went wrong — try again in a moment.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-2xl shadow-lg shadow-violet-900/30 ring-2 ring-white/90 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
        aria-expanded={open}
        aria-controls={panelId}
        title="Open planning assistant"
      >
        <span aria-hidden>💬</span>
        <span className="sr-only">Planning assistant</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-end sm:items-end sm:justify-end sm:p-6" role="dialog" aria-modal="true" aria-label="Planning assistant">
          <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-label="Close assistant" onClick={() => setOpen(false)} />
          <div
            id={panelId}
            className="relative flex h-[min(100dvh,560px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:h-[min(520px,85vh)] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-violet-700 to-indigo-800 px-4 py-3 text-white">
              <div>
                <p className="font-display text-lg font-bold">Plan helper</p>
                <p className="text-[11px] font-medium text-violet-100/90">
                  On-device matching · optional AI URL via env
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-6 bg-zinc-900 text-white'
                      : 'mr-4 bg-violet-50 text-zinc-800 ring-1 ring-violet-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.source ? (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-violet-600/80">
                      {msg.source === 'remote' ? 'AI / server reply' : 'Local suggestions'}
                    </p>
                  ) : null}
                  {msg.picks?.length ? (
                    <div className="mt-2 flex flex-col gap-1.5 border-t border-violet-200/60 pt-2">
                      {msg.picks.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => {
                            onSelectEvent?.(e.id);
                            setOpen(false);
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
                    setOpen(false);
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
                  placeholder="e.g. Free jazz tonight near Church Hill"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-amber-400/0 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
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
