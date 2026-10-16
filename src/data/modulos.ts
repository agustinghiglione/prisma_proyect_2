/**
 * "Armá tu Prisma": cada área es un módulo y cada módulo un color del prisma.
 * Los slugs son los mismos de data/areas.ts.
 * Precios: no se muestran hasta que los socios confirmen montos "desde"
 * (ver informe "Prisma: por qué evolucionar y cómo"). Para mostrar uno,
 * completar `desde` con el texto final, p. ej. 'desde $75.000/mes'.
 */
export interface Modulo {
  slug: string;
  nombre: string;
  color: string;
  /** Una línea: qué resuelve. */
  resumen: string;
  /** Dos ejemplos concretos de lo que incluye. */
  incluye: [string, string];
  /** Módulos principales de Prisma (base propia del equipo). */
  principal?: boolean;
  desde?: string;
}

export const MODULOS: Modulo[] = [
  {
    slug: 'contabilidad',
    nombre: 'Contabilidad e Impuestos',
    color: '#345b78',
    resumen: 'Tus obligaciones al día y explicadas.',
    incluye: ['Monotributo, IVA e Ingresos Brutos', 'Sueldos y balances'],
    principal: true,
  },
  {
    slug: 'tecnologia',
    nombre: 'Tecnología',
    color: '#6b5b95',
    resumen: 'Web, automatizaciones y sistemas a medida.',
    incluye: ['Tu web en 3 días hábiles', 'Asistentes de chat y automatizaciones'],
    principal: true,
  },
  {
    slug: 'administracion',
    nombre: 'Administración',
    color: '#7e9b78',
    resumen: 'Que el día a día funcione sin depender de vos.',
    incluye: ['Cobranzas, pagos y stock en orden', 'Procedimientos para tu equipo'],
  },
  {
    slug: 'finanzas',
    nombre: 'Finanzas',
    color: '#d9a13f',
    resumen: 'Entender tus números para decidir.',
    incluye: ['Flujo de caja mes a mes', 'Costos, márgenes y precios'],
  },
  {
    slug: 'estrategia',
    nombre: 'Estrategia',
    color: '#c47a57',
    resumen: 'Saber hacia dónde ir y en qué orden.',
    incluye: ['Plan de los próximos 12 meses', 'Seguimiento con indicadores'],
  },
  {
    slug: 'capital-humano',
    nombre: 'Capital Humano',
    color: '#4c9393',
    resumen: 'Un equipo que acompañe el crecimiento.',
    incluye: ['Búsqueda y selección', 'Puestos, incentivos y clima'],
  },
];

export const moduloPorSlug = (slug: string) => MODULOS.find((m) => m.slug === slug);

/** Paquetes que cruzan módulos: la firma Prisma. Nombres para validar con los socios. */
export interface Paquete {
  nombre: string;
  paraQuien: string;
  incluye: string[];
  modulos: string[];
}

export const PAQUETES: Paquete[] = [
  {
    nombre: 'Monotributo en piloto automático',
    paraQuien: 'Monotributistas que facturan seguido.',
    incluye: [
      'Monotributo al día',
      'Facturación conectada',
      'Aviso antes de cada vencimiento y recategorización',
    ],
    modulos: ['contabilidad', 'tecnologia'],
  },
  {
    nombre: 'Tu negocio online',
    paraQuien: 'Comercios y servicios sin web, o con una web que no vende.',
    incluye: ['Web en 3 días hábiles', 'Asistente de chat', 'Turnos o pedidos automáticos'],
    modulos: ['tecnologia', 'administracion'],
  },
  {
    nombre: 'Pyme en orden',
    paraQuien: 'Pymes con empleados que quieren tener todo bajo control.',
    incluye: ['Contabilidad y sueldos', 'Circuitos administrativos', 'Tablero mensual con caja, ventas e impuestos'],
    modulos: ['contabilidad', 'administracion', 'tecnologia'],
  },
  {
    nombre: 'Crecer con números',
    paraQuien: 'Dueños que preparan el próximo salto.',
    incluye: ['Diagnóstico completo y plan', 'Tablero de indicadores', 'Reunión mensual de seguimiento'],
    modulos: ['estrategia', 'finanzas', 'tecnologia'],
  },
];

/** "Cuando las áreas se cruzan": ejemplos de lo que pasa al conectar módulos. */
export const CRUCES = [
  {
    modulos: ['contabilidad', 'tecnologia'],
    titulo: 'Facturás y la contabilidad ya está al día',
    texto:
      'Conectamos tu facturación con la contabilidad: lo que vendés llega solo a la liquidación del mes, sin pasar datos a mano.',
  },
  {
    modulos: ['finanzas', 'tecnologia'],
    titulo: 'Tus números del mes, en un tablero',
    texto:
      'Caja, ventas, gastos e impuestos a pagar en un solo lugar y actualizados, para decidir con datos y no a ojo.',
  },
  {
    modulos: ['administracion', 'tecnologia'],
    titulo: 'Turnos, reseñas y mensajes, solos',
    texto:
      'Los turnos se agendan, la reseña se pide después de cada visita y las consultas de siempre se responden. Lo que necesita una persona te llega a vos.',
  },
];
