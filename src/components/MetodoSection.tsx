import { motion } from 'framer-motion';
import { METODO_STEPS } from '../data/metodo';

export default function MetodoSection() {
  const scrollToContacto = () => {
    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="metodo"
      className="relative pb-28"
      style={{
        background:
          'linear-gradient(to bottom, var(--color-background) 0%, var(--color-background) 55%, var(--color-surface) 100%)',
      }}
    >
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden sm:h-[52vh]">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          src="/img/foto_metodo.png"
          alt="Prisma de cristal atravesado por un haz de luz"
          className="h-full w-full object-cover"
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 64% 46%, rgba(255,255,255,0.85) 0%, rgba(228,177,94,0.35) 22%, transparent 55%)',
            mixBlendMode: 'screen',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative -mt-16 px-6 text-center sm:-mt-20 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl font-heading text-3xl font-bold text-primary sm:text-4xl"
        >
          Un mismo haz de luz, revelado en cuatro etapas.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-md leading-relaxed text-ink-soft"
        >
          Cada negocio es distinto. Por eso empezamos escuchando y avanzamos con un proceso
          ordenado, pensado para sostenerse en el tiempo.
        </motion.p>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-6 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METODO_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-background p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <Icon size={22} className="mt-5 text-primary" strokeWidth={1.75} />
                <p className="mt-3 font-heading text-lg font-semibold text-ink">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={scrollToContacto}
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Conversemos sobre tu negocio
          </button>
        </div>
      </div>
    </section>
  );
}
