import { useState } from 'react';
import { motion } from 'framer-motion';
import { PILARES, EQUIPO } from '../data/porque';
import FacetPatternVisual from './visuals/FacetPatternVisual';

export default function PorQueSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? EQUIPO[activeIndex] : null;

  return (
    <section id="por-que-prisma" className="relative overflow-hidden bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            No se trata de nuestra historia. Se trata de tu confianza.
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map(({ icon: Icon, title, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-background p-7"
            >
              <Icon size={24} className="text-primary" strokeWidth={1.75} />
              <p className="mt-4 font-heading text-lg font-semibold text-ink">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-prisma px-8 py-14 text-center sm:px-14"
        >
          <FacetPatternVisual />
          <p className="relative font-heading text-xl font-semibold text-white sm:text-2xl">
            Un equipo multidisciplinario, pensando tu negocio desde todos sus ángulos.
          </p>
          <p className="relative mt-2 text-sm text-white/60">Tocá cada área para conocer más.</p>

          <div className="relative mt-10 flex flex-wrap justify-center gap-6">
            {EQUIPO.map((persona, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={persona.initials}
                  onClick={() => setActiveIndex(isActive ? null : i)}
                  className="flex flex-col items-center gap-2"
                  aria-pressed={isActive}
                >
                  <span className="relative flex h-14 w-14 items-center justify-center">
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-gold/40"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                      />
                    )}
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border font-heading text-sm font-bold backdrop-blur-sm transition-colors ${
                        isActive
                          ? 'border-gold bg-gold text-primary-dark'
                          : 'border-white/25 bg-white/10 text-white hover:border-gold/70'
                      }`}
                    >
                      {persona.initials}
                    </span>
                  </span>
                  <span className={`max-w-[6.5rem] text-xs ${isActive ? 'text-gold' : 'text-white/70'}`}>
                    {persona.area}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative mx-auto mt-8 min-h-[3.5rem] max-w-md">
            {active && (
              <motion.p
                key={active.initials}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85"
              >
                <span className="font-semibold text-white">{active.area}.</span> {active.detail}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
