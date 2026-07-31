import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MESSAGES = [
  'Leyendo tus respuestas con calma…',
  'Cruzando la información de tu negocio…',
  'Preparando tu Informe Ejecutivo Prisma®…',
];

export default function ProcessingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, MESSAGES.length - 1));
    }, 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full max-w-md flex-col items-center text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="mb-8 h-16 w-16"
      >
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="50,8 92,80 8,80" stroke="#123c73" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="50,8 92,80 8,80" fill="#1e5a7a" opacity="0.12" />
        </svg>
      </motion.div>
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-heading text-lg font-semibold text-ink"
      >
        {MESSAGES[step]}
      </motion.p>
    </motion.div>
  );
}
