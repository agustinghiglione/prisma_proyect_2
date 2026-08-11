/**
 * Feedback automático por email para el Formulario de Diagnóstico.
 *
 * Google Forms (modo Quiz) solo sabe puntuar "correcto / incorrecto" por
 * pregunta — no permite asignarle un puntaje distinto a cada opción como
 * hacemos en el sitio (1 a 4 según qué tan resuelto está cada aspecto). Por
 * eso el puntaje se calcula acá, en este script, replicando la misma lógica
 * que usa el diagnóstico interactivo de la web.
 *
 * CÓMO INSTALARLO:
 * 1. En el mismo proyecto de Apps Script donde corriste
 *    "crearFormularioDiagnostico" (o en uno nuevo), pegá este archivo.
 * 2. Reemplazá FORM_ID de abajo por el ID que te imprimió ese script
 *    (Logger.log "ID del formulario").
 * 3. Elegí la función "instalarTrigger" en el menú de funciones y ejecutala
 *    una vez. Eso deja el envío de emails funcionando solo, para siempre,
 *    cada vez que alguien complete el formulario.
 */

const FORM_ID = 'PEGAR_AQUI_EL_ID_DEL_FORMULARIO';

// Mismo texto que RECOMMENDATIONS en src/data/diagnostic.ts — si cambiás
// las preguntas del sitio, conviene mantener esto alineado a mano.
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

const DIMENSIONES_EN_ORDEN = ['Organización', 'Información y decisiones', 'Cumplimiento', 'Crecimiento', 'Presencia digital'];

function instalarTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onDiagnosticoSubmit')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onDiagnosticoSubmit').forForm(form).onFormSubmit().create();
  Logger.log('Trigger instalado correctamente.');
}

function onDiagnosticoSubmit(e) {
  const itemResponses = e.response.getItemResponses();

  let nombre = '';
  let email = '';
  const scores = [];

  itemResponses.forEach((item) => {
    const title = item.getItem().getTitle();
    const answer = item.getResponse();

    if (title === 'Nombre') nombre = answer;
    if (title === 'Email') email = answer;

    const dimIndex = DIMENSIONES_EN_ORDEN.indexOf(tituloADimension(title));
    if (dimIndex !== -1) {
      const opciones = item.getItem().asMultipleChoiceItem().getChoices().map((c) => c.getValue());
      const valor = opciones.indexOf(answer) + 1; // 1 a 4, mismo orden que en el sitio
      scores.push({ dimension: DIMENSIONES_EN_ORDEN[dimIndex], valor: valor });
    }
  });

  if (!email || scores.length === 0) return;

  const ordenado = scores.slice().sort((a, b) => a.valor - b.valor);
  const oportunidades = ordenado.slice(0, 2);
  const overallPercent = Math.round((scores.reduce((s, x) => s + x.valor, 0) / (scores.length * 4)) * 100);

  const filasMapa = scores
    .map((s) => `${s.dimension}: ${Math.round((s.valor / 4) * 100)}%`)
    .join('\n');

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
    'Si querés profundizar esto en una conversación, respondé este email o completá el formulario de agendamiento.',
    '',
    'Prisma Consultora',
  ].join('\n');

  MailApp.sendEmail(email, 'Tu Informe Ejecutivo Prisma®', cuerpo);
}

function tituloADimension(titulo) {
  if (titulo.indexOf('organización interna') !== -1) return 'Organización';
  if (titulo.indexOf('tomar decisiones') !== -1) return 'Información y decisiones';
  if (titulo.indexOf('contables e impositivas') !== -1) return 'Cumplimiento';
  if (titulo.indexOf('estrategia clara para crecer') !== -1) return 'Crecimiento';
  if (titulo.indexOf('tecnología y lo digital') !== -1) return 'Presencia digital';
  return null;
}
