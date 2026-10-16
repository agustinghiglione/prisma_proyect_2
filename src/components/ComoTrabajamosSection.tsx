import { motion } from 'framer-motion';
import { MessageSquareText, Split, UserCheck, FileText, Handshake } from 'lucide-react';

// Cinco pasos (referente: Paro). El cliente habla siempre con Prisma; el
// especialista de cada área es parte del mismo equipo.
const PASOS = [
  {
    icon: MessageSquareText,
    titulo: 'Te escuchamos',
    texto: 'Nos contás qué te preocupa, con el formulario o con el Diagnóstico Prisma® gratuito.',
  },
  {
    icon: Split,
    titulo: 'Desglosamos el problema',
    texto: 'Lo separamos en partes y vemos qué áreas de tu negocio toca.',
  },
  {
    icon: UserCheck,
    titulo: 'Lo toma el especialista',
    texto: 'Cada parte la trabaja el especialista del área, dentro del mismo equipo.',
  },
  {
    icon: FileText,
    titulo: 'Una sola propuesta',
    texto: 'Primera conversación sin costo. Te pasamos una propuesta clara, con alcance y precio.',
  },
  {
    icon: Handshake,
    titulo: 'Te acompañamos',
    texto: 'La llevamos adelante con vos y revisamos juntos los resultados.',
  },
];

export default function ComoTrabajamosSection() {
  return (
    <section id="como-trabajamos" className="relative overflow-hidden bg-gradient-to-b from-primary-dark to-primary px-6 py-20 lg:px-10">
      {/* Foto de fondo muy sutil (Unsplash, licencia libre) */}
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=60"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity"
      />
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-heading text-3xl font-bold text-white [text-shadow:0_1px_3px_rgb(15_23_32_/_45%)] sm:text-4xl">
          Cómo trabajamos: un solo equipo, de punta a punta.
        </h2>
        <p className="mt-4 max-w-2xl text-white/80">
          Cada paso se apoya en el Método Prisma®: primero entendemos tu negocio, después
          proponemos.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {['Observar', 'Interpretar', 'Diseñar', 'Acompañar'].map((etapa, i) => (
            <span key={etapa} className="flex items-center gap-2 text-sm text-white/85">
              <span className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-semibold text-gold">
                {etapa}
              </span>
              {i < 3 && <span className="text-white/40">→</span>}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
            <motion.div
              key={titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-heading text-3xl font-extrabold text-gold">{i + 1}</span>
                <Icon size={22} className="text-white/80" strokeWidth={1.75} />
              </div>
              <p className="mt-4 font-heading text-lg font-semibold text-white">{titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{texto}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => document.querySelector('#arma-tu-prisma')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-10 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:-translate-y-0.5"
        >
          Armá tu Prisma
        </button>
      </div>
    </section>
  );
}
