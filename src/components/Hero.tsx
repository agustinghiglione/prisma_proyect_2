import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import SunriseVisual from './visuals/SunriseVisual';

interface HeroProps {
  onStartDiagnostic: () => void;
}

const CHECKS = ['Gratuito', 'Menos de un minuto', 'Informe personalizado'];

export default function Hero({ onStartDiagnostic }: HeroProps) {
  const scrollToMetodo = () => {
    document.querySelector('#metodo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden">
      <SunriseVisual />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 via-primary-dark/40 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 pt-28 pb-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Descubrí qué necesita hoy tu negocio.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Antes de proponer soluciones, te escuchamos. El Diagnóstico Prisma® te muestra, en
            minutos, una primera mirada clara sobre dónde está tu empresa hoy y hacia dónde puede
            crecer.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={onStartDiagnostic}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              Realizar Diagnóstico Gratuito
            </button>
            <button
              onClick={scrollToMetodo}
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Conocer el Método Prisma®
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {CHECKS.map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-white/80">
                <Check size={16} className="text-secondary" strokeWidth={3} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 sm:flex">
        <span className="h-10 w-px animate-fade-in bg-white/40" />
      </div>
    </section>
  );
}
