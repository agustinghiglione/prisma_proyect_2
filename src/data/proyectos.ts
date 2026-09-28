/**
 * Proyectos reales que muestran lo que Prisma sabe hacer. Regla: cada
 * proyecto se presenta como lo que es. Si es propio, dice "Proyecto propio";
 * si fue para un cliente, "Proyecto para cliente" y solo con su permiso.
 * Nunca presentar un proyecto propio como si nos hubieran contratado.
 */
export interface Proyecto {
  nombre: string;
  url: string;
  tipo: 'Proyecto propio' | 'Proyecto para cliente';
  area: string;
  resumen: string;
  hicimos: string[];
}

export const PROYECTOS: Proyecto[] = [
  {
    nombre: 'tucvonline.com',
    url: 'https://tucvonline.com/?utm_source=consultoraprisma&utm_medium=web&utm_campaign=proyectos',
    tipo: 'Proyecto propio',
    area: 'Tecnología',
    resumen:
      'Una plataforma para armar un CV profesional en una hoja. La pensamos, la construimos y la pusimos a funcionar con cobro online.',
    hicimos: [
      'Diseño del producto y 8 plantillas',
      'Registro de usuarios y edición del CV',
      'Cobro por descarga con Mercado Pago',
      'Publicación y mantenimiento',
    ],
  },
  // Próximo: la otra web que va a mandar Damian (confirmar si es propia o de cliente).
];
