import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { PLANES, type Plan } from '../data/planes';

// Tamaño fijo — ancho Y alto — para que las 4 tarjetas sean siempre
// idénticas entre sí, con independencia de cuánto texto tenga cada una (la
// que tiene menos contenido simplemente deja espacio en blanco abajo). Un
// poco más angostas y más altas que antes: menos ancho para que la
// tarjeta seleccionada tenga margen de sobra para agrandarse sin
// recortarse contra el borde de la fila, y más alto para darle lugar al
// texto de "para quién es" sin apretar.
const CARD_WIDTH = 200;
const CARD_HEIGHT = 320;

// Distancia de arrastre (en px) a partir de la cual un swipe con mouse
// cuenta como "cambiar de tarjeta seleccionada" — las posiciones de las
// tarjetas son fijas, así que arrastrar no mueve nada, solo decide si vas
// una tarjeta para adelante o para atrás.
const SWIPE_THRESHOLD = 40;

// Patrón vertical del "destello" que recorre el borde cuando hay scroll o
// se elige una tarjeta: azul, banda blanca al medio (el reflejo), azul de
// nuevo — se repite cada 160px para que nunca "saltee" al hacer loop.
const BEAM_GRADIENT =
  'linear-gradient(180deg, #345b78 0%, #345b78 30%, #eaf6ff 50%, #345b78 70%, #345b78 100%)';
const BEAM_TILE = '160px';

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  beamY: MotionValue<string>;
  beamOpacity: MotionValue<number>;
}

function PlanCard({ plan, isActive, beamY, beamOpacity }: PlanCardProps) {
  const Icon = plan.icon;

  return (
    <motion.div
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, zIndex: isActive ? 10 : 1 }}
      className={`relative shrink-0 rounded-2xl bg-primary p-[2px] transition-shadow duration-300 ${
        isActive
          ? 'shadow-[0_0_24px_-8px_rgba(52,91,120,0.45)]'
          : 'shadow-[0_0_12px_-8px_rgba(52,91,120,0.18)]'
      }`}
    >
      {/*
        El borde en reposo es 100% azul (el bg-primary del wrapper). Esta
        capa es el "destello": el mismo patrón pero con una banda blanca,
        que solo se hace visible (opacity) mientras hay scroll o se elige
        una tarjeta, y se apaga sola a los pocos milisegundos de quedar
        quieto. Queda detrás del contenido blanco, así que solo se asoma en
        el aro de 2px del borde.
      */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          backgroundImage: BEAM_GRADIENT,
          backgroundSize: `100% ${BEAM_TILE}`,
          backgroundRepeat: 'repeat',
          backgroundPositionY: beamY,
          opacity: beamOpacity,
        }}
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <p className="mt-4 font-heading text-base font-semibold text-ink">{plan.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{plan.paraQuien}</p>
        <ul className="mt-3 flex-1 space-y-2 text-sm leading-relaxed text-ink-soft">
          {plan.incluye.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function PlanesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const idleTimerRef = useRef<number | undefined>(undefined);

  // Posición del destello: atada al scroll vertical de la página, recorre
  // toda la sección de punta a punta.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const beamY = useTransform(scrollYProgress, [0, 1], ['0px', '400px']);

  // Visibilidad del destello: 0 en reposo (borde 100% azul — el estado en
  // el que debe quedar mientras el usuario está viendo la sección
  // tranquilo). Sube a 1 apenas hay scroll de la página o se elige una
  // tarjeta, y se apaga sola con un fundido si no pasa nada más.
  const beamOpacity = useMotionValue(0);

  const triggerFlash = () => {
    animate(beamOpacity, 1, { duration: 0.15, ease: 'easeOut' });
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      animate(beamOpacity, 0, { duration: 0.6, ease: 'easeOut' });
    }, 300);
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', triggerFlash);
    return () => {
      unsubscribe();
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollYProgress]);

  const clampIndex = (i: number) => Math.max(0, Math.min(PLANES.length - 1, i));

  // Las posiciones de las 4 tarjetas son fijas — "desplazarse" no mueve
  // nada, solo cambia cuál está agrandada. Si en una pantalla angosta el
  // fondo tuvo que scrollear para acomodarlas, esto además la trae a la
  // vista — pero eso es un respaldo para mobile, no el mecanismo principal.
  const selectIndex = (index: number) => {
    const clamped = clampIndex(index);
    setActiveIndex(clamped);
    triggerFlash();
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  // Swipe con mouse: no arrastra nada (las tarjetas no se mueven), solo
  // mide la dirección al soltar y avanza o retrocede una tarjeta. El touch
  // nativo sigue scrolleando la fila si en mobile no entran las 4.
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartXRef.current = e.pageX;
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const delta = e.pageX - dragStartXRef.current;
    if (delta <= -SWIPE_THRESHOLD) {
      selectIndex(activeIndex + 1);
    } else if (delta >= SWIPE_THRESHOLD) {
      selectIndex(activeIndex - 1);
    }
  };

  const handleMouseLeave = () => {
    draggingRef.current = false;
  };

  const scrollToContacto = () => {
    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="planes"
      className="overflow-hidden bg-surface px-6 py-28 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            Un plan para cada momento del negocio.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 leading-relaxed text-ink-soft"
          >
            Cuatro estructuras que ya tenemos armadas — el punto de partida se ajusta siempre en
            la primera conversación, sin costo.
          </motion.p>
        </div>

        {/*
          Fila centrada, con las flechas como hermanas (no superpuestas) a
          los costados — el gap entre ellas y las tarjetas es el margen que
          pidió Damian. El padding horizontal de la fila (px-4) es lo que le
          da lugar a la tarjeta de la punta para agrandarse un 5% y tirar
          sombra sin que el borde del contenedor se lo corte.
        */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => selectIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Plan anterior"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink shadow-soft transition hover:bg-surface disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={rowRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="no-scrollbar flex max-w-full cursor-grab items-start gap-5 overflow-x-auto px-4 py-2 active:cursor-grabbing"
          >
            {PLANES.map((plan, i) => (
              <div
                key={plan.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <PlanCard
                  plan={plan}
                  isActive={i === activeIndex}
                  beamY={beamY}
                  beamOpacity={beamOpacity}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => selectIndex(activeIndex + 1)}
            disabled={activeIndex === PLANES.length - 1}
            aria-label="Plan siguiente"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink shadow-soft transition hover:bg-surface disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {PLANES.map((plan, i) => (
            <button
              key={plan.title}
              type="button"
              onClick={() => selectIndex(i)}
              aria-label={`Ir al plan ${plan.title}`}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-white'
              }`}
            />
          ))}
        </div>

        {/*
          Recordatorio ligado a la tarjeta seleccionada: los módulos de
          cualquier plan se pueden sumar o sacar, y el esqueleto real se
          define en la primera conversación — para que no se lea como una
          lista de precios cerrada.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto mt-6 flex max-w-xl items-start gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-left"
          >
            <Info size={16} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">{PLANES[activeIndex].title}</span> es un
              punto de partida: los módulos se suman o se sacan según tu negocio. En la primera
              conversación definimos juntos el esqueleto con el que vamos a trabajar.
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <button
            onClick={scrollToContacto}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Conversemos sobre tu plan <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
