import type { LucideIcon } from 'lucide-react';
import { Sprout, Briefcase, Receipt, Globe, Store, Building2 } from 'lucide-react';

export interface Audiencia {
  icon: LucideIcon;
  title: string;
  detail: string;
}

export const AUDIENCIAS: Audiencia[] = [
  {
    icon: Sprout,
    title: 'Estoy comenzando un emprendimiento',
    detail: 'Te ayudamos a construir una base sólida para que puedas crecer con organización desde el primer día.',
  },
  {
    icon: Briefcase,
    title: 'Trabajo de forma independiente',
    detail:
      'Profesionales y trabajadores independientes que necesitan respaldo administrativo, contable y estratégico para enfocarse en su actividad.',
  },
  {
    icon: Receipt,
    title: 'Soy monotributista',
    detail: 'Te acompañamos para que cumplas con tus obligaciones y puedas desarrollar tu actividad con tranquilidad.',
  },
  {
    icon: Globe,
    title: 'Trabajo para clientes o plataformas digitales',
    detail:
      'Si generás ingresos por internet, exportás servicios, trabajás como freelancer o creás contenido digital, te ayudamos a organizar tu actividad y cumplir con tus obligaciones.',
  },
  {
    icon: Store,
    title: 'Tengo un comercio o una pyme',
    detail: 'Ordenamos la gestión para que puedas tomar mejores decisiones y hacer crecer tu negocio.',
  },
  {
    icon: Building2,
    title: 'Dirijo una empresa',
    detail:
      'Acompañamos la gestión con una mirada integral, combinando estrategia, administración, finanzas, personas, contabilidad y tecnología.',
  },
];
