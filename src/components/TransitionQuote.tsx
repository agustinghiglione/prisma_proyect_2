import { motion } from 'framer-motion';

interface TransitionQuoteProps {
  text: string;
  tone?: 'surface' | 'background';
  /**
   * 'plain' keeps the original text-only transition. 'horizon-light' and
   * 'horizon-dark' add a horizon line, for beats that need to carry the
   * "luz, horizonte y transformación" visual language.
   */
  variant?: 'plain' | 'horizon-light' | 'horizon-dark';
}

export default function TransitionQuote({ text, tone = 'surface', variant = 'plain' }: TransitionQuoteProps) {
  if (variant === 'plain') {
    return (
      <section className={`${tone === 'surface' ? 'bg-surface' : 'bg-background'} px-6 py-20 lg:px-10`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-heading text-2xl font-semibold text-ink sm:text-3xl">{text}</p>
        </motion.div>
      </section>
    );
  }

  const isDark = variant === 'horizon-dark';

  return (
    <section
      className={`relative overflow-hidden px-6 py-24 lg:px-10 ${isDark ? 'bg-gradient-prisma' : 'bg-surface'}`}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0.6 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1 }}
        className={`pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent ${
          isDark ? 'via-white/40' : 'via-gold/50'
        } to-transparent`}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className={`font-heading text-2xl font-semibold sm:text-3xl ${isDark ? 'text-white' : 'text-ink'}`}>
          {text}
        </p>
      </motion.div>
    </section>
  );
}
