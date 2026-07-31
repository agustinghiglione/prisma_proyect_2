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

export const GOOGLE_FORM_URL = 'https://forms.gle/9Gw51drKN3Y38DHB6';
