import { motion } from 'framer-motion';
import { Gift, Timer, FileText } from 'lucide-react';

interface DiagnosticIntroProps {
  onStartDiagnostic: () => void;
}

const FEATURES = [
  { icon: Gift, title: 'Gratuito', text: 'Sin costo ni compromiso. Es nuestra forma de empezar a conocerte.' },
  { icon: Timer, title: 'Rápido', text: 'Seis preguntas simples. Menos de un minuto de tu tiempo.' },
  {
    icon: FileText,
    title: 'Personalizado',
    text: 'Un informe pensado para tu negocio, no una respuesta genérica.',
  },
];

export default function DiagnosticIntro({ onStartDiagnostic }: DiagnosticIntroProps) {
  return (
    <section id="diagnostico" className="relative overflow-hidden bg-primary px-6 py-28 lg:px-10">
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary"
        >
          Diagnóstico Prisma®
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl"
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
          Respondé unas pocas preguntas y recibí un primer vistazo claro sobre dónde está parada
          tu empresa hoy, y qué oportunidades tiene por delante.
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
              <Icon size={26} className="text-secondary" strokeWidth={1.75} />
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
          className="mt-14 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Comenzar Diagnóstico
        </motion.button>
      </div>
    </section>
  );
}
