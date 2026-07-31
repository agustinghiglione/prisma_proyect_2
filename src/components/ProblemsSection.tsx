import { motion } from 'framer-motion';
import { PROBLEMS } from '../data/problems';
import MinimalDeskVisual from './visuals/MinimalDeskVisual';

interface ProblemsSectionProps {
  onStartDiagnostic: () => void;
}

export default function ProblemsSection({ onStartDiagnostic }: ProblemsSectionProps) {
  return (
    <section className="bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center font-heading text-3xl font-bold text-primary sm:text-4xl lg:mx-0 lg:text-left"
          >
            ¿Te resulta familiar alguna de estas situaciones?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto hidden h-40 w-40 shrink-0 overflow-hidden rounded-2xl sm:block"
          >
            <MinimalDeskVisual />
          </motion.div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-heading text-lg font-semibold text-ink">{problem.title}</p>
              <p className="mt-1.5 text-ink-soft">{problem.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="mx-auto max-w-xl font-heading text-xl font-semibold text-primary">
            No se trata de trabajar más. Se trata de ver con mayor claridad.
          </p>
          <button
            onClick={onStartDiagnostic}
            className="mt-8 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            Comenzar Diagnóstico
          </button>
        </motion.div>
      </div>
    </section>
  );
}
