import type { LucideIcon } from 'lucide-react';
import { Compass, LineChart, ClipboardList, Users, Receipt, Cpu } from 'lucide-react';

/**
 * Las seis áreas de Consultora Prisma, con los temas concretos en los que
 * ayudamos. Es la respuesta a "¿qué le puedo consultar a Prisma?": el
 * visitante tiene que reconocer su problema en una línea, no leer una
 * promesa abstracta.
 */
export interface Area {
  slug: string;
  icon: LucideIcon;
  nombre: string;
  promesa: string;
  temas: string[];
  /** Preguntas tal como las diría un cliente — nunca afirmaciones sobre casos reales. */
  preguntas: string[];
  nota?: string;
}

export const AREAS: Area[] = [
  {
    slug: 'contabilidad',
    icon: Receipt,
    nombre: 'Contabilidad e Impuestos',
    promesa: 'Cumplir con tus obligaciones sin estrés.',
    temas: [
      'Alta, categoría y recategorización del monotributo',
      'Facturación electrónica en ARCA',
      'Cobros del exterior y exportación de servicios',
      'Pasar de monotributo a responsable inscripto',
      'Ingresos brutos y convenio multilateral',
      'Ganancias, bienes personales y balances',
    ],
    preguntas: [
      'Me pasé de categoría, ¿qué hago?',
      'Cobro en dólares por plataformas, ¿cómo facturo?',
      '¿Me conviene seguir en el monotributo?',
    ],
  },
  {
    slug: 'estrategia',
    icon: Compass,
    nombre: 'Estrategia',
    promesa: 'Saber hacia dónde ir y en qué orden.',
    temas: [
      'Plan de negocio y objetivos para los próximos 12 meses',
      'Validar una idea, un producto o un canal de venta nuevo',
      'Análisis de competencia y posicionamiento',
      'Decidir cómo crecer: otro local, más equipo o venta online',
      'Tablero de indicadores para seguir el negocio',
      'Plan de acción ante una caída de ventas',
    ],
    preguntas: [
      '¿Vale la pena abrir un segundo local?',
      'Tengo una idea, ¿por dónde empiezo?',
      'Vendo lo mismo que el año pasado y no sé por qué no crezco.',
    ],
  },
  {
    slug: 'finanzas',
    icon: LineChart,
    nombre: 'Finanzas',
    promesa: 'Entender tus números para decidir con confianza.',
    temas: [
      'Flujo de caja y proyección mes a mes',
      'Costos, márgenes y punto de equilibrio',
      'Cómo fijar y actualizar tus precios',
      'Rentabilidad por producto, servicio o cliente',
      'Presupuesto anual y control de gastos',
      'Financiamiento: créditos, cuotas y cuándo conviene',
    ],
    preguntas: [
      'Vendo más, pero no me queda plata.',
      '¿Cuánto tengo que cobrar para no perder?',
      '¿Me conviene tomar este crédito?',
    ],
  },
  {
    slug: 'administracion',
    icon: ClipboardList,
    nombre: 'Administración',
    promesa: 'Que el día a día funcione sin depender de vos.',
    temas: [
      'Ordenar ventas, cobranzas, compras y pagos',
      'Control de stock e inventario',
      'Proveedores: compras, condiciones y negociación',
      'Procedimientos claros para que el equipo sepa qué hacer',
      'Cuentas corrientes de clientes y morosidad',
      'Planillas y reportes administrativos simples',
    ],
    preguntas: [
      'Nunca sé cuánto me deben mis clientes.',
      'Todo pasa por mí y no llego.',
      'Compro caro y siempre de apuro.',
    ],
  },
  {
    slug: 'capital-humano',
    icon: Users,
    nombre: 'Capital Humano',
    promesa: 'Un equipo que acompañe el crecimiento.',
    temas: [
      'Búsqueda y selección de personal',
      'Descripción de puestos y organigrama',
      'Incorporación de nuevos integrantes',
      'Esquemas de remuneración e incentivos',
      'Evaluación de desempeño y clima de trabajo',
      'Registración laboral y sueldos, junto con el área contable',
    ],
    preguntas: [
      'Necesito contratar y no sé qué perfil buscar.',
      'La gente dura poco en el puesto.',
      '¿Cómo armo un esquema de comisiones justo?',
    ],
  },
  {
    slug: 'tecnologia',
    icon: Cpu,
    nombre: 'Tecnología',
    promesa: 'Herramientas que simplifican la gestión.',
    temas: [
      'Página web, catálogo o tienda online',
      'Sistema de gestión y facturación a tu medida',
      'Automatizar tareas repetitivas y planillas',
      'Tableros para ver tus números al día',
      'Uso práctico de inteligencia artificial en el negocio',
      'Presencia en Google y redes para que te encuentren',
    ],
    preguntas: [
      'Hago todo en planillas y a mano.',
      'Necesito una web, pero no sé de qué tipo.',
      '¿Cómo puedo usar IA en mi negocio?',
    ],
  },
];

/** Evento para abrir un área desde otra sección (p. ej. los chips del Hero). */
export const EVENTO_AREA = 'prisma:area';

export function irAArea(slug: string) {
  window.dispatchEvent(new CustomEvent(EVENTO_AREA, { detail: slug }));
  document.querySelector('#areas')?.scrollIntoView({ behavior: 'smooth' });
}
