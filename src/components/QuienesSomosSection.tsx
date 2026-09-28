import { motion } from 'framer-motion';
import { DoorOpen, UserCheck, Layers } from 'lucide-react';
import { AUDIENCIAS } from '../data/audiencias';

const IDEAS = [
  { icon: DoorOpen, titulo: 'Una sola puerta', texto: 'No tenés que saber a quién llamar: nos escribís a nosotros.' },
  { icon: UserCheck, titulo: 'Un especialista por tema', texto: 'Cada consulta la ve el profesional que sabe de eso.' },
  { icon: Layers, titulo: 'Una mirada de conjunto', texto: 'Las áreas hablan entre sí, como pasa en tu negocio.' },
];

export default function QuienesSomosSection() {
  return (
    <section id="quienes-somos" className="bg-surface/30 px-6 py-20 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quiénes somos</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Profesionales de distintas áreas, de acuerdo en una idea.
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            Los problemas de un negocio no llegan separados por especialidad: una duda de impuestos
            termina siendo de precios, y una de precios, de personal. Por eso nos juntamos
            profesionales de estrategia, finanzas, administración, personas, contabilidad e impuestos
            y tecnología para trabajar con un mismo método y una sola puerta de entrada.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Vos traés la consulta. Nosotros nos ponemos de acuerdo para darte la ayuda que tu negocio
            necesita, sin que tengas que coordinar a nadie.
          </p>

          <p className="mt-8 text-sm font-semibold text-ink">Trabajamos con</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AUDIENCIAS.map(({ icon: Icon, title }) => (
              <span
                key={title}
                className="flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-ink"
              >
                <Icon size={14} className="text-primary" strokeWidth={1.75} />
                {title}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4">
          {IDEAS.map(({ icon: Icon, titulo, texto }, i) => (
            <motion.div
              key={titulo}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-primary-dark">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-heading font-semibold text-ink">{titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{texto}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
