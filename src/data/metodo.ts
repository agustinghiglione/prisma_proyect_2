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
    detail: 'Comprendemos tu realidad.',
  },
  {
    icon: Eye,
    title: 'Interpretar',
    detail: 'Encontramos lo que realmente necesita atención.',
  },
  {
    icon: PenTool,
    title: 'Diseñar',
    detail: 'Construimos una solución adaptada.',
  },
  {
    icon: Users,
    title: 'Acompañar',
    detail: 'Te ayudamos a llevarla adelante.',
  },
];
