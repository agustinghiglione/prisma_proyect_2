/**
 * El cerebro del Diagnóstico Prisma®: preguntas, puntaje y recomendaciones.
 * Un solo lugar para esto — lo usan el frontend (resultado instantáneo) y el
 * backend (el mail con el informe). Antes esta lógica vivía duplicada entre
 * el sitio y un script de Google Apps Script; ahora hay una sola fuente.
 */

export interface Opcion {
  texto: string;
  valor: 1 | 2 | 3 | 4;
}

export interface Dimension {
  id: string;
  nombre: string;
  pregunta: string;
  opciones: Opcion[];
}

export const DIMENSIONES: Dimension[] = [
  {
    id: 'organizacion',
    nombre: 'Organización',
    pregunta: '¿Cómo describirías la organización interna de tu negocio hoy?',
    opciones: [
      { texto: 'Cada uno resuelve como puede, sobre la marcha', valor: 1 },
      { texto: 'Hay algunas rutinas, pero dependen de que alguien se acuerde', valor: 2 },
      { texto: 'Los procesos principales están definidos y se siguen casi siempre', valor: 3 },
      { texto: 'Todo el equipo sabe qué hacer sin que nadie tenga que repetirlo', valor: 4 },
    ],
  },
  {
    id: 'informacion',
    nombre: 'Información y decisiones',
    pregunta: 'Cuando tenés que tomar una decisión importante, ¿de dónde sacás la información?',
    opciones: [
      { texto: 'La tengo en la cabeza o hay que juntarla a mano', valor: 1 },
      { texto: 'Está repartida en varios lugares (Excel, WhatsApp, papeles)', valor: 2 },
      { texto: 'Tengo reportes, pero los reviso solo cuando hace falta', valor: 3 },
      { texto: 'Miro números actualizados con frecuencia, antes de que haga falta', valor: 4 },
    ],
  },
  {
    id: 'cumplimiento',
    nombre: 'Cumplimiento',
    pregunta: '¿Cómo llevás tus obligaciones contables e impositivas?',
    opciones: [
      { texto: 'Voy resolviendo sobre la hora, cuando se vence algo', valor: 1 },
      { texto: 'Está en orden, pero me genera estrés cada vez', valor: 2 },
      { texto: 'Tengo quien lo maneja y confío en que está al día', valor: 3 },
      { texto: 'Está todo en orden y además lo uso para decidir mejor', valor: 4 },
    ],
  },
  {
    id: 'crecimiento',
    nombre: 'Crecimiento',
    pregunta: '¿Tenés una estrategia clara para crecer en los próximos meses?',
    opciones: [
      { texto: 'No, voy resolviendo lo que aparece', valor: 1 },
      { texto: 'Tengo una idea general, pero no un plan concreto', valor: 2 },
      { texto: 'Tengo objetivos definidos, aunque no siempre les hago seguimiento', valor: 3 },
      { texto: 'Tengo un plan concreto y lo reviso con regularidad', valor: 4 },
    ],
  },
  {
    id: 'digital',
    nombre: 'Presencia digital',
    pregunta: '¿Qué lugar ocupan hoy la tecnología y lo digital en tu negocio?',
    opciones: [
      { texto: 'Casi ninguno, todavía es un tema pendiente', valor: 1 },
      { texto: 'Uso algunas herramientas sueltas, sin mucha conexión entre ellas', valor: 2 },
      { texto: 'Tengo presencia digital, pero podría aprovecharla mejor', valor: 3 },
      { texto: 'Está integrada y me ayuda activamente a vender y a organizarme', valor: 4 },
    ],
  },
];

export const RECOMENDACIONES: Record<string, { bajo: string; medio: string; alto: string }> = {
  Organización: {
    bajo: 'Ordenar procesos básicos de gestión te va a devolver horas cada semana.',
    medio: 'Formalizar los procesos que ya funcionan evitará que dependan de una sola persona.',
    alto: 'Tu organización es una fortaleza: es una buena base para escalar sin perder el control.',
  },
  'Información y decisiones': {
    bajo: 'Centralizar la información del negocio es el primer paso para decidir con más seguridad.',
    medio: 'Con reportes más claros y frecuentes vas a anticipar decisiones en lugar de reaccionar.',
    alto: 'Tomás decisiones con buena información: el próximo paso es afinar los indicadores clave.',
  },
  Cumplimiento: {
    bajo: 'Poner en orden lo impositivo y contable te va a dar tranquilidad inmediata.',
    medio: 'Con un seguimiento más cercano podés anticiparte en vez de resolver sobre la hora.',
    alto: 'Tu cumplimiento está bien encaminado: es momento de que trabaje a tu favor, no solo en regla.',
  },
  Crecimiento: {
    bajo: 'Definir objetivos concretos de crecimiento le da dirección a las decisiones del día a día.',
    medio: 'Tenés dirección; falta un seguimiento más cercano para sostener el ritmo.',
    alto: 'Tenés una estrategia de crecimiento sólida: el foco ahora es acelerarla con más recursos.',
  },
  'Presencia digital': {
    bajo: 'Dar los primeros pasos en lo digital puede abrir una fuente de crecimiento importante.',
    medio: 'Integrar mejor las herramientas que ya usás puede multiplicar su impacto.',
    alto: 'Lo digital ya es parte de tu negocio: el próximo paso es que trabaje de forma más inteligente.',
  },
};

export interface RespuestaDimension {
  dimension: string;
  valor: number;
}

export interface ResultadoDiagnostico {
  overallPercent: number;
  scores: RespuestaDimension[];
  fortalezas: RespuestaDimension[];
  oportunidades: RespuestaDimension[];
}

/** respuestas: un valor 1-4 por cada dimensión, en el mismo orden que DIMENSIONES */
export function calcularResultado(respuestas: number[]): ResultadoDiagnostico {
  const scores: RespuestaDimension[] = DIMENSIONES.map((d, i) => ({
    dimension: d.nombre,
    valor: respuestas[i],
  }));

  const ordenado = [...scores].sort((a, b) => b.valor - a.valor);
  const fortalezas = ordenado.slice(0, 2);
  const oportunidades = [...ordenado].reverse().slice(0, 2);
  const overallPercent = Math.round(
    (scores.reduce((s, x) => s + x.valor, 0) / (scores.length * 4)) * 100,
  );

  return { overallPercent, scores, fortalezas, oportunidades };
}

export function nivelDe(valor: number): 'bajo' | 'medio' | 'alto' {
  return valor <= 2 ? 'bajo' : valor === 3 ? 'medio' : 'alto';
}

export const PRECIO_DIAGNOSTICO_COMPLETO = 20000; // ARS, definido por Prisma
