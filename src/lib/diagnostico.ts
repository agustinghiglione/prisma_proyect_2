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

/**
 * Separa fortalezas de oportunidades por lo que realmente valen, no por
 * posición. Antes se tomaban siempre las 2 mejores y las 2 peores aunque las
 * "peores" fueran en realidad un 4 — alguien que contesta perfecto en las 5
 * preguntas terminaba viendo "detectamos una oportunidad" en algo que no
 * tiene nada de oportunidad. Con esto, si no hay nada débil de verdad,
 * "oportunidades" sale vacío, y el llamador decide cómo mostrarlo.
 */
function separarPorValor(scores: RespuestaDimension[]) {
  const fortalezas = scores.filter((s) => s.valor >= 3).sort((a, b) => b.valor - a.valor);
  const oportunidades = scores.filter((s) => s.valor <= 2).sort((a, b) => a.valor - b.valor);
  return { fortalezas, oportunidades };
}

/** respuestas: un valor 1-4 por cada dimensión, en el mismo orden que DIMENSIONES */
export function calcularResultado(respuestas: number[]): ResultadoDiagnostico {
  const scores: RespuestaDimension[] = DIMENSIONES.map((d, i) => ({
    dimension: d.nombre,
    valor: respuestas[i],
  }));

  const { fortalezas, oportunidades } = separarPorValor(scores);
  const overallPercent = Math.round(
    (scores.reduce((s, x) => s + x.valor, 0) / (scores.length * 4)) * 100,
  );

  return { overallPercent, scores, fortalezas, oportunidades };
}

export function nivelDe(valor: number): 'bajo' | 'medio' | 'alto' {
  return valor <= 2 ? 'bajo' : valor === 3 ? 'medio' : 'alto';
}

export const PRECIO_DIAGNOSTICO_COMPLETO = 20000; // ARS, definido por Prisma

/**
 * La Parte 2 — seis preguntas, una por cada área que Prisma realmente
 * resuelve. Se desbloquea al pagar el diagnóstico completo. A diferencia de
 * la Parte 1 (un pulso general y gratis), cada pregunta de acá apunta directo
 * a uno de nuestros servicios, así el informe final conecta cada resultado
 * bajo con la conversación que hay que tener.
 */
