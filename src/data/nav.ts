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

// El diagnóstico y el agendamiento ahora son nativos (ver
// src/components/DiagnosticoFlow.tsx y src/components/AgendarModal.tsx).
