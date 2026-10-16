import { hayClientes } from './clientes';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Quiénes somos', href: '#quienes-somos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Armá tu Prisma', href: '#arma-tu-prisma' },
  // "Clientes" aparece solo cuando hay al menos un testimonio aprobado.
  ...(hayClientes() ? [{ label: 'Clientes', href: '#clientes' }] : []),
  { label: 'Cómo empezar', href: '#contacto' },
];

export const NAV_CTA: NavItem = { label: 'Contanos tu consulta', href: '#contacto' };
