import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Gauge } from 'lucide-react';
import { AREAS, irAArea } from '../data/areas';
import { moduloPorSlug } from '../data/modulos';

interface HeroProps {
  onStartDiagnostic: () => void;
  onConsultar: () => void;
}

const CHECKS = ['Diagnóstico gratis', 'Primera conversación sin costo'];

/*
 * Geometría del prisma en la foto (public/img/foto_prisma, 1535 × 1024).
 * La luz dorada (tu consulta) entra por la cara izquierda y sale por la
 * derecha abierta en los seis colores de los módulos: la idea de Prisma
 * hecha imagen. Las coordenadas están en el sistema de la foto, así el SVG
 * de los haces queda alineado a cualquier tamaño.
 */
const VB_W = 1535;
const VB_H = 1024;
const ENTRADA = { x: 470, y: 441 };
const SALIDA = { x: 818, y: 490 };

/** Orden de los haces de arriba hacia abajo (mismo orden que los chips). */
const HACES = AREAS.map((a, i) => {
  const yFin = 372 + i * 76;
  return {
    slug: a.slug,
    color: moduloPorSlug(a.slug)?.color ?? '#345b78',
    puntos: `${SALIDA.x},${SALIDA.y - 2 + i * 1.2} ${SALIDA.x},${SALIDA.y + 1 + i * 1.2} ${VB_W},${yFin + 30} ${VB_W},${yFin - 30}`,
    yFin,
  };
});

