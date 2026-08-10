import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SOLUCIONES } from '../data/soluciones';

export default function SolucionesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="soluciones" className="px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            No partimos de servicios. Partimos de lo que necesitás.
          </motion.h2>
        </div>

        <div className="mt-16 flex flex-col gap-4">
          {SOLUCIONES.map((sol, i) => {
            const Icon = sol.icon;
            const open = openIndex === i;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left sm:px-8"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 font-heading text-lg font-semibold text-ink">
                    {sol.title}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-ink-soft sm:px-8 sm:pl-[4.75rem]">
                      {sol.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
