import { motion } from 'framer-motion';
import { AUDIENCIAS } from '../data/audiencias';

export default function AudienciaSection() {
  return (
    <section className="bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            ¿Prisma también es para vos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 leading-relaxed text-ink-soft"
          >
            Cada negocio tiene una historia. Y cada historia merece un acompañamiento diferente. En
            Prisma acompañamos a personas, profesionales y organizaciones que buscan ordenar,
            fortalecer o hacer crecer su negocio. No importa si estás dando tus primeros pasos, si
            trabajás de forma independiente o si dirigís una empresa consolidada: lo importante es
            comprender el momento en el que estás para ayudarte a avanzar con mayor claridad.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCIAS.map(({ icon: Icon, title, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-background p-5 shadow-soft transition-shadow duration-300 hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <p className="font-heading font-semibold text-ink">{title}</p>
              </div>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-3 text-sm leading-relaxed text-ink-soft">{detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="mx-auto max-w-xl font-heading text-xl font-semibold text-primary">
            Más allá de la actividad o el tamaño, todos los negocios necesitan claridad para
            crecer.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