export default function Hero({ onStartDiagnostic, onConsultar }: HeroProps) {
  const reducirMovimiento = useReducedMotion();
  const [elegido, setElegido] = useState<string | null>(null); // hover / foco del visitante
  const [ciclo, setCiclo] = useState(0); // recorrido automático de los haces

  // Mientras nadie interactúa, los haces se encienden de a uno.
  useEffect(() => {
    if (reducirMovimiento || elegido) return;
    const t = window.setInterval(() => setCiclo((c) => (c + 1) % HACES.length), 2600);
    return () => window.clearInterval(t);
  }, [reducirMovimiento, elegido]);

  const activo = elegido ?? (reducirMovimiento ? null : HACES[ciclo].slug);
  const areaActiva = AREAS.find((a) => a.slug === activo);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#f1f3f7_0%,#faf8f5_55%,#f4ecdf_100%)]"
    >
      {/* Decoración de fondo: grilla técnica muy tenue y dos halos de luz */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,rgb(52_91_120_/_7%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(52_91_120_/_7%)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-sand" />

      <div className="relative mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-6 px-6 pt-28 pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:px-10">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-xl"
        >
          <p className="inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-white/70 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] sm:whitespace-nowrap text-primary shadow-soft backdrop-blur-sm sm:text-xs">
            <span className="flex gap-0.5" aria-hidden>
              {HACES.map((h) => (
                <span key={h.slug} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: h.color }} />
              ))}
            </span>
            Consultora Prisma · Consultoría integral para negocios
          </p>

          <h1 className="mt-6 pb-1 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-dark sm:text-5xl lg:text-[3.6rem]">
            <span className="relative inline-block text-primary">
              Un solo equipo
              <span aria-hidden className="absolute bottom-[-0.2em] left-0 flex h-[0.08em] min-h-1 w-full overflow-hidden rounded-full">
                {HACES.map((h) => (
                  <span key={h.slug} className="flex-1" style={{ backgroundColor: h.color }} />
                ))}
              </span>
            </span>{' '}
            para todo lo que tu negocio necesita.
          </h1>
          <p className="mt-5 text-lg text-ink-soft">Contanos qué necesitás: lo resolvemos juntos.</p>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            ¿Sobre qué es tu consulta?
          </p>
          <div className="mt-3 flex flex-wrap gap-2" onMouseLeave={() => setElegido(null)}>
            {AREAS.map((a) => {
              const color = moduloPorSlug(a.slug)?.color;
              const encendido = activo === a.slug;
              return (
                <button
                  key={a.slug}
                  onClick={() => irAArea(a.slug)}
                  onMouseEnter={() => setElegido(a.slug)}
                  onFocus={() => setElegido(a.slug)}
                  onBlur={() => setElegido(null)}
                  className="group flex items-center gap-2 rounded-full border bg-white/80 px-3.5 py-2 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(34_60_84_/_6%)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: encendido ? color : 'rgb(231 221 201)',
                    boxShadow: encendido ? `0 6px 20px -6px ${color}66` : undefined,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: color }}
                  />
                  {a.nombre}
                </button>
              );
            })}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onConsultar}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-dark px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(34_60_84_/_70%)] transition-all hover:-translate-y-0.5 hover:bg-primary"
            >
              Contanos tu consulta
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onStartDiagnostic}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-white/70 px-7 py-3.5 text-sm font-semibold text-primary backdrop-blur-sm transition-colors hover:border-primary hover:bg-white"
            >
              <Gauge size={16} />
              Diagnóstico gratis en 1 minuto
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {CHECKS.map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-ink-soft">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green/15">
                  <Check size={12} className="text-green" strokeWidth={3} />
                </span>
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* El prisma: la consulta entra y sale en los seis módulos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative -mx-6 lg:mx-0 lg:-mr-24"
          aria-hidden
        >
          <div className="relative aspect-[1535/1024] w-full">
            <img
              src="/img/foto_prisma.webp"
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover mix-blend-multiply [filter:brightness(1.12)_contrast(1.04)] [mask-image:radial-gradient(ellipse_46%_52%_at_48%_50%,black_45%,transparent_100%)]"
            />
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="absolute inset-0 h-full w-full overflow-visible"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="haz-entrada" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={ENTRADA.x} y2="0">
                  <stop offset="0" stopColor="#e4b15e" stopOpacity="0" />
                  <stop offset="0.6" stopColor="#e4b15e" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#fff6e0" stopOpacity="0.95" />
                </linearGradient>
                {HACES.map((h) => (
                  <linearGradient
                    key={h.slug}
                    id={`haz-${h.slug}`}
                    gradientUnits="userSpaceOnUse"
                    x1={SALIDA.x}
                    y1="0"
                    x2={VB_W}
                    y2="0"
                  >
                    <stop offset="0" stopColor={h.color} stopOpacity="1" />
                    <stop offset="0.7" stopColor={h.color} stopOpacity="0.8" />
                    <stop offset="1" stopColor={h.color} stopOpacity="0" />
                  </linearGradient>
                ))}
                <filter id="haz-brillo" x="-20%" y="-50%" width="140%" height="200%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
              </defs>

              {/* Luz que entra */}
              <motion.polygon
                points={`0,300 0,352 ${ENTRADA.x},${ENTRADA.y + 6} ${ENTRADA.x},${ENTRADA.y - 4}`}
                fill="url(#haz-entrada)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <circle cx={ENTRADA.x} cy={ENTRADA.y} r="16" fill="#fff6e0" opacity="0.9" filter="url(#haz-brillo)" />

              {/* Brillo difuso de los haces */}
              <g filter="url(#haz-brillo)" opacity="0.55">
                {HACES.map((h) => (
                  <polygon key={h.slug} points={h.puntos} fill={h.color} opacity={activo === h.slug ? 0.9 : 0.25} />
                ))}
              </g>

              {/* Haces nítidos */}
              {HACES.map((h, i) => (
                <motion.polygon
                  key={h.slug}
                  points={h.puntos}
                  fill={`url(#haz-${h.slug})`}
                  style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: activo && activo !== h.slug ? 0.55 : 1 }}
                  transition={{
                    scaleX: { duration: 1.1, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.5 },
                  }}
                />
              ))}
              <circle cx={SALIDA.x} cy={SALIDA.y} r="12" fill="#ffffff" opacity="0.9" filter="url(#haz-brillo)" />
            </svg>

            {/* Etiqueta del módulo encendido, al final de su haz */}
            <AnimatePresence mode="wait">
              {areaActiva && (
                <motion.span
                  key={areaActiva.slug}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.35 }}
                  className="absolute right-6 hidden -translate-y-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur-md sm:flex lg:right-28"
                  style={{ top: `${(HACES.find((h) => h.slug === areaActiva.slug)!.yFin / VB_H) * 100}%` }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: moduloPorSlug(areaActiva.slug)?.color }} />
                  {areaActiva.nombre}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
