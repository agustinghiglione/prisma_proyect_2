import { motion } from 'framer-motion';

interface TransitionQuoteProps {
  text: string;
  tone?: 'surface' | 'background';
}

export default function TransitionQuote({ text, tone = 'surface' }: TransitionQuoteProps) {
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
