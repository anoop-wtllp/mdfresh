import { JOURNEY } from "@/lib/media";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * The six stages as plain, readable text.
 *
 * The film above says the same thing, but only to someone who can scrub it —
 * this is the version that survives a screen reader, a printout, and a crawler.
 */
export function ProcessSteps() {
  return (
    <section
      aria-labelledby="steps-heading"
      className="border-t rule py-28 sm:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-6">Manufacturing process</p>
          </Reveal>
          <RevealWords
            as="h2"
            id="steps-heading"
            text="Six stages, sourcing to storage."
            className="font-display text-[length:var(--text-title)] font-semibold leading-[1.05] text-frost"
          />
        </div>

        <ol className="grid gap-px overflow-hidden rounded-2xl border rule bg-[color-mix(in_oklab,var(--color-frost)_12%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
          {JOURNEY.map((step, i) => (
            <Reveal
              key={step.id}
              delay={(i % 3) * 0.08}
              as="li"
              className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-10"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-frost-mute">
                {step.index}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-frost">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-frost-dim">
                {step.body}
              </p>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-pea transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
