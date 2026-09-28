import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gauge, MessagesSquare } from 'lucide-react';
import AgendarModal from './AgendarModal';

interface ContactoSectionProps {
  onStartDiagnostic: () => void;
}

/**
 * "Empezá sin costo": la ruta de entrada, antes de los planes. Dos pasos
 * gratuitos (diagnóstico y primera conversación) y la foto del camino.
 */
export default function ContactoSection({ onStartDiagnostic }: ContactoSectionProps) {
  const [agendarAbierto, setAgendarAbierto] = useState(false);

  return (
    <section id="contacto" className="relative overflow-hidden bg-surface px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cómo empezar</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Conversemos sobre tu negocio. Los dos primeros pasos no tienen costo.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-soft"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 font-heading text-sm text-primary-dark">1</span>
                Gratis · 1 minuto
              </span>
              <p className="mt-4 flex items-center gap-2 font-heading text-lg font-bold text-ink">
                <Gauge size={20} className="text-primary" /> Diagnóstico Prisma®
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                Cinco preguntas y recibís una primera lectura de tu negocio, área por área.
              </p>
              <button
                onClick={onStartDiagnostic}
                className="mt-5 self-start rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Hacer el diagnóstico
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-soft"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 font-heading text-sm text-primary-dark">2</span>
                Sin costo · sin compromiso
              </span>
              <p className="mt-4 flex items-center gap-2 font-heading text-lg font-bold text-ink">
                <MessagesSquare size={20} className="text-primary" /> Primera conversación
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                Nos contás tu situación, elegís el horario y te confirmamos por mail. Es virtual.
              </p>
              <button
                onClick={() => setAgendarAbierto(true)}
                className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Agendar <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>

          <p className="mt-6 text-sm text-ink-soft">
            Si después vemos algo concreto para hacer, te pasamos una propuesta con alcance y precio.
            Más abajo tenés una idea de los planes.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="hidden h-[440px] overflow-hidden rounded-3xl lg:block"
        >
          <img
            src="/img/foto_primer_contacto.png"
            alt="Camino iluminado hacia el amanecer"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {agendarAbierto && <AgendarModal onClose={() => setAgendarAbierto(false)} />}
    </section>
  );
}
