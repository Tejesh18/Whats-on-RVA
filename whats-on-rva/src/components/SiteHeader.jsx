import { useState } from 'react';
import { siteConfig } from '../config/siteConfig.js';
import { useAuth } from '../context/AuthContext.jsx';
import AuthModal from './AuthModal.jsx';

const link =
  'text-xs font-semibold text-zinc-400 transition hover:text-rva-gold sm:text-sm';

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [auth, setAuth] = useState({ open: false, tab: 'signin' });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rva-brick/25 bg-rva-slate/92 text-white backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <a href="#" className="block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rva-gold">
                  RVA · James River city · listings in city limits
                </p>
                <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {siteConfig.siteName}
                </p>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0">
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Site">
                <a href="#contact" className={link}>
                  Contact
                </a>
                <a href="#privacy" className={link}>
                  Privacy
                </a>
                <a href="#terms" className={link}>
                  Terms
                </a>
              </nav>

              <div className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />

              {user ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="max-w-[160px] truncate text-xs text-zinc-400" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuth({ open: true, tab: 'signin' })}
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:text-white"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuth({ open: true, tab: 'signup' })}
                    className="rounded-full bg-gradient-to-r from-rva-brick to-rva-river px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:brightness-110"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        open={auth.open}
        onClose={() => setAuth((s) => ({ ...s, open: false }))}
        initialTab={auth.tab}
      />
    </>
  );
}
