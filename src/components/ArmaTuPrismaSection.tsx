import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Plus, Sparkles } from 'lucide-react';
import { MODULOS, PAQUETES, moduloPorSlug } from '../data/modulos';

interface ArmaTuPrismaSectionProps {
  onConsultar: (contexto: string) => void;
}

/**
 * "Armá tu Prisma" (reemplaza a Planes). Cada módulo es un color del prisma:
 * el visitante activa los que necesita o elige un paquete, ve su combinación
 * y pide la propuesta con esos módulos ya cargados en el formulario.
 */
export default function ArmaTuPrismaSection({ onConsultar }: ArmaTuPrismaSectionProps) {
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [paquete, setPaquete] = useState<string | null>(null);
  // En celular el panel "Tu Prisma" queda debajo de los módulos: mientras la
  // sección está en pantalla, una barra fija muestra lo elegido.
  const [enPantalla, setEnPantalla] = useState(false);
  useEffect(() => {
    const el = document.querySelector('#arma-tu-prisma');
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const alternar = (slug: string) => {
    setPaquete(null);
    setElegidos((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const elegirPaquete = (nombre: string, modulos: string[]) => {
    setPaquete(nombre);
    setElegidos(modulos);
    document.querySelector('#tu-prisma')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Mantener el orden del listado de módulos.
  const seleccion = MODULOS.filter((m) => elegidos.includes(m.slug));

  const pedirPropuesta = () => {
    const nombres = seleccion.map((m) => m.nombre).join(', ');
    const base = paquete ? `Me interesa el paquete "${paquete}" (${nombres}). ` : `Quiero armar mi Prisma con: ${nombres}. `;
    onConsultar(`${base}Mi negocio es: `);
  };

  return (
    <section id="arma-tu-prisma" className="bg-sand px-6 pt-4 pb-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Armá tu Prisma</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Elegí los colores de tu Prisma.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Como la luz en un prisma, tu negocio tiene varias partes. Activá los módulos que
            necesitás, o empezá por un paquete armado, y te pasamos la propuesta.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Módulos */}
          <div className="grid gap-3 sm:grid-cols-2">
            {MODULOS.map((m) => {
              const activo = elegidos.includes(m.slug);
              return (
                <button
                  key={m.slug}
                  onClick={() => alternar(m.slug)}
                  aria-pressed={activo}
                  className={`group relative flex flex-col rounded-2xl border bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 ${
                    activo ? 'border-transparent' : 'border-border'
                  }`}
                  style={activo ? { boxShadow: `0 0 0 2px ${m.color}, 0 12px 32px rgba(34,60,84,0.08)` } : undefined}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="font-heading font-semibold text-ink">{m.nombre}</span>
                    </span>
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
                      style={
                        activo
                          ? { backgroundColor: m.color, borderColor: m.color, color: '#fff' }
                          : { borderColor: 'var(--color-border)', color: 'var(--color-ink-soft)' }
                      }
                    >
                      {activo ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}
                    </span>
                  </span>
                  {m.principal && (
                    <span className="mt-2 self-start rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-primary-dark">
                      Módulo principal
                    </span>
                  )}
                  <span className="mt-2 text-sm text-ink-soft">{m.resumen}</span>
                  <span className="mt-3 grid gap-1">
                    {m.incluye.map((i) => (
                      <span key={i} className="flex items-start gap-1.5 text-xs text-ink">
                        <Check size={12} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                        {i}
                      </span>
                    ))}
                  </span>
                  {m.desde && <span className="mt-3 text-xs font-semibold text-primary">{m.desde}</span>}
                </button>
              );
            })}
          </div>

          {/* Tu Prisma */}
          <aside
            id="tu-prisma"
            className="rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-7 text-white shadow-soft lg:sticky lg:top-28"
          >
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              <Sparkles size={14} /> Tu Prisma
            </p>

            {/* Barra de colores: el "espectro" de lo elegido */}
            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/10">
              <AnimatePresence initial={false}>
                {seleccion.map((m) => (
                  <motion.span
                    key={m.slug}
                    initial={{ flexGrow: 0 }}
                    animate={{ flexGrow: 1 }}
                    exit={{ flexGrow: 0 }}
                    transition={{ duration: 0.35 }}
                    className="h-full"
                    style={{ backgroundColor: m.color, flexBasis: 0 }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {seleccion.length === 0 ? (
              <p className="mt-5 text-sm leading-relaxed text-white/75">
                Todavía no elegiste módulos. Tocá los que necesitás o elegí un paquete más abajo.
              </p>
            ) : (
              <>
                {paquete && <p className="mt-5 font-heading text-lg font-semibold">{paquete}</p>}
                <ul className={`${paquete ? 'mt-3' : 'mt-5'} grid gap-2`}>
                  {seleccion.map((m) => (
                    <li key={m.slug} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.nombre}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-6 text-xs leading-relaxed text-white/65">
              El precio depende de lo que elijas y del tamaño de tu negocio. Te lo pasamos por
              escrito después de la primera conversación, sin letra chica.
            </p>

            <button
              onClick={pedirPropuesta}
              disabled={seleccion.length === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              Pedir mi propuesta <ArrowRight size={16} />
            </button>
          </aside>
        </div>

        <AnimatePresence>
          {enPantalla && seleccion.length > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed left-4 right-[88px] bottom-5 z-40 flex items-center gap-3 rounded-2xl bg-primary-dark p-3 pl-4 text-white shadow-soft lg:hidden"
            >
              <span className="flex h-2.5 w-10 shrink-0 overflow-hidden rounded-full">
                {seleccion.map((m) => (
                  <span key={m.slug} className="flex-1" style={{ backgroundColor: m.color }} />
                ))}
              </span>
              <span className="flex-1 whitespace-nowrap text-sm">
                {seleccion.length} {seleccion.length === 1 ? 'módulo' : 'módulos'}
              </span>
              <button
                onClick={pedirPropuesta}
                className="whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-dark"
              >
                Pedir propuesta
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paquetes */}
        <div className="mt-14">
          <h3 className="font-heading text-2xl font-bold text-primary">Paquetes Prisma</h3>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Combinaciones pensadas para situaciones que vemos seguido. Elegí una y la ajustamos a tu
            negocio.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PAQUETES.map((p) => {
              const activo = paquete === p.nombre;
              return (
                <article
                  key={p.nombre}
                  className={`flex flex-col rounded-2xl border bg-white p-6 shadow-soft transition-colors ${
                    activo ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex h-1.5 overflow-hidden rounded-full">
                    {p.modulos.map((slug) => (
                      <span key={slug} className="flex-1" style={{ backgroundColor: moduloPorSlug(slug)?.color }} />
                    ))}
                  </div>
                  <h4 className="mt-5 font-heading text-lg font-semibold text-ink">{p.nombre}</h4>
                  <p className="mt-1 text-sm text-ink-soft">{p.paraQuien}</p>
                  <ul className="mt-4 grid gap-1.5">
                    {p.incluye.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink">
                        <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-ink-soft">
                    {p.modulos.map((slug) => moduloPorSlug(slug)?.nombre).join(' · ')}
                  </p>
                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => elegirPaquete(p.nombre, p.modulos)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {activo ? 'Elegido' : 'Elegir este paquete'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
