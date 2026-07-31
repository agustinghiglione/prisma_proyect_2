import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, LineChart, ShieldCheck, Rocket, Globe } from 'lucide-react';

export interface Solucion {
  icon: LucideIcon;
  title: string;
  detail: string;
}

export const SOLUCIONES: Solucion[] = [
  {
    icon: LayoutGrid,
    title: 'Quiero ordenar mi negocio',
    detail:
      'Diseñamos procesos administrativos claros para que la gestión diaria deje de depender de la improvisación.',
  },
  {
    icon: LineChart,
    title: 'Quiero tomar mejores decisiones',
    detail:
      'Convertimos la información dispersa en reportes simples y confiables, listos para decidir con seguridad.',
  },
  {
    icon: ShieldCheck,
    title: 'Quiero cumplir con tranquilidad',
    detail:
      'Acompañamos tus obligaciones contables e impositivas para que dejen de ser una fuente de estrés.',
  },
  {
    icon: Rocket,
    title: 'Quiero hacer crecer mi empresa',
    detail: 'Definimos objetivos y un plan concreto para que el crecimiento sea sostenible, no accidental.',
  },
  {
    icon: Globe,
    title: 'Quiero potenciar mi presencia digital',
    detail: 'Incorporamos herramientas digitales que simplifican la gestión y mejoran cómo te encuentran.',
  },
];
