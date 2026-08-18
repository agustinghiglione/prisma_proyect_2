import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Link2, MessageCircle, Sparkles } from 'lucide-react';
import FaqAccordion from './FaqAccordion';
import AgendarModal from './AgendarModal';

const PASOS = [
  { icon: Calendar, text: 'Contanos tu disponibilidad.' },
  { icon: Link2, text: 'Te confirmamos por mail el horario.' },
  { icon: MessageCircle, text: 'Conversamos sobre tu negocio, sin compromiso.' },
];

interface ContactoSectionProps {
  onStartDiagnostic: () => void;
}

export default function ContactoSection({ onStartDiagnostic }: ContactoSectionProps) {
  const [agendarAbierto, setAgendarAbierto] = useState(false);

  return (
    <section id="contacto" className="relative overflow-hidden bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            Conversemos sobre tu negocio.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-lg leading-relaxed text-ink-soft"
          >
            El primer paso para ayudarte es conocer tu realidad. Coordinemos una primera
            conversación y veamos juntos qué necesita hoy tu negocio.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onClick={onStartDiagnostic}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-left transition-colors hover:bg-gold/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/25 text-primary-dark">
              <Sparkles size={16} strokeWidth={1.75} />
            </span>
            <span className="text-sm text-ink">
              Si todavía no lo hiciste, te recomendamos completar antes nuestro{' '}
              <span className="font-semibold text-primary-dark">Diagnóstico Prisma® gratuito:</span>{' '}
              nos ayuda a llegar a la conversación con una mirada más clara de tu negocio.
              <span className="mt-0.5 block font-semibold text-primary underline underline-offset-2">
                Hacer mi diagnóstico
              </span>
            </span>
          </motion.button>

          <div className="mt-10 flex flex-col gap-4">
            {PASOS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <p className="text-ink">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 rounded-2xl border border-border bg-background p-7"
          >
            <p className="text-sm text-ink-soft">
              Al hacer clic vas a completar un breve formulario con tu nombre y tus datos de
              contacto para que podamos coordinar la primera conversación.
            </p>
            <button
              onClick={() => setAgendarAbierto(true)}
              className="mt-5 flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Agendar una primera conversación <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="hidden overflow-hidden rounded-3xl lg:block"
        >
          <img
            src="/img/foto_primer_contacto.png"
            alt="Camino iluminado hacia el amanecer"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="mx-auto mt-24 max-w-3xl">
        <h3 className="text-center font-heading text-2xl font-bold text-primary">
          Preguntas frecuentes
        </h3>
        <div className="mt-8">
          <FaqAccordion />
        </div>
      </div>

      {agendarAbierto && <AgendarModal onClose={() => setAgendarAbierto(false)} />}
    </section>
  );
}
