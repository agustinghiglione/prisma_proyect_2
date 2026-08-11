/**
 * Feedback automático por email para el Formulario de Diagnóstico.
 *
 * Google Forms (modo Quiz) solo sabe puntuar "correcto / incorrecto" por
 * pregunta — no permite asignarle un puntaje distinto a cada opción como
 * hacemos en el sitio (1 a 4 según qué tan resuelto está cada aspecto). Por
 * eso el puntaje se calcula acá, en este script, replicando la misma lógica
 * que usa el diagnóstico interactivo que tenía la web.
 *
 * CÓMO INSTALARLO:
 * 1. En el mismo proyecto de Apps Script donde corriste
 *    "crearAmbosFormularios", pegá este archivo (o reemplazá el anterior).
 * 2. Reemplazá FORM_ID de abajo por el ID del formulario de Diagnóstico.
 * 3. Elegí la función "instalarTrigger" en el menú de funciones y ejecutala
 *    una vez.
 *
 * CÓMO PROBARLO SIN LLENAR EL FORMULARIO DE NUEVO:
 * Elegí la función "probarConUltimaRespuesta" y ejecutala. Toma la última
 * respuesta que ya está guardada en el formulario y corre la misma lógica
 * que el trigger, mostrando en el Registro de ejecución (Ver → Registros)
 * exactamente qué detecta en cada paso. Mucho más rápido para debuguear.
 */

const FORM_ID = '1axGOn7juupJ1xBOYsrTjlC20T669_X_5GFad5zZLhPw';

// Link del formulario de Agendar — se incluye en el email de feedback.
const AGENDAR_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeV-_ghT6kB363USK_9cypfasaxauq93H1gTrmtHL0CYxOOgQ/viewform';

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

// Las preguntas puntuadas están en las posiciones 3 a 7 del formulario
// (0=Nombre, 1=Negocio, 2=Email, 3..7=las 5 preguntas, 8=prioridad), en
// este orden exacto — así el script no depende de que el texto de la
// pregunta no haya cambiado un poco al personalizar el formulario.
const DIMENSIONES_POR_POSICION = [
  'Organización',
  'Información y decisiones',
  'Cumplimiento',
  'Crecimiento',
  'Presencia digital',
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
  Logger.log('Respuestas recibidas: %s ítems.', itemResponses.length);

  if (itemResponses.length < 8) {
    Logger.log(
      'ATENCIÓN: se esperaban al menos 8 preguntas (Nombre, Negocio, Email + 5 puntuadas) y llegaron %s. ' +
        '¿Se agregó o sacó alguna pregunta del formulario después de crearlo? Revisá el orden.',
      itemResponses.length,
    );
  }

  const nombre = itemResponses[0] ? itemResponses[0].getResponse() : '';
  const email = itemResponses[2] ? itemResponses[2].getResponse() : '';
  Logger.log('Nombre detectado: "%s" — Email detectado: "%s"', nombre, email);

  const scores = [];
  for (let i = 0; i < DIMENSIONES_POR_POSICION.length; i++) {
    const item = itemResponses[3 + i];
    if (!item) continue;

    const respuestaTexto = item.getResponse();
    const opciones = item.getItem().asMultipleChoiceItem().getChoices().map((c) => c.getValue());
    const valor = opciones.indexOf(respuestaTexto) + 1; // 1 a 4

    Logger.log(
      'Pregunta %s (%s): respondió "%s" → valor %s',
      i + 4,
      DIMENSIONES_POR_POSICION[i],
      respuestaTexto,
      valor,
    );

    if (valor > 0) {
      scores.push({ dimension: DIMENSIONES_POR_POSICION[i], valor: valor });
    }
  }

  if (!email) {
    Logger.log('ABORTADO: no se detectó ningún email. Revisá que la pregunta 3 del formulario sea "Email".');
    return;
  }
  if (scores.length === 0) {
    Logger.log('ABORTADO: no se pudo calcular ningún puntaje. Revisá que las opciones de las preguntas 4 a 8 no se hayan modificado.');
    return;
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
