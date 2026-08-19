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
    bajo: 'Hoy gran parte de la operación pasa por vos o por la memoria del equipo, y eso frena cualquier intento de crecer sin que todo dependa de una sola persona. Desde Administración diseñamos procesos claros para las tareas que se repiten, así la gestión diaria deja de improvisarse.',
    medio: 'Tenés rutinas que funcionan, pero todavía viven en la cabeza de alguien más que en un proceso escrito — por eso se rompen apenas esa persona falta o el negocio crece un poco. Desde Administración te ayudamos a formalizarlas para que sostengan el ritmo sin depender de nadie en particular.',
    alto: 'Tu organización ya es una fortaleza real: los procesos sostienen la operación aunque vos no estés encima de cada detalle. Es la base correcta para escalar — el trabajo que sigue es de Estrategia, para que ese orden acompañe el próximo salto de tamaño.',
  },
  'Información y decisiones': {
    bajo: 'Tomás decisiones importantes sin tener los números a mano, así que muchas veces se deciden con la sensación del momento, no con datos. Desde Finanzas centralizamos esa información dispersa en un solo lugar, para que decidir deje de ser un salto de fe.',
    medio: 'Tenés reportes, pero los mirás recién cuando algo urge — así siempre vas un paso atrás del problema, no adelante. Con un ritmo de revisión fijo desde Finanzas, empezás a anticipar en vez de reaccionar.',
    alto: 'Tomás decisiones con información real y actualizada, algo que a la mayoría de los negocios le cuesta. El siguiente paso, desde Finanzas, es afinar qué indicadores mirás para que cada número que revisás tenga un motivo concreto.',
  },
  Cumplimiento: {
    bajo: 'Vas resolviendo lo impositivo y contable sobre la hora, lo que además de estrés puede salir caro en intereses o multas evitables. Desde Contabilidad e Impuestos ponemos esto en orden de una vez, para que dejes de vivir pendiente de la próxima fecha límite.',
    medio: 'Estás en regla, pero cada vencimiento te genera tensión porque no hay un sistema que lo anticipe por vos. Desde Contabilidad e Impuestos armamos ese seguimiento, para que cumplir deje de sentirse una carrera contra el calendario.',
    alto: 'Tu cumplimiento está sólido — no es poco, es donde más negocios fallan. El paso que sigue, también desde Contabilidad e Impuestos, es que esa prolijidad te sirva además para proyectar impuestos y planificar, no solo para estar en regla.',
  },
  Crecimiento: {
    bajo: 'No tenés una dirección definida todavía: vas resolviendo lo que aparece en el día a día, sin un rumbo que ordene esas decisiones. Desde Estrategia definimos objetivos concretos, para que cada decisión de hoy sume a algo más grande.',
    medio: 'Tenés una idea de hacia dónde ir, pero sin un plan que la sostenga se diluye apenas se complica el día a día. Desde Estrategia la convertimos en un plan con seguimiento real, no en una intención.',
    alto: 'Tenés una estrategia de crecimiento que funciona — el riesgo ahora no es la falta de rumbo, sino quedarte sin los recursos para sostenerlo. Desde Estrategia trabajamos en acelerarlo sin que la estructura se quede corta.',
  },
  'Presencia digital': {
    bajo: 'Lo digital todavía es una materia pendiente, y hoy eso es una desventaja competitiva más que un detalle menor. Desde Tecnología damos los primeros pasos concretos, sin necesidad de una transformación gigante para empezar a notar la diferencia.',
    medio: 'Tenés herramientas digitales, pero sueltas — cada una hace lo suyo sin hablar con las demás, y así se pierde la mitad del valor de tenerlas. Desde Tecnología las conectamos para que trabajen juntas, no en paralelo.',
    alto: 'Lo digital ya es parte activa de cómo vendés y te organizás — estás mejor que la mayoría. Desde Tecnología, el siguiente paso es que esas herramientas te den información, no solo que te faciliten tareas.',
  },
};

