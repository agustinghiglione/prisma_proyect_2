import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CRUCES, moduloPorSlug } from '../data/modulos';

/**
 * "Cuando las áreas se cruzan" (referente: la sección Sinergia de Cuenta
 * Norte). Mostramos el negocio por módulos, pero la firma de Prisma es
 * conectarlos: cada tarjeta es un ejemplo de dos módulos trabajando juntos.
 */
export default function CrucesSection() {
  return (
    <section id="cruces" className="bg-sand px-6 pb-20 lg:px-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark to-primary px-7 py-12 sm:px-12">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">La firma Prisma</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Cuando las áreas se cruzan, tu negocio avanza.
          </h2>
          <p className="mt-4 leading-relaxed text-white/80">
            Te mostramos Prisma por módulos, pero lo que nos distingue es conectarlos. Un mismo
            equipo ve tus números, tus procesos y tu tecnología juntos. Algunos ejemplos:
          </p>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-3">
          {CRUCES.map((c, i) => (
            <motion.article
              key={c.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {c.modulos.map((slug, j) => {
                  const m = moduloPorSlug(slug)!;
                  return (
                    <span key={slug} className="flex items-center gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/40"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.nombre}
                      </span>
                      {j < c.modulos.length - 1 && <X size={12} className="text-gold" strokeWidth={3} />}
                    </span>
                  );
                })}
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-white">{c.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{c.texto}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
