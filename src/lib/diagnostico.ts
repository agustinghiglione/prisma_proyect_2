/**
 * El cerebro del Diagnóstico Prisma®: preguntas, puntaje y síntesis.
 * Un solo lugar para esto — lo usan el frontend (resultado instantáneo) y el
 * backend (el mail con el informe).
 *
 * Las áreas que se preguntan son, a propósito, las mismas seis que Prisma
 * ofrece como servicio (Estrategia, Finanzas, Administración, Capital Humano,
 * Contabilidad e Impuestos, Tecnología). Cada pregunta describe una situación
 * concreta del servicio (nov 2026), para ubicar en qué punto está el cliente:
 * las opciones van de "todavía no lo tengo resuelto" a "ya funciona solo".
 * El orden y los ids no cambian (las respuestas se guardan por posición). Antes la Parte 1 usaba nombres
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
export const AREAS = ['Estrategia', 'Finanzas', 'Administración', 'Capital Humano', 'Contabilidad e Impuestos', 'Tecnología'] as const;

export const DIMENSIONES: Dimension[] = [
  {
    id: 'administracion',
    nombre: 'Administración',
    pregunta: '¿Cómo llevás el día a día de tu negocio: cobros, pagos a proveedores y stock?',
    opciones: [
      { texto: 'De memoria y sobre la marcha: se me pasan cobros o pagos', valor: 1 },
      { texto: 'Lo anoto en un cuaderno o un Excel, cuando tengo tiempo', valor: 2 },
      { texto: 'Tengo un sistema o una rutina, pero depende de que yo esté encima', valor: 3 },
      { texto: 'Está ordenado y funciona aunque yo no esté', valor: 4 },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    pregunta: 'A fin de mes, ¿sabés cuánto ganaste de verdad?',
    opciones: [
      { texto: 'No: miro cuánta plata quedó en la cuenta', valor: 1 },
      { texto: 'Tengo una idea, pero sin separar costos, impuestos y ganancia', valor: 2 },
      { texto: 'Lo calculo cada tanto, cuando algo no me cierra', valor: 3 },
      { texto: 'Sí: todos los meses veo ventas, costos y lo que me queda', valor: 4 },
    ],
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad e Impuestos',
    pregunta: '¿Cómo estás hoy con tus impuestos (monotributo, IVA, Ingresos Brutos y vencimientos)?',
    opciones: [
      { texto: 'Me entero de los vencimientos cuando ya pasaron', valor: 1 },
      { texto: 'Pago, pero no sé bien qué pago ni si mi categoría es la correcta', valor: 2 },
      { texto: 'Tengo contador y estoy al día, aunque nadie me explica mucho', valor: 3 },
      { texto: 'Estoy al día, entiendo lo que pago y lo planifico con tiempo', valor: 4 },
    ],
  },
  {
    id: 'estrategia',
    nombre: 'Estrategia',
    pregunta: '¿Sabés qué querés lograr con tu negocio en los próximos 12 meses?',
    opciones: [
      { texto: 'No: voy resolviendo lo que aparece cada semana', valor: 1 },
      { texto: 'Tengo una idea en la cabeza, pero nada escrito', valor: 2 },
      { texto: 'Tengo objetivos, aunque casi nunca los reviso', valor: 3 },
      { texto: 'Tengo un plan con metas y lo sigo mes a mes', valor: 4 },
    ],
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
    pregunta: '¿Cómo te encuentran y te escriben tus clientes por internet?',
    opciones: [
      { texto: 'Casi solo por recomendación: no tengo web y uso poco las redes', valor: 1 },
      { texto: 'Por redes o WhatsApp, y respondo todo a mano', valor: 2 },
      { texto: 'Tengo web o tienda online, pero me trae pocas consultas', valor: 3 },
      { texto: 'La web y los mensajes automáticos me traen consultas todas las semanas', valor: 4 },
    ],
  },
];

export const RECOMENDACIONES: Record<string, { bajo: string; medio: string; alto: string }> = {
  Administración: {
    bajo: 'Los cobros, los pagos y el stock dependen de tu memoria, y ahí es donde se pierde plata sin darse cuenta.',
    medio: 'Tenés una rutina que funciona, pero todavía depende de que vos estés encima.',
    alto: 'Tu día a día está ordenado y funciona aunque no estés: es una fortaleza real.',
  },
  Finanzas: {
    bajo: 'Hoy medís el negocio por la plata que queda en la cuenta, y eso no muestra si estás ganando.',
    medio: 'Mirás tus números cuando algo no cierra, no antes de decidir.',
    alto: 'Sabés cuánto ganás cada mes y decidís con esos números.',
  },
  'Contabilidad e Impuestos': {
    bajo: 'Los vencimientos te agarran de sorpresa o pagás sin saber si tu categoría es la correcta.',
    medio: 'Estás al día, pero sin entender del todo qué pagás ni por qué.',
    alto: 'Tus impuestos están al día y los planificás con tiempo: es donde más negocios fallan.',
  },
  Estrategia: {
    bajo: 'Vas resolviendo lo que aparece, sin un rumbo definido para el año.',
    medio: 'Tenés objetivos, pero sin un plan ni un seguimiento que los sostenga.',
    alto: 'Tenés un plan con metas y lo seguís mes a mes.',
  },
  Tecnología: {
    bajo: 'Tus clientes casi no te encuentran por internet, o respondés todo a mano.',
    medio: 'Tenés presencia online, pero todavía no te trae consultas de forma constante.',
    alto: 'Tu web y tus mensajes automáticos ya trabajan para vos todas las semanas.',
  },
  'Capital Humano': {
    bajo: 'Sumar o reemplazar a alguien se resuelve de apuro, y los roles no están claros.',
    medio: 'Tu equipo funciona, pero falta definir puestos y una forma de sumar gente.',
    alto: 'Tu equipo tiene roles claros y un proceso para crecer.',
  },
};

/** Color de cada área (los mismos de "Armá tu Prisma") para el resultado visual. */
export const COLOR_AREA: Record<string, string> = {
  'Contabilidad e Impuestos': '#345b78',
  Tecnología: '#6b5b95',
  Administración: '#7e9b78',
  Finanzas: '#d9a13f',
  Estrategia: '#c47a57',
  'Capital Humano': '#4c9393',
};

