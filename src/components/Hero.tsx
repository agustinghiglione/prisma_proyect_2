import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { AREAS, irAArea } from '../data/areas';

interface HeroProps {
  onStartDiagnostic: () => void;
  onConsultar: () => void;
}

const CHECKS = ['Diagnóstico gratis', 'Primera conversación sin costo', '100% virtual'];

export default function Hero({ onStartDiagnostic, onConsultar }: HeroProps) {
  return (
    <section id="inicio" className="relative flex min-h-[92vh] items-center overflow-hidden">
      <motion.img
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        src="/img/foto_main.png"
        alt="Amanecer sobre el mar"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/85 via-primary-dark/55 to-primary-dark/10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-sand" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 pt-28 pb-20 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Consultora Prisma · Consultoría integral para negocios
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Un solo equipo para todo lo que tu negocio necesita.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Reunimos profesionales de estrategia, finanzas, administración, capital humano,
            contabilidad e impuestos y tecnología. Contanos qué necesitás y sumamos al especialista indicado para tu
            caso.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={onConsultar}
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-primary-dark shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Contanos tu consulta
            </button>
            <button
              onClick={onStartDiagnostic}
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Diagnóstico gratis en 1 minuto
            </button>
          </div>

          <div className="mt-8">
            <p className="text-sm text-white/70">¿Sobre qué es tu consulta?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button
                  key={a.slug}
                  onClick={() => irAArea(a.slug)}
                  className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <a.icon size={14} strokeWidth={2} />
                  {a.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {CHECKS.map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-white/80">
                <Check size={16} className="text-green" strokeWidth={3} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
