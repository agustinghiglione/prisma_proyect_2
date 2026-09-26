export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Cómo trabajamos', href: '#como-trabajamos' },
  { label: 'Planes', href: '#planes' },
  { label: 'Herramientas', href: '#herramientas' },
];

export const NAV_CTA: NavItem = { label: 'Contanos tu consulta', href: '#contacto' };

// El diagnóstico y el agendamiento son nativos (ver
// src/components/DiagnosticoFlow.tsx y src/components/AgendarModal.tsx).