/** Qué hace Prisma en cada área: se muestra en el informe completo, junto al nivel. */
export const COMO_AYUDAMOS: Record<string, string> = {
  'Contabilidad e Impuestos': 'Monotributo, IVA e Ingresos Brutos al día, con aviso antes de cada vencimiento y recategorización.',
  Tecnología: 'Tu web en 3 días hábiles, asistentes de chat y automatizaciones para turnos, pedidos y mensajes.',
  Administración: 'Cobranzas, pagos y stock en orden, con procedimientos simples para tu equipo.',
  Finanzas: 'Flujo de caja mes a mes y revisión de costos, márgenes y precios.',
  Estrategia: 'Un plan para los próximos 12 meses, con indicadores para seguirlo.',
  'Capital Humano': 'Búsqueda y selección, definición de puestos e incentivos.',
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
  'Capital Humano': 'personas', // slug histórico: no cambiar (columnas de Sheets)
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
    pregunta: 'Cuando aparece una oportunidad (un local nuevo, un producto, una inversión), ¿cómo decidís?',
    opciones: [
      { texto: 'Por intuición, en el momento', valor: 1 },
      { texto: 'Lo consulto con alguien de confianza, sin números', valor: 2 },
      { texto: 'Hago algunas cuentas, pero sin compararlo con un plan', valor: 3 },
      { texto: 'Lo comparo con mi plan y mis indicadores antes de decidir', valor: 4 },
    ],
  },
  {
    id: 'finanzas-2',
    nombre: 'Finanzas',
    pregunta: '¿Cómo definís los precios de lo que vendés?',
    opciones: [
      { texto: 'Miro lo que cobra la competencia y pongo algo parecido', valor: 1 },
      { texto: 'Le sumo un porcentaje al costo, sin contar impuestos ni comisiones', valor: 2 },
      { texto: 'Calculo costos e impuestos, pero los actualizo tarde', valor: 3 },
      { texto: 'Conozco mi margen por producto y lo actualizo cuando cambian los costos', valor: 4 },
    ],
  },
  {
    id: 'administracion-2',
    nombre: 'Administración',
    pregunta: 'Si te tomaras una semana sin mirar el negocio, ¿qué pasaría con los cobros, los pagos y los pedidos?',
    opciones: [
      { texto: 'Se frena todo hasta que vuelva', valor: 1 },
      { texto: 'Sigue, pero con errores que después tengo que arreglar', valor: 2 },
      { texto: 'Sigue bien, aunque al volver tengo que ponerme al día', valor: 3 },
      { texto: 'Sigue igual: cada tarea tiene un responsable y un procedimiento', valor: 4 },
    ],
  },
  {
    id: 'personas',
    nombre: 'Capital Humano',
    pregunta: 'Cuando necesitás sumar o reemplazar a alguien del equipo, ¿cómo lo resolvés?',
    opciones: [
      { texto: 'Trabajo solo o lo resuelvo de apuro, con quien aparezca', valor: 1 },
      { texto: 'Busco por conocidos, sin definir bien qué necesito', valor: 2 },
      { texto: 'Defino el puesto, pero la búsqueda y el arranque son desordenados', valor: 3 },
      { texto: 'Tengo puestos definidos y un proceso para buscar y sumar gente', valor: 4 },
    ],
  },
  {
    id: 'contabilidad-2',
    nombre: 'Contabilidad e Impuestos',
    pregunta: '¿Cuándo fue la última vez que revisaste si tu categoría o tu situación ante ARCA coincide con lo que facturás hoy?',
    opciones: [
      { texto: 'Nunca lo revisé', valor: 1 },
      { texto: 'Hace más de un año', valor: 2 },
      { texto: 'Lo revisa mi contador, pero no sé qué resultado dio', valor: 3 },
      { texto: 'Lo reviso en cada recategorización, con mis números reales', valor: 4 },
    ],
  },
  {
    id: 'tecnologia-2',
    nombre: 'Tecnología',
    pregunta: '¿Cuánto de tu día se va en tareas repetidas: responder los mismos mensajes, dar turnos o pasar datos a mano?',
    opciones: [
      { texto: 'Gran parte del día', valor: 1 },
      { texto: 'Varias horas por semana', valor: 2 },
      { texto: 'Poco: ya automaticé algunas cosas', valor: 3 },
      { texto: 'Casi nada: los mensajes, los turnos y los datos se manejan solos', valor: 4 },
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
 * Frase de cierre fija para toda síntesis que ve el cliente (generada por IA
 * o de respaldo). No la escribe la IA — se agrega siempre en código, así el
 * mensaje de "esto es una primera lectura" queda garantizado sin depender
 * de que el modelo lo redacte bien cada vez. El botón de agendar ya está
 * aparte en la UI y en el mail, así que esta frase no repite esa llamada a
 * la acción — solo baja expectativas y tiende el puente hacia la charla.
 */
export const FRASE_PUENTE =
  'Esta es una primera lectura automática — la afinamos juntos en la conversación.';

/**
 * Síntesis de respaldo si no hay clave de IA configurada, si falla la
 * llamada, o si la respuesta de la IA no pasa el filtro de seguridad (ver
 * server/ia.ts) — sin justificar cada respuesta, solo señala 1-2
 * oportunidades concretas y punto. Cuando GEMINI_API_KEY está configurada y
 * la respuesta pasa el filtro, el backend usa en su lugar una síntesis
 * generada por IA sobre este mismo resultado, con la misma frase de cierre.
 */
export function sintesisRespaldo(resultado: ResultadoCompleto, nombre: string): string {
  const { oportunidades, fortalezas } = resultado;
  const saludo = nombre ? `${nombre}, ` : '';

  if (oportunidades.length === 0) {
    return `${saludo}tu negocio muestra señales sólidas en las seis áreas que medimos. El siguiente paso natural no es arreglar algo roto, sino profesionalizar lo que ya funciona para que aguante el próximo salto de tamaño. ${FRASE_PUENTE}`;
  }

  const principal = oportunidades[0].dimension;
  const segunda = oportunidades[1]?.dimension;
  const fuerte = fortalezas[0]?.dimension;

  let texto = `${saludo}donde más te podemos ayudar hoy es en ${principal}${segunda ? ` y en ${segunda}` : ''}.`;
  if (fuerte) {
    texto += ` ${fuerte} está bien encaminado — no es ahí donde hace falta poner el foco.`;
  }
  texto += ` ${FRASE_PUENTE}`;
  return texto;
}

/** Lo que explícitamente se le dice al cliente que va a recibir, antes de pagar. */
export const QUE_INCLUYE_COMPLETO = [
  'Seis preguntas más, una por cada servicio: Estrategia, Finanzas, Administración, Capital Humano, Contabilidad e Impuestos y Tecnología.',
  'Tu Prisma completo: el nivel de cada área, qué significa y cómo te podemos ayudar en cada una.',
  'Un análisis armado especialmente para tu negocio, no una respuesta genérica.',
  'Si nos dejás el link de tu web, la revisamos antes de la conversación.',
  'El informe completo por mail, y la posibilidad de mandarte el resultado cuando quieras.',
];
