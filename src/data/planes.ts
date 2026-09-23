import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, LineChart, Clock, Handshake } from 'lucide-react';

export interface Plan {
  icon: LucideIcon;
  title: string;
  /**
   * A quién está pensada esta estructura — reemplaza el precio: la idea es
   * mostrar que Prisma ya tiene el esqueleto armado para este tipo de
   * cliente, no vender un rango de $. TODO(Damian): ajustar el texto si no
   * refleja exactamente a quién apunta cada plan.
   */
  paraQuien: string;
  incluye: string[];
}

export const PLANES: Plan[] = [
  {
    icon: ShieldCheck,
    title: 'Base / Cumplimiento',
    paraQuien: 'Para tener el día a día contable y administrativo resuelto.',
    incluye: ['Contabilidad e Impuestos', 'Administración esencial'],
  },
  {
    icon: LineChart,
    title: 'Integral / Crecimiento',
    paraQuien: 'Para negocios en crecimiento que necesitan más que lo contable.',
    incluye: ['Contabilidad e Impuestos', 'Administración', 'Finanzas', 'Estrategia'],
  },
  {
    icon: Clock,
    title: 'Prisma Full',
    paraQuien: 'Para tener a Prisma disponible todo el tiempo, en las seis áreas.',
    incluye: ['Las seis áreas', 'Asistencia continua'],
  },
  {
    icon: Handshake,
    title: 'Prisma A Medida',
    paraQuien: 'Para necesidades que no entran en un plan estándar.',
    incluye: ['Alcance y foco según tu negocio', 'Se define en la primera conversación'],
  },
];
