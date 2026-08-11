export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Diagnóstico Prisma®', href: '#diagnostico' },
  { label: 'Método Prisma®', href: '#metodo' },
  { label: 'Soluciones', href: '#soluciones' },
  { label: '¿Por qué Prisma?', href: '#por-que-prisma' },
];

export const NAV_CTA: NavItem = { label: 'Conversemos sobre tu negocio', href: '#contacto' };

export const GOOGLE_DIAGNOSTICO_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe4nq4U1y60FDDIYSulvqqJtBNXFF7wLYhlX2u6PZcit6UK2g/viewform';

export const GOOGLE_AGENDAR_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeV-_ghT6kB363USK_9cypfasaxauq93H1gTrmtHL0CYxOOgQ/viewform';
