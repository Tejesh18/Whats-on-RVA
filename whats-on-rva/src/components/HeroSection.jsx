import { siteConfig } from '../config/siteConfig.js';

/** Richmond skyline — Unsplash (Stephen Poore), free to use under Unsplash License */
const HERO_IMAGE_SRC =
  'https://images.unsplash.com/photo-1575474007145-7bc306677fa4?auto=format&fit=crop&w=1400&q=82';
const HERO_IMAGE_CREDIT_HREF = 'https://unsplash.com/photos/gpqV6TcGWmk';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-rva-brick/20 bg-rva-slate"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-rva-hero-glow opacity-[0.97]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-rva-brick/20 blur-3xl lg:opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rva-gold">
              {siteConfig.regionLabel}
            </p>
            <h1
              id="hero-heading"
              className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Live listings.{' '}
              <span className="bg-gradient-to-r from-rva-gold via-white to-[#a8cdd9] bg-clip-text text-transparent">
                One RVA.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Virginia&apos;s capital on the <strong className="font-semibold text-zinc-200">James</strong> — concerts,
              galleries, theater, and nights out scoped to{' '}
              <strong className="font-semibold text-zinc-200">Richmond city limits</strong> (not the whole metro). Use{' '}
              <strong className="font-semibold text-zinc-200">Events</strong>,{' '}
              <strong className="font-semibold text-zinc-200">RVA stories</strong>, or{' '}
              <strong className="font-semibold text-zinc-200">Plan your night</strong> below.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#browse-events"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-zinc-100"
              >
                Browse events
              </a>
              <a
                href="#why-us"
                className="inline-flex items-center justify-center rounded-full border border-rva-gold/55 bg-rva-gold/10 px-6 py-3 text-sm font-bold text-[#f5e6b8] transition hover:border-rva-gold hover:bg-rva-gold/20"
              >
                Why us
              </a>
              <span className="inline-flex items-center rounded-full border border-rva-james/40 bg-rva-river/25 px-4 py-3 text-xs font-medium text-zinc-300">
                Map · neighborhoods · plan
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/15 sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[3/4]">
              <img
                src={HERO_IMAGE_SRC}
                alt="Richmond, Virginia skyline and the James River waterfront"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                width={1400}
                height={1050}
                decoding="async"
                fetchPriority="high"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/15 to-transparent"
                aria-hidden
              />
              <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-xs font-semibold text-white/95 drop-shadow-md sm:bottom-4 sm:left-5">
                Downtown RVA · James River
              </p>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-500 lg:text-left">
              Photo{' '}
              <a
                href={HERO_IMAGE_CREDIT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-400 underline-offset-2 hover:text-rva-gold hover:underline"
              >
                Stephen Poore
              </a>
              {' / '}
              <a
                href="https://unsplash.com/license"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-400 underline-offset-2 hover:text-rva-gold hover:underline"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
