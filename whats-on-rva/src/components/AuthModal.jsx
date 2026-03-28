import { useEffect, useId, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ open, onClose, initialTab = 'signin' }) {
  const { login, register } = useAuth();
  const titleId = useId();
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setError('');
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      if (tab === 'signin') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose?.();
      setPassword('');
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
        <div className="border-b border-white/10 px-6 pb-4 pt-5">
          <h2 id={titleId} className="font-display text-xl font-bold tracking-tight">
            {tab === 'signin' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Saved on this browser only — use a real backend when you launch widely.
          </p>
        </div>

        <div className="flex gap-1 border-b border-white/10 px-4">
          {[
            { id: 'signin', label: 'Sign in' },
            { id: 'signup', label: 'Register' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setError('');
              }}
              className={`relative flex-1 py-3 text-sm font-semibold transition ${
                tab === t.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
              {tab === t.id ? (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
              ) : null}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="auth-email" className="mb-1 block text-xs font-semibold text-zinc-400">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none ring-amber-400/0 transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30"
              required
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="mb-1 block text-xs font-semibold text-zinc-400">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none ring-amber-400/0 transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30"
              required
              minLength={6}
            />
          </div>
          {error ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-orange-500/20 transition hover:brightness-105 disabled:opacity-50"
            >
              {pending ? '…' : tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
