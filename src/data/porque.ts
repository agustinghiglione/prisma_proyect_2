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

export interface EquipoArea {
  initials: string;
  area: string;
  detail: string;
}

export const EQUIPO: EquipoArea[] = [
  {
    initials: 'ES',
    area: 'Estrategia',
    detail: 'Definimos el rumbo de tu negocio con objetivos claros y decisiones fundamentadas.',
  },
  {
    initials: 'FZ',
    area: 'Finanzas',
    detail: 'Convertimos tus números en información útil para decidir con confianza.',
  },
  {
    initials: 'AD',
    area: 'Administración',
    detail: 'Ordenamos los procesos para que la gestión diaria sea más simple.',
  },
  {
    initials: 'PS',
    area: 'Personas',
    detail: 'Potenciamos a tu equipo como motor real del crecimiento.',
  },
  {
    initials: 'CI',
    area: 'Contabilidad e Impuestos',
    detail: 'Cumplimos con tus obligaciones mientras acompañamos el crecimiento de tu negocio.',
  },
  {
    initials: 'TC',
    area: 'Tecnología',
    detail: 'Incorporamos herramientas digitales que simplifican la gestión y mejoran la información.',
  },
];
