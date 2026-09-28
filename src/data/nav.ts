export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Quiénes somos', href: '#quienes-somos' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Cómo empezar', href: '#contacto' },
  { label: 'Planes', href: '#planes' },
];

export const NAV_CTA: NavItem = { label: 'Contanos tu consulta', href: '#contacto' };
