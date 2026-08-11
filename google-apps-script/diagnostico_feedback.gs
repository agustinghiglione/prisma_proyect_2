/**
 * Feedback automático por email para el Formulario de Diagnóstico.
 *
 * Google Forms (modo Quiz) solo sabe puntuar "correcto / incorrecto" por
 * pregunta — no permite asignarle un puntaje distinto a cada opción como
 * hacemos en el sitio (1 a 4 según qué tan resuelto está cada aspecto). Por
 * eso el puntaje se calcula acá, en este script, replicando la misma lógica
 * que usaba el diagnóstico interactivo que tenía la web.
 *
 * CÓMO INSTALARLO:
 * 1. En el mismo proyecto de Apps Script donde corriste
 *    "crearAmbosFormularios", pegá este archivo (o reemplazá el anterior).
 * 2. Reemplazá FORM_ID de abajo por el ID del formulario de Diagnóstico
 *    (ya viene cargado con el tuyo).
 * 3. Elegí la función "instalarTrigger" en el menú de funciones y ejecutala
 *    una vez.
 *
 * CÓMO PROBARLO SIN LLENAR EL FORMULARIO DE NUEVO:
 * Elegí la función "probarConUltimaRespuesta" y ejecutala. Toma la última
 * respuesta ya guardada y muestra en Ver → Registros de ejecución, línea
 * por línea, cada pregunta recibida con su respuesta — así se ve
 * inmediatamente si falta algo o si el texto no coincide con lo esperado.
 *
 * IMPORTANTE: si en el log aparece "Negocio: (sin responder)" o falta
 * alguna otra pregunta, andá al formulario y confirmá que esa pregunta
 * tenga tildado el asterisco rojo de obligatoria (Configuración de la
 * pregunta → interruptor "Obligatorio"). Una pregunta no obligatoria que
 * queda en blanco directamente no aparece en la respuesta.
 */

const FORM_ID = '1axGOn7juupJ1xBOYsrTjlC20T669_X_5GFad5zZLhPw';

// Link del formulario de Agendar — se incluye en el email de feedback.
const AGENDAR_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeV-_ghT6kB363USK_9cypfasaxauq93H1gTrmtHL0CYxOOgQ/viewform';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismo texto que usaba el diagnóstico interactivo de la web.
const RECOMENDACIONES = {
  'Organización': {
    bajo: 'Ordenar procesos básicos de gestión te va a devolver horas cada semana.',
    medio: 'Formalizar los procesos que ya funcionan evitará que dependan de una sola persona.',
    alto: 'Tu organización es una fortaleza: es una buena base para escalar sin perder el control.',
  },
  'Información y decisiones': {
    bajo: 'Centralizar la información del negocio es el primer paso para decidir con más seguridad.',
    medio: 'Con reportes más claros y frecuentes vas a anticipar decisiones en lugar de reaccionar.',
    alto: 'Tomás decisiones con buena información: el próximo paso es afinar los indicadores clave.',
  },
  'Cumplimiento': {
    bajo: 'Poner en orden lo impositivo y contable te va a dar tranquilidad inmediata.',
    medio: 'Con un seguimiento más cercano podés anticiparte en vez de resolver sobre la hora.',
    alto: 'Tu cumplimiento está bien encaminado: es momento de que trabaje a tu favor, no solo en regla.',
  },
  'Crecimiento': {
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

// Se identifica cada pregunta puntuada por una palabra clave distintiva de
// su texto, no por el título exacto completo — así sobrevive a pequeños
// cambios de redacción al personalizar el formulario.
const PALABRA_CLAVE_POR_DIMENSION = [
  { dimension: 'Organización', clave: 'organización interna' },
  { dimension: 'Información y decisiones', clave: 'tomar decisiones' },
  { dimension: 'Cumplimiento', clave: 'contables e impositivas' },
  { dimension: 'Crecimiento', clave: 'estrategia clara para crecer' },
  { dimension: 'Presencia digital', clave: 'tecnología y lo digital' },
];

function instalarTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onDiagnosticoSubmit')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onDiagnosticoSubmit').forForm(form).onFormSubmit().create();
  Logger.log('Trigger instalado correctamente sobre el formulario: %s', form.getTitle());
}

/**
 * Toma la última respuesta ya guardada en el formulario y la procesa,
 * sin esperar un envío nuevo. Para debuguear rápido.
 */
function probarConUltimaRespuesta() {
  const form = FormApp.openById(FORM_ID);
  const respuestas = form.getResponses();
  if (respuestas.length === 0) {
    Logger.log('El formulario todavía no tiene ninguna respuesta guardada.');
    return;
  }
  const ultima = respuestas[respuestas.length - 1];
  Logger.log('Procesando la última respuesta (de %s en total)...', respuestas.length);
  onDiagnosticoSubmit({ response: ultima });
}

