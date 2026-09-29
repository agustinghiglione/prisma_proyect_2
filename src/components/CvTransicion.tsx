import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

/**
 * Tarjeta "¿Sabías que…?" sobre la importancia de un CV profesional, con
 * salida a tucvonline.com. Va al final de "Confianza que podés comprobar".
 * Los datos hablan del CV, no de la herramienta. El de los 7 segundos es del
 * estudio de eye-tracking de Ladders (2018); el resto son buenas prácticas
 * generales, sin cifras.
 */
const URL_CV =
  'https://tucvonline.com/?utm_source=consultoraprisma&utm_medium=web&utm_campaign=sabias_que';

// Foto: Unsplash (licencia libre de Unsplash). Se sirve desde su CDN.
const FOTO_CV =
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=70';

const SABIAS_QUE = [
  {
    texto: 'un reclutador mira un CV unos 7 segundos en promedio antes de decidir si sigue leyendo?',
    fuente: 'Estudio de eye-tracking de Ladders, 2018',
  },
  {
    texto:
      'muchas empresas filtran los CV con sistemas automáticos? Un formato limpio y bien estructurado se lee mejor.',
  },
  {
    texto: 'un error de ortografía puede alcanzar para que descarten tu CV? Revisalo siempre antes de enviarlo.',
  },
  {
    texto: 'mostrar logros concretos, con resultados, dice mucho más que listar tareas?',
  },
  {
    texto: 'un CV claro y en una sola hoja hace que lo importante se vea primero?',
  },
];

const INTERVALO_MS = 5500;

export default function CvTransicion() {
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % SABIAS_QUE.length), INTERVALO_MS);
    return () => window.clearInterval(t);
  }, [pausado]);

  const mover = (d: number) => setI((n) => (n + d + SABIAS_QUE.length) % SABIAS_QUE.length);
  const actual = SABIAS_QUE[i];

  return (
    <motion.aside
      id="cv"
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1 }}
      whileHover={{ y: -8, rotate: 0, scale: 1.015 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      className="group mx-auto mt-16 grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-[0_24px_60px_-24px_rgba(34,60,84,0.45)] transition-shadow duration-500 hover:shadow-[0_36px_80px_-24px_rgba(34,60,84,0.55)] md:grid-cols-[1.35fr_1fr]"
      aria-label="¿Sabías que…? Datos sobre el CV"
    >
      {/* Carrusel */}
      <div className="flex flex-col p-7 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Lightbulb size={14} className="text-gold transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" />
          ¿Sabías que…
        </p>
        <div className="relative mt-3 min-h-[120px] flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-heading text-lg font-semibold leading-snug text-ink sm:text-xl">…{actual.texto}</p>
              {actual.fuente && <p className="mt-2 text-xs text-ink-soft">{actual.fuente}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => mover(-1)}
            aria-label="Anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink hover:bg-sand"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {SABIAS_QUE.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Dato ${n + 1}`}
                className={`h-1.5 rounded-full transition-all ${n === i ? 'w-5 bg-primary' : 'w-1.5 bg-border'}`}
              />
            ))}
          </div>
          <button
            onClick={() => mover(1)}
            aria-label="Siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink hover:bg-sand"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Foto + llamado a la acción */}
      <a
        href={URL_CV}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block min-h-[260px] overflow-hidden"
      >
        <img
          src={FOTO_CV}
          alt="Portapapeles con un currículum junto a una notebook"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-7 text-white">
          <p className="font-heading text-xl font-bold">Armá un CV que se lea en segundos.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary-dark transition-transform duration-300 group-hover:translate-x-1">
            Hacé tu CV en tucvonline.com <ArrowUpRight size={16} />
          </span>
          <p className="mt-4 text-xs text-white/70">Desarrollado por el Área de Tecnología</p>
        </div>
      </a>
    </motion.aside>
  );
}
