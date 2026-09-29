import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, LineChart, Clock, Handshake } from 'lucide-react';

export interface Plan {
  icon: LucideIcon;
  title: string;
  /** A quién está pensada esta estructura. */
  paraQuien: string;
  /** Cómo se hace el seguimiento (se muestra al seleccionar la tarjeta). */
  seguimiento: string;
  /** Aclaración opcional debajo de las áreas. */
  notaAreas?: string;
  /** Áreas de Prisma que trabajan en este plan (se ven con la tarjeta cerrada). */
  areas: string[];
  /** Precio de referencia en ARS, antes del descuento. null = a convenir (sin precio). */
  precioLista: number | null;
  /** '/mes' para abonos, 'por proyecto' para trabajos puntuales. */
  unidad: string;
}

/**
 * Descuento de lanzamiento aplicado a todos los planes. Los precios son
 * "desde": el valor final se cierra en la primera conversación.
 * TODO(Damian + director): validar montos y vigencia antes de publicar.
 * Una promoción con precio tachado tiene que tener vigencia clara y un
 * precio de lista real (normas de lealtad comercial / defensa del consumidor).
 */
export const DESCUENTO_LANZAMIENTO = 0.2;
export const VIGENCIA_PROMO = '31/12/2026';

export const precioConDescuento = (lista: number) =>
  Math.round((lista * (1 - DESCUENTO_LANZAMIENTO)) / 1000) * 1000;

export const formatoPesos = (n: number) => '$' + n.toLocaleString('es-AR');

export const PLANES: Plan[] = [
  {
    icon: ShieldCheck,
    title: 'Base / Cumplimiento',
    paraQuien: 'Para tener el día a día contable y administrativo resuelto.',
    seguimiento:
      'Podemos pactar reuniones periódicas de seguimiento según el alcance que acordemos.',
    areas: ['Contabilidad e Impuestos', 'Administración'],
    precioLista: 75000,
    unidad: '/mes',
  },
  {
    icon: LineChart,
    title: 'Integral / Crecimiento',
    paraQuien: 'Para negocios en crecimiento que necesitan más que lo contable.',
    seguimiento:
      'Incluye reuniones periódicas de seguimiento, con la frecuencia que pactemos según la extensión del plan.',
    areas: ['Contabilidad e Impuestos', 'Administración', 'Finanzas', 'Estrategia'],
    precioLista: 180000,
    unidad: '/mes',
  },
  {
    icon: Clock,
    title: 'Prisma Full',
    paraQuien: 'Para tener a Prisma disponible todo el tiempo, en las seis áreas.',
    seguimiento:
      'Reuniones de seguimiento con la frecuencia que tu negocio necesite, con las seis áreas en la mesa.',
    areas: ['Estrategia', 'Finanzas', 'Administración', 'Capital Humano', 'Contabilidad e Impuestos', 'Tecnología'],
    precioLista: 300000,
    unidad: '/mes',
  },
  {
    icon: Handshake,
    title: 'Prisma A Medida',
    paraQuien: 'Para proyectos puntuales o necesidades que no entran en un plan estándar.',
    seguimiento: 'Definimos juntos el alcance, los hitos y las reuniones de avance del proyecto.',
    areas: ['Estrategia', 'Finanzas', 'Administración', 'Capital Humano', 'Contabilidad e Impuestos', 'Tecnología'],
    notaAreas: 'Se combinan según el alcance del proyecto.',
    precioLista: null,
    unidad: '',
  },
];
