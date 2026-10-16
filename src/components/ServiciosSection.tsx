import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Check, MessageCircleQuestion } from 'lucide-react';
import { AREAS, type Area } from '../data/areas';
import { moduloPorSlug } from '../data/modulos';

interface ServiciosSectionProps {
  onConsultar: (contexto: string) => void;
}

const area = (slug: string) => AREAS.find((a) => a.slug === slug)!;
const GESTION = ['administracion', 'finanzas', 'estrategia', 'capital-humano'];

/**
 * Servicios en tres bloques (referente: Cuenta Norte): los dos módulos
 * principales —Contabilidad e Impuestos y Tecnología— con su lista completa,
 * y "Gestión del negocio" con las otras cuatro áreas, cada una con su
 * especialista del equipo. Los ids `area-<slug>` los usan los chips del Hero.
 */
export default function ServiciosSection({ onConsultar }: ServiciosSectionProps) {
  return (
    <section id="servicios" className="bg-sand px-6 pt-8 pb-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Servicios</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Si es parte de tu negocio, tiene solución.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Contabilidad e impuestos y tecnología son nuestra base. Para todo lo demás, cada área
            tiene su especialista dentro del equipo Prisma.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <BloquePrincipal
            numero="01"
            etiqueta="Núcleo contable"
            a={area('contabilidad')}
            onConsultar={onConsultar}
          />
          <BloquePrincipal
            numero="02"
            etiqueta="Tecnología a medida"
            a={area('tecnologia')}
            onConsultar={onConsultar}
            extra={
              <a
                href="#tecnologia"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Ver web en 3 días, análisis de tu web y automatizaciones <ArrowRight size={14} />
              </a>
            }
          />
        </div>

        {/* 03 · Gestión del negocio */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-3xl border border-border bg-white p-7 shadow-soft sm:p-9"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">03 · Visión integral</p>
              <h3 className="mt-2 flex items-center gap-3 font-heading text-2xl font-bold text-ink">
                <Briefcase size={22} className="text-primary" strokeWidth={1.75} />
                Gestión del negocio
              </h3>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Administración, finanzas, estrategia y capital humano: pensamos el negocio más allá
                de los números del mes.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GESTION.map((slug) => {
              const a = area(slug);
              const color = moduloPorSlug(slug)?.color;
              return (
                <div
                  key={slug}
                  id={`area-${slug}`}
                  className="scroll-mt-28 rounded-2xl border border-border bg-background p-5"
                  style={{ borderTopColor: color, borderTopWidth: 3 }}
                >
                  <p className="flex items-center gap-2 font-heading font-semibold text-ink">
                    <a.icon size={17} strokeWidth={1.75} style={{ color }} />
                    {a.nombre}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{a.promesa}</p>
                  <ul className="mt-4 grid gap-2">
                    {a.temas.slice(0, 4).map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm leading-snug text-ink">
                        <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onConsultar(`Mi consulta es sobre ${a.nombre}: `)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Consultar <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.article>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary-dark px-7 py-6 text-white sm:flex-row sm:items-center">
          <p className="font-heading text-lg font-semibold">
            ¿No ves tu caso? Contanos igual: para eso está el equipo.
          </p>
          <button
            onClick={() => onConsultar('')}
            className="shrink-0 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5"
          >
            Contanos qué pasa
          </button>
        </div>
      </div>
    </section>
  );
}

function BloquePrincipal({
  numero,
  etiqueta,
  a,
  onConsultar,
  extra,
}: {
  numero: string;
  etiqueta: string;
  a: Area;
  onConsultar: (contexto: string) => void;
  extra?: React.ReactNode;
}) {
  const color = moduloPorSlug(a.slug)?.color;
  return (
    <motion.article
      id={`area-${a.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
          {numero} · {etiqueta}
        </p>
        <h3 className="mt-2 flex items-center gap-3 font-heading text-2xl font-bold text-ink">
          <a.icon size={22} strokeWidth={1.75} style={{ color }} />
          {a.nombre}
        </h3>
        <p className="mt-2 leading-relaxed text-ink-soft">{a.promesa}</p>

        <ul className="mt-6 grid gap-2.5">
          {a.temas.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
              <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {a.preguntas.map((q) => (
            <span
              key={q}
              className="flex items-center gap-1.5 rounded-full bg-surface/50 px-3 py-1.5 text-xs text-ink"
            >
              <MessageCircleQuestion size={13} className="text-primary" />
              {q}
            </span>
          ))}
        </div>

        {extra}

        <div className="mt-auto pt-8">
          <button
            onClick={() => onConsultar(`Mi consulta es sobre ${a.nombre}: `)}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: color }}
          >
            Consultar sobre {a.nombre} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
