import { motion } from 'framer-motion';
import { PILARES, EQUIPO } from '../data/porque';
import FacetPatternVisual from './visuals/FacetPatternVisual';

export default function PorQueSection() {
  return (
    <section id="por-que-prisma" className="relative overflow-hidden px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary"
          >
            ¿Por qué Prisma?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-3xl font-bold text-primary sm:text-4xl"
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
              className="rounded-2xl border border-border bg-white p-7"
            >
              <Icon size={24} className="text-secondary" strokeWidth={1.75} />
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
          className="relative mt-20 overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center sm:px-14"
        >
          <FacetPatternVisual />
          <p className="relative font-heading text-xl font-semibold text-white sm:text-2xl">
            Un equipo multidisciplinario, pensando tu negocio desde todos sus ángulos.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-6">
            {EQUIPO.map((persona) => (
              <div key={persona.initials} className="flex flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 font-heading text-sm font-bold text-white backdrop-blur-sm">
                  {persona.initials}
                </span>
                <span className="max-w-[6.5rem] text-xs text-white/70">{persona.area}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