export const DIMENSIONES_PARTE2: Dimension[] = [
  {
    id: 'estrategia',
    nombre: 'Estrategia',
    pregunta: '¿Tenés un plan de negocio o proyecciones escritas, más allá de lo que tenés en la cabeza?',
    opciones: [
      { texto: 'No, nunca lo escribí', valor: 1 },
      { texto: 'Tengo algo, pero está desactualizado', valor: 2 },
      { texto: 'Tengo un plan, aunque no lo reviso seguido', valor: 3 },
      { texto: 'Sí, y lo uso activamente para decidir', valor: 4 },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    pregunta: '¿Con qué frecuencia revisás la rentabilidad real de tu negocio (no solo cuánto entra)?',
    opciones: [
      { texto: 'Nunca la calculé en serio', valor: 1 },
      { texto: 'La reviso una vez al año, si acaso', valor: 2 },
      { texto: 'La reviso cada tanto, sin un ritmo fijo', valor: 3 },
      { texto: 'La reviso todos los meses, con números claros', valor: 4 },
    ],
  },
  {
    id: 'administracion',
    nombre: 'Administración',
    pregunta: '¿Cómo se maneja hoy la parte administrativa del día a día (facturas, pagos, papeles)?',
    opciones: [
      { texto: 'A los ponchazos, cuando no queda otra', valor: 1 },
      { texto: 'Lo hago yo mismo, a mano, cada vez', valor: 2 },
      { texto: 'Tengo un método, pero depende de mí', valor: 3 },
      { texto: 'Está ordenado y no depende de una sola persona', valor: 4 },
    ],
  },
  {
    id: 'personas',
    nombre: 'Personas',
    pregunta: '¿Cómo está organizado tu equipo hoy (aunque seas solo vos)?',
    opciones: [
      { texto: 'No hay roles claros, cada uno hace lo que puede', valor: 1 },
      { texto: 'Hay roles, pero se superponen seguido', valor: 2 },
      { texto: 'Cada uno sabe lo suyo, aunque falta algo de proceso', valor: 3 },
      { texto: 'Roles claros y el equipo funciona sin que yo esté encima', valor: 4 },
    ],
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad e Impuestos',
    pregunta: '¿Qué tan preparado estás si mañana te piden algo tu contador o la AFIP?',
    opciones: [
      { texto: 'Tendría que salir a buscar todo de cero', valor: 1 },
      { texto: 'Lo tengo, pero desordenado', valor: 2 },
      { texto: 'Lo tengo bastante al día', valor: 3 },
      { texto: 'Todo en orden, sin sobresaltos', valor: 4 },
    ],
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
    pregunta: '¿Qué herramientas digitales usás hoy para gestionar tu negocio, más allá de WhatsApp y Excel?',
    opciones: [
      { texto: 'Ninguna, es todo manual', valor: 1 },
      { texto: 'Alguna suelta, sin conectar con el resto', valor: 2 },
      { texto: 'Tengo varias, pero no hablan entre sí', valor: 3 },
      { texto: 'Están integradas y me ahorran tiempo real', valor: 4 },
    ],
  },
];

export const RECOMENDACIONES_PARTE2: Record<string, { bajo: string; medio: string; alto: string }> = {
  Estrategia: {
    bajo: 'Poner el plan por escrito es lo que separa reaccionar de decidir.',
    medio: 'Actualizar tu plan con la realidad de hoy le devuelve el valor que perdió.',
    alto: 'Tenés con qué decidir: el siguiente paso es afinarlo con más frecuencia.',
  },
  Finanzas: {
    bajo: 'Sin ver la rentabilidad real, podés estar vendiendo más y ganando menos.',
    medio: 'Un ritmo mensual fijo te va a mostrar problemas antes de que se vuelvan grandes.',
    alto: 'Tenés buena visibilidad: ahora se trata de usarla para decidir con más velocidad.',
  },
  Administración: {
    bajo: 'Ordenar lo administrativo básico te devuelve horas que hoy se van en apagar incendios.',
    medio: 'Que no dependa solo de vos es lo que te permite ausentarte sin que nada se caiga.',
    alto: 'Tu administración ya no es un cuello de botella: es momento de medirla y afinarla.',
  },
  Personas: {
    bajo: 'Definir roles claros, aunque el equipo sea chico, evita que todo pase por vos.',
    medio: 'Un poco más de proceso entre roles reduce la fricción del día a día.',
    alto: 'Tu equipo funciona bien: el próximo paso es que crezca sin perder eso.',
  },
  'Contabilidad e Impuestos': {
    bajo: 'Ponerte al día ahora es mucho más barato que resolverlo bajo presión después.',
    medio: 'Un poco de orden adicional te ahorra el apuro de último momento.',
    alto: 'Estás tranquilo acá: el foco ahora es que esta prolijidad también te ayude a decidir.',
  },
  Tecnología: {
    bajo: 'Sumar la herramienta correcta, una sola y bien elegida, ya cambia el día a día.',
    medio: 'Conectar las herramientas que ya tenés multiplica lo que cada una hace sola.',
    alto: 'Tu stack ya te ahorra tiempo real: el siguiente paso es sacarle más datos.',
  },
};

export interface ResultadoCompleto {
  parte1: ResultadoDiagnostico;
  parte2: ResultadoDiagnostico;
  overallPercent: number;
  todos: RespuestaDimension[];
}

/** respuestas: un valor 1-4 por cada una de las 6 dimensiones de DIMENSIONES_PARTE2 */
export function calcularResultadoParte2(respuestas: number[]): ResultadoDiagnostico {
  const scores: RespuestaDimension[] = DIMENSIONES_PARTE2.map((d, i) => ({
    dimension: d.nombre,
    valor: respuestas[i],
  }));
  const { fortalezas, oportunidades } = separarPorValor(scores);
  const overallPercent = Math.round(
    (scores.reduce((s, x) => s + x.valor, 0) / (scores.length * 4)) * 100,
  );
  return { overallPercent, scores, fortalezas, oportunidades };
}

export function calcularResultadoCompleto(
  respuestasParte1: number[],
  respuestasParte2: number[],
): ResultadoCompleto {
  const parte1 = calcularResultado(respuestasParte1);
  const parte2 = calcularResultadoParte2(respuestasParte2);
  const todos = [...parte1.scores, ...parte2.scores];
  const overallPercent = Math.round(
    (todos.reduce((s, x) => s + x.valor, 0) / (todos.length * 4)) * 100,
  );
  return { parte1, parte2, overallPercent, todos };
}

/** Junta las recomendaciones de las dos partes en un solo diccionario. */
export const RECOMENDACIONES_TODAS: Record<string, { bajo: string; medio: string; alto: string }> = {
  ...RECOMENDACIONES,
  ...RECOMENDACIONES_PARTE2,
};

/** Lo que explícitamente se le dice al cliente que va a recibir, antes de pagar. */
export const QUE_INCLUYE_COMPLETO = [
  'Un vistazo más profundo a las áreas en las que te podemos ayudar de verdad: Estrategia, Finanzas, Administración, Personas, Contabilidad e Impuestos y Tecnología.',
  'Todas tus respuestas de hoy, destapadas, con la recomendación completa de cada una.',
  'Si nos dejás el link de tu web, la revisamos antes de la conversación.',
  'El informe completo por mail, y la posibilidad de mandarte el resultado cuando quieras.',
];
