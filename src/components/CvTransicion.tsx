import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, FileUser, Lightbulb } from 'lucide-react';

/**
 * tucvonline.com presentado como "una herramienta de Consultora Prisma":
 * una tarjeta suelta que flota en la transición entre Áreas y Cómo
 * trabajamos (se monta sobre el borde de la sección siguiente), con un
 * carrusel de "¿Sabías que…?" y un único botón hacia la web del CV.
 *
 * Los datos son verificables: el de los 7,4 segundos es del estudio de
 * eye-tracking de Ladders (2018); el resto describe funciones reales de
 * tucvonline.com (8 plantillas, una hoja, PDF/JPG, A4/Carta/Oficio,
 * registro sin costo y $2.000 por descarga).
 */
const URL_CV =
  'https://tucvonline.com/?utm_source=consultoraprisma&utm_medium=web&utm_campaign=sabias_que';

const SABIAS_QUE = [
  {
    texto:
      'un reclutador mira un CV unos 7 segundos en promedio antes de decidir si sigue leyendo?',
    fuente: 'Estudio de eye-tracking de Ladders, 2018',
  },
  {
    texto:
      'un CV de una sola hoja te obliga a priorizar? tucvonline acomoda todo automáticamente para que entre en una hoja.',
  },
  {
    texto:
      'conviene adaptar el CV a cada búsqueda? Cargás tus datos una vez y cambiás el orden y el diseño con un clic.',
  },
  {
    texto: 'podés elegir entre 8 plantillas y descargar en PDF o JPG, en tamaño A4, Carta u Oficio?',
  },
  {
    texto: 'registrarte es gratis? Pagás $2.000 solo cuando descargás tu CV.',
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
    <div id="herramientas" className="relative z-10 -mb-28 px-6 lg:px-10">
      <motion.aside
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1.2 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-[0_24px_60px_-20px_rgba(34,60,84,0.45)] md:grid-cols-[1.4fr_1fr] lg:translate-x-16"
        aria-label="tucvonline.com, una herramienta de Consultora Prisma"
      >
        {/* Carrusel "¿Sabías que…?" */}
        <div className="flex flex-col p-7 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Lightbulb size={14} className="text-gold" /> ¿Sabías que…
          </p>
          <div className="relative mt-3 min-h-[110px] flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-heading text-lg font-semibold leading-snug text-ink sm:text-xl">
                  …{actual.texto}
                </p>
                {actual.fuente && <p className="mt-2 text-xs text-ink-soft">{actual.fuente}</p>}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => mover(-1)}
              aria-label="Anterior"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink hover:bg-surface"
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink hover:bg-surface"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Marca + botón */}
        <div className="flex flex-col justify-between gap-6 bg-gradient-prisma p-7 text-white sm:p-8">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FileUser size={22} />
            </span>
            <p className="mt-4 font-heading text-xl font-bold text-white">tucvonline.com</p>
            <p className="mt-1 text-sm text-white/80">Tu CV profesional, listo en una hoja.</p>
            <p className="mt-4 text-xs text-white/60">Una herramienta de Consultora Prisma</p>
          </div>
          <a
            href={URL_CV}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
          >
            Hacé tu CV online <ArrowUpRight size={16} />
          </a>
        </div>
      </motion.aside>
    </div>
  );
}
