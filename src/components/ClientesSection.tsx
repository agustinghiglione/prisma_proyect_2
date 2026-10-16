import { motion } from 'framer-motion';
import { ArrowUpRight, Quote } from 'lucide-react';
import { TUCVONLINE, testimoniosVisibles, tucvonlineVisible, hayClientes } from '../data/clientes';
import { moduloPorSlug } from '../data/modulos';

/** Marca visible solo en local para lo que todavía no aprobó el cliente. */
function Borrador({ aprobado }: { aprobado: boolean }) {
  if (aprobado) return null;
  return (
    <span className="absolute top-4 right-4 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-dark">
      Borrador · falta aprobación
    </span>
  );
}

const iniciales = (nombre: string) =>
  nombre
    .replace(/[[\]]/g, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/**
 * Clientes (referentes: Cuenta Norte y Pilot). Testimonios con nombre, cargo
 * y empresa, y los módulos que trabajamos con cada uno. En el sitio
 * publicado solo aparece lo aprobado; si no hay nada aprobado, la sección
 * no se muestra.
 */
export default function ClientesSection() {
  if (!hayClientes()) return null;
  const testimonios = testimoniosVisibles();

  return (
    <section id="clientes" className="bg-sand px-6 pb-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Clientes</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-primary sm:text-4xl">
          Lo que cuentan quienes ya trabajaron con nosotros.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonios.map((t, i) => (
            <motion.figure
              key={t.nombre + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-3xl border border-border bg-white p-7 shadow-soft sm:p-9"
            >
              <Borrador aprobado={t.aprobado} />
              <Quote size={28} className="text-gold" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink">“{t.texto}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                  {iniciales(t.nombre)}
                </span>
                <span>
                  <span className="block font-heading font-semibold text-ink">{t.nombre}</span>
                  <span className="block text-sm text-ink-soft">{t.detalle}</span>
                </span>
              </figcaption>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {t.modulos.map((slug) => {
                  const m = moduloPorSlug(slug);
                  return m ? (
                    <span
                      key={slug}
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.nombre}
                    </span>
                  ) : null;
                })}
              </div>
            </motion.figure>
          ))}
        </div>

        {tucvonlineVisible() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative mt-6 flex flex-col gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-7 text-white shadow-soft sm:flex-row sm:items-center sm:p-9"
          >
            <Borrador aprobado={TUCVONLINE.aprobado} />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Un proyecto del equipo · tucvonline
              </p>
              <p className="mt-3 leading-relaxed text-white/90">“{TUCVONLINE.resena}”</p>
              <p className="mt-3 text-sm text-white/65">{TUCVONLINE.autor}</p>
            </div>
            <a
              href={TUCVONLINE.url}
              target="_blank"
              rel="noopener"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5 sm:self-center"
            >
              Conocer tucvonline <ArrowUpRight size={16} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
