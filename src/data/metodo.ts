import type { LucideIcon } from 'lucide-react';
import { Search, Eye, PenTool, Users } from 'lucide-react';

export interface MetodoStep {
  icon: LucideIcon;
  title: string;
  detail: string;
}

export const METODO_STEPS: MetodoStep[] = [
  {
    icon: Search,
    title: 'Observar',
    detail: 'Escuchamos y analizamos tu negocio tal como es hoy, sin apurar conclusiones.',
  },
  {
    icon: Eye,
    title: 'Interpretar',
    detail: 'Transformamos lo que observamos en información clara sobre oportunidades y riesgos.',
  },
  {
    icon: PenTool,
    title: 'Diseñar',
    detail: 'Creamos una estrategia hecha a medida de tus objetivos y de la realidad de tu negocio.',
  },
  {
    icon: Users,
    title: 'Acompañar',
    detail: 'Caminamos junto a vos en la implementación, ajustando el rumbo cuando hace falta.',
  },
];
