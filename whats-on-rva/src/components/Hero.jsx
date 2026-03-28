/**
 * Product title, promise, and one-line positioning for the demo.
 */
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-rva-slate/10 bg-gradient-to-br from-rva-river via-rva-river to-rva-brick text-white"
      aria-labelledby="hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1
          id="hero-title"
          className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          What&apos;s On RVA
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
          Discover Richmond arts and cultural events in one place.
        </p>
        <p className="mt-4 max-w-2xl border-l-4 border-rva-gold/90 pl-4 text-base font-medium leading-relaxed text-white/95 sm:text-lg">
          A source-linked discovery app for Richmond arts and cultural events.
        </p>
      </div>
    </section>
  );
}
