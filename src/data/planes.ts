import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, LineChart, Clock, Handshake } from 'lucide-react';

export interface Plan {
  icon: LucideIcon;
  title: string;
  /** A quién está pensada esta estructura. */
  paraQuien: string;
  /** Lo mínimo que Prisma se compromete a cumplir en este plan. */
  incluye: string[];
  /** Precio de referencia en ARS, antes del descuento de lanzamiento. */
  precioLista: number;
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
    incluye: [
      'Monotributo: vencimientos y control de categoría',
      'Facturación electrónica en regla',
      'Orden de ventas, cobros y pagos',
      'Consultas por mail',
    ],
    precioLista: 75000,
    unidad: '/mes',
  },
  {
    icon: LineChart,
    title: 'Integral / Crecimiento',
    paraQuien: 'Para negocios en crecimiento que necesitan más que lo contable.',
    incluye: [
      'Todo lo del plan Base',
      'Reporte mensual de caja y rentabilidad',
      'Objetivos y plan de acción trimestral',
      'Una reunión mensual de seguimiento',
    ],
    precioLista: 180000,
    unidad: '/mes',
  },
  {
    icon: Clock,
    title: 'Prisma Full',
    paraQuien: 'Para tener a Prisma disponible todo el tiempo, en las seis áreas.',
    incluye: [
      'Las seis áreas trabajando juntas',
      'Tablero de indicadores del negocio',
      'Dos reuniones de seguimiento por mes',
      'Asistencia continua',
    ],
    precioLista: 300000,
    unidad: '/mes',
  },
  {
    icon: Handshake,
    title: 'Prisma A Medida',
    paraQuien: 'Para un proyecto puntual que no entra en un plan estándar.',
    incluye: [
      'Alcance cerrado y por escrito antes de empezar',
      'Ej.: plan de negocio, web, búsqueda de personal',
      'Se define en la primera conversación',
    ],
    precioLista: 100000,
    unidad: 'por proyecto',
  },
];
