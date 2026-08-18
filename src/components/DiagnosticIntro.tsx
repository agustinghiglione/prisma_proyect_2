import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Gift, Timer, FileText, Users } from 'lucide-react';

interface DiagnosticIntroProps {
  onStartDiagnostic: () => void;
}

const FEATURES = [
  { icon: Gift, title: 'Gratuito', text: 'Sin costo ni compromiso. Es nuestra forma de empezar a conocerte.' },
  { icon: Timer, title: 'Rápido', text: 'Cinco preguntas simples. Menos de un minuto de tu tiempo.' },
  {
    icon: FileText,
    title: 'Personalizado',
    text: 'Un informe pensado para tu negocio, no una respuesta genérica.',
  },
];

export default function DiagnosticIntro({ onStartDiagnostic }: DiagnosticIntroProps) {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    fetch('/api/estadisticas')
      .then((r) => r.json())
      .then((d) => setTotal(d.total))
      .catch(() => {});
  }, []);

  return (
    <section id="diagnostico" className="relative overflow-hidden bg-gradient-prisma px-6 py-28 lg:px-10">
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-heading text-3xl font-bold text-white [text-shadow:0_2px_10px_rgb(0_0_0_/_35%)] sm:text-4xl"
        >
          Antes de hablar de soluciones, queremos entender tu negocio.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-white/80"
        >
          Un diagnóstico breve, gratuito y personalizado para obtener una primera mirada sobre el
          momento actual de tu negocio.
        </motion.p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-7 text-left backdrop-blur-sm"
            >
              <Icon size={26} className="text-gold" strokeWidth={1.75} />
              <p className="mt-4 font-heading text-lg font-semibold text-white">{title}</p>
              <p className="mt-1.5 text-sm text-white/70">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={onStartDiagnostic}
          className="mt-14 rounded-full bg-background px-8 py-3.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:-translate-y-0.5"
        >
          Comenzar Diagnóstico
        </motion.button>

        {total !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70"
          >
            <Users size={13} />
            {total > 0
              ? `Ya lo hicieron ${total} ${total === 1 ? 'negocio' : 'negocios'}`
              : 'Sé de los primeros en probarlo'}
          </motion.p>
        )}
      </div>
    </section>
  );
}
