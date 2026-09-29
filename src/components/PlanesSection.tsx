import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PLANES,
  DESCUENTO_LANZAMIENTO,
  VIGENCIA_PROMO,
  formatoPesos,
  precioConDescuento,
  type Plan,
} from '../data/planes';

/**
 * Planes v3: cajas fijas, sin arrastre ni scroll horizontal.
 * - Escritorio: las cuatro en fila, mismo tamaño de base. La seleccionada
 *   (flechas o clic) se agranda y muestra lo que incluye.
 * - Celular: una debajo de la otra; al tocar una se despliega.
 * - "A Medida" no muestra precio: se pacta en la primera conversación.
 */
interface PlanesSectionProps {
  onConsultar: (contexto: string) => void;
}

const PORCENTAJE = Math.round(DESCUENTO_LANZAMIENTO * 100);

function Precio({ plan, grande }: { plan: Plan; grande: boolean }) {
  if (plan.precioLista === null) {
    return (
      <div>
        <p className="text-xs text-ink-soft">Precio</p>
        <p className={`font-heading font-extrabold text-primary ${grande ? 'text-2xl' : 'text-xl'}`}>A convenir</p>
      </div>
    );
  }
  return (
    <div>
      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <span className="line-through">{formatoPesos(plan.precioLista)}</span>
        <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-primary-dark">-{PORCENTAJE}%</span>
      </p>
      <p className={`font-heading font-extrabold text-primary ${grande ? 'text-3xl' : 'text-2xl'}`}>
        <span className="mr-1 text-xs font-medium text-ink-soft">desde</span>
        {formatoPesos(precioConDescuento(plan.precioLista))}
        <span className="ml-1 text-xs font-medium text-ink-soft">{plan.unidad}</span>
      </p>
    </div>
  );
}

function Tarjeta({
  plan,
  activa,
  onSelect,
  onConsultar,
}: {
  plan: Plan;
  activa: boolean;
  onSelect: () => void;
  onConsultar: () => void;
}) {
  const Icon = plan.icon;
  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-expanded={activa}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? onSelect() : undefined)}
      className={`relative flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-6 text-left transition-[box-shadow,border-color] duration-500 ${
        activa
          ? 'border-primary shadow-[0_24px_50px_-20px_rgba(34,60,84,0.45)] lg:flex-[1.6]'
          : 'border-border shadow-soft hover:border-primary/40 lg:h-[410px] lg:flex-1'
      }`}
    >
      <motion.div layout="position" className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <p className="font-heading text-base font-bold text-ink">{plan.title}</p>
      </motion.div>

      <motion.div layout="position" className="mt-4">
        <Precio plan={plan} grande={activa} />
      </motion.div>

      <motion.div layout="position" className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Áreas</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {plan.areas.map((a) => (
            <span key={a} className="rounded-full bg-surface/60 px-2.5 py-1 text-xs text-ink">
              {a}
            </span>
          ))}
        </div>
        {plan.notaAreas && <p className="mt-2 text-xs text-ink-soft">{plan.notaAreas}</p>}
      </motion.div>

      <AnimatePresence initial={false}>
        {activa && (
          <motion.div
            key="detalle"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45, delay: 0.2 },
            }}
            className="overflow-hidden"
          >
            <p className="mt-5 text-sm leading-relaxed text-ink">{plan.paraQuien}</p>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-sand px-3.5 py-3 text-sm leading-relaxed text-ink-soft">
              <CalendarClock size={16} className="mt-0.5 shrink-0 text-primary" />
              {plan.seguimiento}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConsultar();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Consultar por este plan <ArrowRight size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!activa && (
        <p className="mt-auto pt-5 text-xs font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4">
          Ver más
        </p>
      )}
    </motion.div>
  );
}

export default function PlanesSection({ onConsultar }: PlanesSectionProps) {
  const [activa, setActiva] = useState(0);
  const mover = (d: number) => setActiva((i) => Math.max(0, Math.min(PLANES.length - 1, i + d)));

  return (
    <section id="planes" className="bg-sand px-6 pt-10 pb-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          Un plan para cada momento del negocio.
        </h2>

        <div className="mt-12 flex items-center gap-3">
          <button
            type="button"
            onClick={() => mover(-1)}
            disabled={activa === 0}
            aria-label="Plan anterior"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink shadow-soft transition hover:bg-surface disabled:opacity-30 lg:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
            {PLANES.map((plan, i) => (
              <Tarjeta
                key={plan.title}
                plan={plan}
                activa={i === activa}
                onSelect={() => setActiva(i)}
                onConsultar={() => onConsultar(`Me interesa el plan ${plan.title}: `)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => mover(1)}
            disabled={activa === PLANES.length - 1}
            aria-label="Plan siguiente"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink shadow-soft transition hover:bg-surface disabled:opacity-30 lg:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-soft">
          Precios de lanzamiento en pesos argentinos, válidos hasta el {VIGENCIA_PROMO}. Valores de
          referencia: el alcance y el precio final se acuerdan en la primera conversación.
        </p>
      </div>
    </section>
  );
}