function onDiagnosticoSubmit(e) {
  const itemResponses = e.response.getItemResponses();

  Logger.log('--- Todo lo recibido en esta respuesta (%s ítems) ---', itemResponses.length);
  itemResponses.forEach((item) => {
    Logger.log('· "%s" → "%s"', item.getItem().getTitle(), item.getResponse());
  });
  Logger.log('---------------------------------------------------');

  let nombre = '';
  // El email ya no es una pregunta del formulario: se usa la opción nativa
  // "Recopilar direcciones de correo electrónico" de Configuración, que
  // Apps Script expone por un método aparte, no como un ítem más.
  let email = e.response.getRespondentEmail() || '';
  Logger.log('Email recopilado por Forms (Configuración → Respuestas): "%s"', email);
  const scores = [];

  itemResponses.forEach((item) => {
    const tituloOriginal = item.getItem().getTitle();
    const titulo = tituloOriginal.trim().toLowerCase();
    const respuesta = item.getResponse();

    if (titulo === 'nombre') {
      nombre = respuesta;
      return;
    }
    if (titulo === 'email') {
      // Por si en algún momento se vuelve a usar una pregunta manual de
      // Email en vez de (o además de) la recopilación automática.
      if (!email) email = respuesta;
      return;
    }
    if (titulo === 'negocio') {
      return; // no se usa en el cálculo, ya se logueó arriba
    }

    const match = PALABRA_CLAVE_POR_DIMENSION.find((d) => titulo.indexOf(d.clave) !== -1);
    if (!match) return;

    const opciones = item.getItem().asMultipleChoiceItem().getChoices().map((c) => c.getValue());
    const valor = opciones.indexOf(respuesta) + 1; // 1 a 4
    if (valor > 0) {
      scores.push({ dimension: match.dimension, valor: valor });
    } else {
      Logger.log(
        'ATENCIÓN: la respuesta "%s" no coincide con ninguna de las opciones esperadas para "%s". ¿Se editaron las opciones de esa pregunta?',
        respuesta,
        tituloOriginal,
      );
    }
  });

  if (!nombre) Logger.log('Nombre: (sin responder o no se encontró la pregunta "Nombre")');
  if (!email) {
    Logger.log(
      'Email: vacío. Revisá que Configuración → Respuestas → "Recopilar direcciones de correo electrónico" ' +
        'esté activado en el formulario.',
    );
  }
  Logger.log('Puntajes calculados: %s de 5 dimensiones.', scores.length);

  if (!email) {
    Logger.log('ABORTADO: no hay email al que mandar el feedback.');
    return;
  }
  if (!EMAIL_RE.test(email)) {
    Logger.log('ABORTADO: "%s" no tiene formato de email válido.', email);
    return;
  }
  if (scores.length === 0) {
    Logger.log('ABORTADO: no se pudo calcular ningún puntaje. Revisá el log de arriba.');
    return;
  }
  if (scores.length < 5) {
    Logger.log('Se calcularon solo %s de 5 dimensiones — igual se manda el email con lo disponible.', scores.length);
  }

  const ordenado = scores.slice().sort((a, b) => a.valor - b.valor);
  const oportunidades = ordenado.slice(0, 2);
  const overallPercent = Math.round((scores.reduce((s, x) => s + x.valor, 0) / (scores.length * 4)) * 100);

  const filasMapa = scores.map((s) => `${s.dimension}: ${Math.round((s.valor / 4) * 100)}%`).join('\n');

  const recomendaciones = oportunidades
    .map((o) => {
      const nivel = o.valor <= 2 ? 'bajo' : o.valor === 3 ? 'medio' : 'alto';
      return '- ' + RECOMENDACIONES[o.dimension][nivel];
    })
    .join('\n');

  const cuerpo = [
    `Hola ${nombre || ''},`,
    '',
    `Este es un primer vistazo de tu Diagnóstico Prisma®. Tu nivel general de claridad es del ${overallPercent}%.`,
    '',
    'Mapa de prioridades:',
    filasMapa,
    '',
    'Primeras recomendaciones:',
    recomendaciones,
    '',
    'Con este diagnóstico ya estás a mitad de camino: el próximo paso es que conversemos sobre tu negocio.',
    `Agendá tu primera conversación acá: ${AGENDAR_URL}`,
    '',
    'Prisma Consultora',
  ].join('\n');

  Logger.log('Enviando email a %s...', email);
  MailApp.sendEmail(email, 'Tu Informe Ejecutivo Prisma®', cuerpo);
  Logger.log('Email enviado correctamente.');
}
