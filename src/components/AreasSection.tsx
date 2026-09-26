import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, MessageCircleQuestion } from 'lucide-react';
import { AREAS, EVENTO_AREA } from '../data/areas';

interface AreasSectionProps {
  onConsultar: (contexto: string) => void;
}

export default function AreasSection({ onConsultar }: AreasSectionProps) {
  const [activa, setActiva] = useState(AREAS[0].slug);

  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (AREAS.some((a) => a.slug === slug)) setActiva(slug);
    };
    window.addEventListener(EVENTO_AREA, handler);
    return () => window.removeEventListener(EVENTO_AREA, handler);
  }, []);

  const area = AREAS.find((a) => a.slug === activa) ?? AREAS[0];
  const Icon = area.icon;

  return (
    <section id="areas" className="bg-background px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            Una sola puerta para todo tu negocio.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            No tenés que saber a quién llamar. Elegí el tema o contanos tu situación: sumamos al
            profesional de cada área que tu caso necesite.
          </p>
        </div>

        {/* Selector de áreas: fila con scroll horizontal en mobile, columna en desktop */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div
            role="tablist"
            aria-label="Áreas de Consultora Prisma"
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {AREAS.map((a) => {
              const seleccionada = a.slug === activa;
              return (
                <button
                  key={a.slug}
                  role="tab"
                  aria-selected={seleccionada}
                  onClick={() => setActiva(a.slug)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    seleccionada
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-white text-ink hover:border-primary/40'
                  }`}
                >
                  <a.icon size={18} strokeWidth={1.75} />
                  {a.nombre}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={area.slug}
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-border bg-white p-7 shadow-soft sm:p-9"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-bold">{area.nombre}</h3>
                  <p className="text-sm text-ink-soft">{area.promesa}</p>
                </div>
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-primary">
                Te ayudamos con
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {area.temas.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                    <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                    {t}
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-primary">
                Consultas que nos podés traer
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {area.preguntas.map((q) => (
                  <span
                    key={q}
                    className="flex items-center gap-1.5 rounded-full bg-surface/60 px-3.5 py-1.5 text-sm text-ink"
                  >
                    <MessageCircleQuestion size={14} className="text-primary" />
                    {q}
                  </span>
                ))}
              </div>

              {area.nota && <p className="mt-6 text-sm italic text-ink-soft">{area.nota}</p>}

              <button
                onClick={() => onConsultar(`Mi consulta es sobre ${area.nombre}: `)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Consultar sobre {area.nombre} <ArrowRight size={16} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          ¿Tu consulta toca varias áreas? Es lo más común: la vemos entre todos, en una misma
          conversación.
        </p>
      </div>
    </section>
  );
}
