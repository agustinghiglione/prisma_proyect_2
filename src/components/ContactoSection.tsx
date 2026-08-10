import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Link2, MessageCircle } from 'lucide-react';
import FaqAccordion from './FaqAccordion';
import { GOOGLE_FORM_URL } from '../data/nav';

const PASOS = [
  { icon: Calendar, text: 'Elegís un horario que te quede cómodo.' },
  { icon: Link2, text: 'Recibís el enlace para conectarte.' },
  { icon: MessageCircle, text: 'Conversamos sobre tu negocio, sin compromiso.' },
];

export default function ContactoSection() {
  const handleSchedule = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Un primer paso
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-3xl font-bold text-primary sm:text-4xl"
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
            Contanos brevemente quién sos y en qué momento está tu negocio. Es el primer paso para
            que empecemos a mirar juntos con más claridad.
          </motion.p>

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
              Al hacer clic vas a completar un breve formulario con tu nombre, tu negocio y tus
              datos de contacto para que podamos coordinar la primera conversación.
            </p>
            <button
              onClick={handleSchedule}
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
    </section>
  );
}
