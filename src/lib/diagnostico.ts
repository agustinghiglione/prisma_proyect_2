/**
 * El cerebro del Diagnóstico Prisma®: preguntas, puntaje y síntesis.
 * Un solo lugar para esto — lo usan el frontend (resultado instantáneo) y el
 * backend (el mail con el informe).
 *
 * Las áreas que se preguntan son, a propósito, las mismas seis que Prisma
 * ofrece como servicio (Estrategia, Finanzas, Administración, Personas,
 * Contabilidad e Impuestos, Tecnología) — antes la Parte 1 usaba nombres
 * distintos ("Organización", "Cumplimiento"...) que en los hechos eran las
 * mismas áreas con otro nombre, y esa doble nomenclatura confundía más de lo
 * que ayudaba. La Parte 1 gratuita toca cinco de las seis (todas menos
 * Personas) con una mirada rápida; la Parte 2 paga profundiza en esas cinco
 * con una pregunta distinta y más específica, y suma Personas como sexta.
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

/** Las seis áreas reales de Prisma, en el orden en que se presentan siempre. */
export const AREAS = ['Estrategia', 'Finanzas', 'Administración', 'Personas', 'Contabilidad e Impuestos', 'Tecnología'] as const;

export const DIMENSIONES: Dimension[] = [
  {
    id: 'administracion',
    nombre: 'Administración',
    pregunta: '¿Cómo describirías la organización interna de tu negocio hoy?',
    opciones: [
      { texto: 'Cada uno resuelve como puede, sobre la marcha', valor: 1 },
      { texto: 'Hay algunas rutinas, pero dependen de que alguien se acuerde', valor: 2 },
      { texto: 'Los procesos principales están definidos y se siguen casi siempre', valor: 3 },
      { texto: 'Todo el equipo sabe qué hacer sin que nadie tenga que repetirlo', valor: 4 },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    pregunta: 'Cuando tenés que tomar una decisión importante, ¿de dónde obtenés la información que necesitás?',
    opciones: [
      { texto: 'La tengo en la cabeza o hay que juntarla a mano', valor: 1 },
      { texto: 'Está repartida en varios lugares (Excel, WhatsApp, papeles)', valor: 2 },
      { texto: 'Tengo reportes, pero los reviso solo cuando hace falta', valor: 3 },
      { texto: 'Miro números actualizados con frecuencia, antes de que haga falta', valor: 4 },
    ],
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad e Impuestos',
    pregunta: '¿Cómo llevás tus obligaciones contables e impositivas?',
    opciones: [
      { texto: 'Voy resolviendo sobre la hora, cuando se vence algo', valor: 1 },
      { texto: 'Está en orden, pero me genera estrés cada vez', valor: 2 },
      { texto: 'Tengo quien lo maneja y confío en que está al día', valor: 3 },
      { texto: 'Está todo en orden y además lo uso para decidir mejor', valor: 4 },
    ],
  },
  {
    id: 'estrategia',
    nombre: 'Estrategia',
    pregunta: '¿Tenés una estrategia clara para crecer en los próximos meses?',
    opciones: [
      { texto: 'No, voy resolviendo lo que aparece', valor: 1 },
      { texto: 'Tengo una idea general, pero no un plan concreto', valor: 2 },
      { texto: 'Tengo objetivos definidos, aunque no siempre les hago seguimiento', valor: 3 },
      { texto: 'Tengo un plan concreto y lo reviso con regularidad', valor: 4 },
    ],
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
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
  Administración: {
    bajo: 'Gran parte de la operación pasa por vos o por la memoria del equipo.',
    medio: 'Tenés rutinas que funcionan, pero todavía dependen de que alguien se acuerde.',
    alto: 'Tu organización ya es una fortaleza real: los procesos sostienen la operación.',
  },
  Finanzas: {
    bajo: 'Tomás decisiones importantes sin tener los números a mano.',
    medio: 'Tenés reportes, pero los mirás recién cuando algo urge.',
    alto: 'Tomás decisiones con información real y actualizada.',
  },
  'Contabilidad e Impuestos': {
    bajo: 'Vas resolviendo lo impositivo y contable sobre la hora.',
    medio: 'Estás en regla, pero cada vencimiento te genera tensión.',
    alto: 'Tu cumplimiento está sólido — no es poco, es donde más negocios fallan.',
  },
  Estrategia: {
    bajo: 'No tenés una dirección definida todavía: vas resolviendo lo que aparece.',
    medio: 'Tenés una idea de hacia dónde ir, pero sin un plan que la sostenga.',
    alto: 'Tenés una estrategia de crecimiento que funciona.',
  },
  Tecnología: {
    bajo: 'Lo digital todavía es una materia pendiente en tu negocio.',
    medio: 'Tenés herramientas digitales, pero sueltas, sin conectar entre sí.',
    alto: 'Lo digital ya es parte activa de cómo vendés y te organizás.',
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
 * posición. Si no hay nada débil de verdad, "oportunidades" sale vacío.
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
  return valor < 2.5 ? 'bajo' : valor < 3.5 ? 'medio' : 'alto';
}

/** Igual que nivelDe pero sobre un porcentaje (0-100) en vez de un valor 1-4. */
export function nivelDePercent(pct: number): 'bajo' | 'medio' | 'alto' {
  return pct < 37.5 ? 'bajo' : pct < 62.5 ? 'medio' : 'alto';
}

/**
 * Lo que ve el cliente en vez de un número frío de porcentaje. A propósito
 * no decimos "bajo/medio/alto" tal cual — "Inicial" y "En desarrollo" no
 * suenan a nota escolar, y de paso evitan que alguien con 100% sienta que ya
 * no tiene nada para trabajar con nosotros.
 */
export const ETIQUETA_NIVEL: Record<'bajo' | 'medio' | 'alto', string> = {
  bajo: 'Inicial',
  medio: 'En desarrollo',
  alto: 'Sólido',
};

/** Slug ASCII estable por área, para usar como clave de columna (ej. en Sheets). */
export const AREA_SLUG: Record<string, string> = {
  Administración: 'administracion',
  Finanzas: 'finanzas',
  'Contabilidad e Impuestos': 'contabilidad_impuestos',
  Estrategia: 'estrategia',
  Tecnología: 'tecnologia',
  Personas: 'personas',
};

/**
 * Arma, para un set de dimensiones + sus respuestas (mismo orden), un objeto
 * plano {prefijo_slugArea: textoDeLaOpciónElegida} — pensado para mandar a
 * Google Sheets, donde cada pregunta individual queda en su propia columna
 * en vez de solo el promedio por área.
 */
export function respuestasParaSheet(
  dimensiones: Dimension[],
  respuestas: number[],
  prefijo: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  dimensiones.forEach((d, i) => {
    const valor = respuestas[i];
    const opcion = d.opciones.find((o) => o.valor === valor);
    const slug = AREA_SLUG[d.nombre] ?? d.nombre.toLowerCase();
    out[`${prefijo}_${slug}`] = opcion?.texto ?? '';
  });
  return out;
}

export const PRECIO_DIAGNOSTICO_COMPLETO = 20000; // ARS, definido por Prisma

/**
 * La Parte 2 — seis preguntas, una por cada área que Prisma realmente
 * resuelve. Se desbloquea al pagar. Para las cinco áreas que ya tocó la
 * Parte 1, la pregunta es distinta y más específica (no repite la misma
 * pregunta con otras palabras); Personas es enteramente nueva acá.
 */
export const DIMENSIONES_PARTE2: Dimension[] = [
  {
    id: 'estrategia-2',
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
    id: 'finanzas-2',
    nombre: 'Finanzas',
    pregunta: '¿Con qué frecuencia revisás la rentabilidad real de tu negocio, más allá de los ingresos?',
    opciones: [
      { texto: 'Nunca la calculé en serio', valor: 1 },
      { texto: 'La reviso una vez al año, si acaso', valor: 2 },
      { texto: 'La reviso cada tanto, sin un ritmo fijo', valor: 3 },
      { texto: 'La reviso todos los meses, con números claros', valor: 4 },
    ],
  },
  {
    id: 'administracion-2',
    nombre: 'Administración',
    pregunta: 'Si te tomaras una semana sin mirar el negocio, ¿la parte administrativa seguiría funcionando sola?',
    opciones: [
      { texto: 'No, se frena o se acumula todo hasta que vuelva', valor: 1 },
      { texto: 'Sobrevive, pero con algún problema que después hay que destrabar', valor: 2 },
      { texto: 'Sigue funcionando, aunque yo tenga que poner algunos parches al volver', valor: 3 },
      { texto: 'Sigue funcionando igual, no se nota que no estuve', valor: 4 },
    ],
  },
  {
    id: 'personas',
    nombre: 'Personas',
    pregunta: '¿Cómo está organizado tu equipo hoy?',
    opciones: [
      { texto: 'No hay roles claros, cada uno hace lo que puede', valor: 1 },
      { texto: 'Hay roles, pero se superponen seguido', valor: 2 },
      { texto: 'Cada uno sabe lo suyo, aunque falta algo de proceso', valor: 3 },
      { texto: 'Roles claros y el equipo funciona sin que yo esté encima', valor: 4 },
    ],
  },
  {
    id: 'contabilidad-2',
    nombre: 'Contabilidad e Impuestos',
    pregunta: '¿Qué tan preparado estás si mañana te piden algo tu contador o ARCA?',
    opciones: [
      { texto: 'Tendría que salir a buscar todo de cero', valor: 1 },
      { texto: 'Lo tengo, pero desordenado', valor: 2 },
      { texto: 'Lo tengo bastante al día', valor: 3 },
      { texto: 'Todo en orden, sin sobresaltos', valor: 4 },
    ],
  },
  {
    id: 'tecnologia-2',
    nombre: 'Tecnología',
    pregunta: 'Si necesitaras ahora mismo un dato clave de tu negocio (ventas del mes, stock, margen), ¿en cuánto tiempo lo tendrías?',
    opciones: [
      { texto: 'Tendría que armarlo de cero, juntando de varios lados', valor: 1 },
      { texto: 'Lo tengo, pero tardo bastante en encontrarlo o calcularlo', valor: 2 },
      { texto: 'Lo tengo a mano, aunque no siempre 100% actualizado', valor: 3 },
      { texto: 'Lo tengo al instante, actualizado y confiable', valor: 4 },
    ],
  },
];

export interface ResultadoCompleto {
  overallPercent: number;
  /** Una fila por cada una de las 6 áreas, ya combinando Parte 1 + Parte 2 cuando corresponde. */
  todos: RespuestaDimension[];
  fortalezas: RespuestaDimension[];
  oportunidades: RespuestaDimension[];
}

/**
 * Combina las respuestas de las dos partes por área (no las apila): si una
 * área se preguntó en las dos (todas menos Personas), su valor final es el
 * promedio de ambas respuestas — la mirada rápida gratuita y la pregunta más
 * específica paga cuentan lo mismo. El resultado son siempre 6 filas, una
 * por área real de Prisma, nunca 11 líneas repitiendo el mismo tema.
 */
export function calcularResultadoCompleto(
  respuestasParte1: number[],
  respuestasParte2: number[],
): ResultadoCompleto {
  const p1 = DIMENSIONES.map((d, i) => ({ dimension: d.nombre, valor: respuestasParte1[i] }));
  const p2 = DIMENSIONES_PARTE2.map((d, i) => ({ dimension: d.nombre, valor: respuestasParte2[i] }));

  const porArea = new Map<string, number[]>();
  for (const s of [...p1, ...p2]) {
    porArea.set(s.dimension, [...(porArea.get(s.dimension) ?? []), s.valor]);
  }

  const todos: RespuestaDimension[] = AREAS.map((area) => {
    const valores = porArea.get(area) ?? [];
    const valor = valores.reduce((a, b) => a + b, 0) / valores.length;
    return { dimension: area, valor };
  });

  const { fortalezas, oportunidades } = separarPorValor(todos);
  const overallPercent = Math.round(
    (todos.reduce((s, x) => s + x.valor, 0) / (todos.length * 4)) * 100,
  );

  return { overallPercent, todos, fortalezas, oportunidades };
}

/**
 * Síntesis de respaldo si no hay clave de IA configurada (o si falla la
 * llamada) — sin justificar cada respuesta, solo señala 1-2 oportunidades
 * concretas y punto. Cuando GEMINI_API_KEY está configurada, el backend usa
 * en su lugar una síntesis generada por IA sobre este mismo resultado.
 */
export function sintesisRespaldo(resultado: ResultadoCompleto, nombre: string): string {
  const { oportunidades, fortalezas } = resultado;
  const saludo = nombre ? `${nombre}, ` : '';

  if (oportunidades.length === 0) {
    return `${saludo}tu negocio muestra señales sólidas en las seis áreas que medimos. El siguiente paso natural no es arreglar algo roto, sino profesionalizar lo que ya funciona para que aguante el próximo salto de tamaño.`;
  }

  const principal = oportunidades[0].dimension;
  const segunda = oportunidades[1]?.dimension;
  const fuerte = fortalezas[0]?.dimension;

  let texto = `${saludo}donde más te podemos ayudar hoy es en ${principal}${segunda ? ` y en ${segunda}` : ''}.`;
  if (fuerte) {
    texto += ` ${fuerte} está bien encaminado — no es ahí donde hace falta poner el foco.`;
  }
  texto += ' Con una conversación de 15 minutos te mostramos exactamente por dónde empezar.';
  return texto;
}

/** Lo que explícitamente se le dice al cliente que va a recibir, antes de pagar. */
export const QUE_INCLUYE_COMPLETO = [
  'Una mirada más profunda a las mismas seis áreas en las que te podemos ayudar: Estrategia, Finanzas, Administración, Personas, Contabilidad e Impuestos y Tecnología.',
  'Un análisis armado especialmente para tu negocio, no una respuesta genérica.',
  'Si nos dejás el link de tu web, la revisamos antes de la conversación.',
  'El informe completo por mail, y la posibilidad de mandarte el resultado cuando quieras.',
];
