import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { AREAS, irAArea } from '../data/areas';
import PrismaHero from './visuals/PrismaHero';

interface HeroProps {
  onStartDiagnostic: () => void;
  onConsultar: () => void;
}

const CHECKS = ['Diagnóstico gratis', 'Primera conversación sin costo', '100% virtual'];

export default function Hero({ onStartDiagnostic, onConsultar }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-surface/40"
    >
      {/* halo suave detrás del prisma */}
      <div className="pointer-events-none absolute top-24 -right-40 h-[520px] w-[520px] rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pt-28 pb-16 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:px-10 lg:pt-32 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Consultoría integral para negocios
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-primary-dark sm:text-5xl">
            Un solo equipo para todo lo que tu negocio necesita.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Como un prisma: tu consulta entra por una sola puerta y la miramos desde cada área.
            Estrategia, finanzas, administración, personas, contabilidad e impuestos y tecnología,
            con el especialista indicado para tu caso.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onConsultar}
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Contanos tu consulta
            </button>
            <button
              onClick={onStartDiagnostic}
              className="rounded-full border border-primary/30 px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5"
            >
              Diagnóstico gratis en 1 minuto
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {CHECKS.map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-ink-soft">
                <Check size={16} className="text-green" strokeWidth={3} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Prisma: con etiquetas en escritorio, sin etiquetas + chips en celular */}
        <div>
          <div className="hidden lg:block">
            <PrismaHero />
          </div>
          <div className="mx-auto max-w-sm lg:hidden">
            <PrismaHero conEtiquetas={false} />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 lg:hidden">
            {AREAS.map((a) => (
              <button
                key={a.slug}
                onClick={() => irAArea(a.slug)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-ink"
              >
                <a.icon size={14} strokeWidth={2} className="text-primary" />
                {a.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
