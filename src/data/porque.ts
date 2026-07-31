import type { LucideIcon } from 'lucide-react';
import { Handshake, Eye, ShieldCheck, Sprout } from 'lucide-react';

export interface Pilar {
  icon: LucideIcon;
  title: string;
  detail: string;
}

export const PILARES: Pilar[] = [
  {
    icon: Handshake,
    title: 'Cercanía',
    detail: 'Construimos vínculos de confianza, no relaciones transaccionales.',
  },
  {
    icon: Eye,
    title: 'Claridad',
    detail: 'Comunicamos de forma simple, sin tecnicismos innecesarios.',
  },
  {
    icon: ShieldCheck,
    title: 'Compromiso',
    detail: 'Nos involucramos con cada negocio como si fuera propio.',
  },
  {
    icon: Sprout,
    title: 'Evolución',
    detail: 'Acompañamos el crecimiento con una mirada de mejora continua.',
  },
];

export const EQUIPO = [
  { initials: 'ES', area: 'Estrategia' },
  { initials: 'FZ', area: 'Finanzas' },
  { initials: 'AD', area: 'Administración' },
  { initials: 'PS', area: 'Personas' },
  { initials: 'CI', area: 'Contabilidad e Impuestos' },
  { initials: 'TC', area: 'Tecnología' },
];