/** A qué área real de Prisma pertenece cada dimensión — para conectar cada resultado con el equipo que lo resuelve. */
export const AREA_PRISMA: Record<string, string> = {
  Organización: 'Administración',
  'Información y decisiones': 'Finanzas',
  Cumplimiento: 'Contabilidad e Impuestos',
  Crecimiento: 'Estrategia',
  'Presencia digital': 'Tecnología',
  Estrategia: 'Estrategia',
  Finanzas: 'Finanzas',
  Administración: 'Administración',
  Personas: 'Personas',
  'Contabilidad e Impuestos': 'Contabilidad e Impuestos',
  Tecnología: 'Tecnología',
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
    bajo: 'No tener un plan escrito significa que cada decisión importante arranca de cero, sin nada que la sostenga si las cosas se complican. Esto es exactamente lo que trabajamos en Estrategia: convertir una idea general en objetivos concretos con seguimiento real.',
    medio: 'Tenés un plan, pero desactualizado — y un plan viejo pesa menos que ninguno, porque da una falsa sensación de rumbo. En Estrategia lo actualizamos con tu realidad de hoy para que vuelva a ser una herramienta de decisión.',
    alto: 'Usás tu plan activamente para decidir, que es exactamente el punto. En Estrategia el siguiente paso es revisarlo con más frecuencia, para que evolucione al ritmo del negocio.',
  },
  Finanzas: {
    bajo: 'Sin calcular la rentabilidad real, es perfectamente posible estar vendiendo cada vez más y ganando cada vez menos, sin darte cuenta. En Finanzas armamos esa visibilidad desde cero, para que sepas con certeza qué te deja plata y qué no.',
    medio: 'Revisás la rentabilidad, pero sin un ritmo fijo — así los problemas se detectan tarde, cuando ya crecieron. En Finanzas instalamos una revisión mensual simple, para verlos venir antes.',
    alto: 'Revisás tus números todos los meses con claridad, algo poco común. En Finanzas el siguiente paso es usar esa información para decidir más rápido, no solo para estar informado.',
  },
  Administración: {
    bajo: 'La parte administrativa se resuelve a los ponchazos, lo que se traduce en errores, pagos tardíos y tiempo que se va en apagar incendios en lugar de trabajar. En Administración ordenamos esto con un proceso simple, aunque tu negocio sea chico.',
    medio: 'Lo administrativo depende enteramente de vos — funciona, pero se detiene apenas no estás disponible. En Administración armamos un sistema que no dependa de una sola persona.',
    alto: 'Tu administración está ordenada y no depende de vos en cada paso — dejó de ser un cuello de botella. En Administración el siguiente paso es medirla, para encontrar dónde afinarla.',
  },
  Personas: {
    bajo: 'Sin roles claros, todo termina pasando por la misma persona (probablemente vos), y eso pone un techo bajo a cuánto puede crecer el negocio. En Personas definimos esos roles, aunque el equipo sea de una sola persona además de vos.',
    medio: 'Hay roles, pero se superponen seguido, y esa fricción diaria cuesta más tiempo del que parece. En Personas ajustamos esos límites para que cada quien sepa exactamente qué le toca.',
    alto: 'Tu equipo funciona sin que estés encima de cada tarea — es un activo real. En Personas el siguiente paso es que ese funcionamiento se sostenga mientras el equipo crece.',
  },
  'Contabilidad e Impuestos': {
    bajo: 'Si mañana te piden algo, hoy tendrías que salir a buscarlo de cero — eso es tiempo y estrés que se puede evitar. En Contabilidad e Impuestos ponemos todo al día ahora, que siempre es más barato que resolverlo bajo presión.',
    medio: 'Lo tenés, pero desordenado, lo que te hace perder tiempo cada vez que hace falta algo puntual. En Contabilidad e Impuestos lo organizamos para que esté siempre a mano, no solo cuando lo necesitás con urgencia.',
    alto: 'Todo en orden, sin sobresaltos — es una base sólida. En Contabilidad e Impuestos el siguiente paso es que esa prolijidad también te ayude a anticipar y planificar, no solo a cumplir.',
  },
  Tecnología: {
    bajo: 'Hacer todo de forma manual pone un techo bajo a cuánto podés crecer sin sumar más horas de trabajo. En Tecnología incorporamos la primera herramienta correcta — una sola, bien elegida — antes de pensar en digitalizar todo junto.',
    medio: 'Tenés varias herramientas, pero no hablan entre sí, y eso te obliga a cargar la misma información más de una vez. En Tecnología las conectamos para que compartan datos automáticamente.',
    alto: 'Tu stack de herramientas ya te ahorra tiempo real — estás mejor que la mayoría de los negocios de tu tamaño. En Tecnología el siguiente paso es sacarle datos, no solo tareas.',
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
