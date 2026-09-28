import { ArrowUpRight, BadgeCheck, Check, FileSignature, Gauge, Lock, MessagesSquare, Wallet } from 'lucide-react';
import { PROYECTOS } from '../data/proyectos';

/**
 * Confianza sin caras (mientras el equipo decide si se muestra): solo
 * compromisos que ya son ciertos hoy y que el visitante puede comprobar.
 * No agregar cifras de clientes, testimonios ni plazos de respuesta que no
 * estén confirmados.
 */
const ITEMS = [
  {
    icon: MessagesSquare,
    titulo: 'Primero conversamos',
    texto: 'La primera conversación no tiene costo ni compromiso.',
  },
  {
    icon: Gauge,
    titulo: 'Probá antes de contratar',
    texto: 'El Diagnóstico Prisma® es gratuito y te da una primera lectura en menos de un minuto.',
  },
  {
    icon: BadgeCheck,
    titulo: 'Profesionales habilitados',
    texto: 'Los temas contables e impositivos los lleva un contador público matriculado.',
  },
  {
    icon: FileSignature,
    titulo: 'Propuesta por escrito',
    texto: 'Antes de empezar sabés qué incluye y cuánto cuesta. Sin letra chica.',
  },
  {
    icon: Lock,
    titulo: 'Tus datos, protegidos',
    texto: 'Tratamos tu información según la Ley 25.326 de Protección de Datos Personales.',
  },
  {
    icon: Wallet,
    titulo: 'Pagos seguros',
    texto: 'Los pagos online se procesan con Mercado Pago.',
  },
];

export default function ConfianzaSection() {
  return (
    <section id="confianza" className="bg-surface/30 px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-heading text-3xl font-bold text-primary sm:text-4xl">
          Confianza que podés comprobar.
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-heading font-semibold text-ink">{titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Lo que ya construimos</p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-primary">
            No solo lo decimos: lo hacemos.
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {PROYECTOS.map((p) => (
              <div key={p.nombre} className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{p.tipo}</span>
                  <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-primary-dark">Área {p.area}</span>
                </div>
                <p className="mt-4 font-heading text-lg font-bold text-ink">{p.nombre}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.resumen}</p>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {p.hicimos.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-ink">
                      <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4"
                >
                  Ver el proyecto <ArrowUpRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
