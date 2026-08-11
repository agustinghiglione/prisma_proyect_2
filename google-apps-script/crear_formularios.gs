/**
 * Cómo usar este script:
 * 1. Ir a https://script.google.com/ → Nuevo proyecto.
 * 2. Borrar el contenido de Code.gs y pegar todo este archivo.
 * 3. En el menú de funciones (arriba), elegir "crearAmbosFormularios" y
 *    hacer clic en Ejecutar. La primera vez va a pedir autorización.
 * 4. Ver → Registros de ejecución para copiar los links de cada formulario
 *    (el de edición y el de "para compartir") y el ID del diagnóstico, que
 *    vas a necesitar si además instalás el feedback automático por email
 *    (ver diagnostico_feedback.gs).
 *
 * Qué hace:
 * - Crea el Formulario de Diagnóstico Prisma® (datos de contacto + 6
 *   preguntas) y el de Agendar una conversación.
 * - Cada uno queda conectado a su propia planilla de respuestas nueva
 *   (el "Link to Sheets" que encontraste en la interfaz, pero automático).
 * - Al terminar el Diagnóstico, el mensaje de confirmación invita a agendar
 *   la conversación y deja el link directo al otro formulario.
 * - El formulario de Agendar pregunta si la persona ya hizo el diagnóstico,
 *   para que el equipo sepa antes de la reunión si hay que revisarlo.
 */
function crearAmbosFormularios() {
  const formAgendar = crearFormularioAgendar_();
  const formDiagnostico = crearFormularioDiagnostico_(formAgendar.getPublishedUrl());

  Logger.log('--- Diagnóstico Prisma® ---');
  Logger.log('Editar: %s', formDiagnostico.getEditUrl());
  Logger.log('Compartir: %s', formDiagnostico.getPublishedUrl());
  Logger.log('ID (para el script de feedback por email): %s', formDiagnostico.getId());
  Logger.log('--- Agendar conversación ---');
  Logger.log('Editar: %s', formAgendar.getEditUrl());
  Logger.log('Compartir: %s', formAgendar.getPublishedUrl());
}

function crearFormularioDiagnostico_(agendarUrl) {
  const form = FormApp.create('Diagnóstico Prisma®')
    .setDescription(
      'Respondé estas preguntas y recibí un primer vistazo claro sobre dónde está tu negocio hoy.',
    )
    .setCollectEmail(false)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage(
      'Nos encanta poder ayudarte. Con este diagnóstico ya estás a mitad de camino: ' +
        'el próximo paso es que conversemos sobre tu negocio.\n\n' +
        'Agendá tu primera conversación acá: ' +
        agendarUrl,
    );

  const respuestas = SpreadsheetApp.create('Respuestas — Diagnóstico Prisma');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, respuestas.getId());

  form.addTextItem().setTitle('Nombre').setRequired(true);
  form.addTextItem().setTitle('Negocio').setRequired(true);
  form.addTextItem().setTitle('Email').setRequired(true);

  const preguntasPuntuadas = [
    {
      titulo: '¿Cómo describirías la organización interna de tu negocio hoy?',
      opciones: [
        'Cada cosa se resuelve como surge, sin procesos definidos',
        'Hay algo de orden, pero depende de mí estar encima de todo',
        'Existen procesos, aunque no siempre se cumplen',
        'Los procesos están definidos y el equipo los sigue',
      ],
    },
    {
      titulo: '¿Con qué información contás a la hora de tomar decisiones importantes?',
      opciones: [
        'Principalmente con intuición y experiencia',
        'Con datos sueltos, pero difíciles de cruzar',
        'Con reportes básicos que reviso de vez en cuando',
        'Con información clara y actualizada, lista para decidir',
      ],
    },
    {
      titulo: '¿Cómo te sentís hoy respecto a tus obligaciones contables e impositivas?',
      opciones: [
        'Con incertidumbre, nunca sé si está todo en orden',
        'Voy resolviendo, pero siempre corriendo de atrás',
        'Está bastante controlado, con algunas dudas puntuales',
        'Tranquilo, siento que está todo bajo control',
      ],
    },
    {
      titulo: '¿Tu negocio tiene hoy una estrategia clara para crecer?',
      opciones: [
        'No, vamos resolviendo el día a día',
        'Tenemos ideas, pero no un plan concreto',
        'Hay objetivos, aunque no siempre los seguimos de cerca',
        'Sí, con objetivos claros y seguimiento constante',
      ],
    },
    {
      titulo: '¿Qué lugar ocupa la tecnología y lo digital en tu negocio hoy?',
      opciones: [
        'Prácticamente ninguno',
        'Usamos algunas herramientas, sin mucha integración',
        'Tenemos presencia digital, pero podríamos aprovecharla mejor',
        'Es una parte activa de cómo gestionamos y vendemos',
      ],
    },
  ];

  preguntasPuntuadas.forEach((p) => {
    form.addMultipleChoiceItem().setTitle(p.titulo).setChoiceValues(p.opciones).setRequired(true);
  });

  form
    .addMultipleChoiceItem()
    .setTitle('Si pudieras resolver una sola cosa primero, ¿cuál sería?')
    .setChoiceValues([
      'Ordenar la gestión interna',
      'Entender mejor los números del negocio',
      'Tener más tranquilidad con lo impositivo',
      'Definir un rumbo claro de crecimiento',
      'Mejorar mi presencia digital',
    ])
    .setRequired(true);

  return form;
}

/**
 * No incluye selección de horario: Google Forms no tiene un selector de
 * turnos real (eso es una función de Google Calendar, no de Forms). Acá se
 * pide una preferencia de horario y el equipo coordina por email o WhatsApp.
 */
function crearFormularioAgendar_() {
  const form = FormApp.create('Agendar una conversación — Prisma Consultora')
    .setDescription('Dejanos tus datos y coordinamos la primera conversación, sin costo ni compromiso.')
    .setCollectEmail(false)
    .setShowLinkToRespondAgain(false);

  const respuestas = SpreadsheetApp.create('Respuestas — Agendar conversación');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, respuestas.getId());

  form.addTextItem().setTitle('Nombre').setRequired(true);
  form.addTextItem().setTitle('Negocio').setRequired(true);
  form.addTextItem().setTitle('Email').setRequired(true);
  form.addTextItem().setTitle('Teléfono / WhatsApp (opcional)').setRequired(false);

  form
    .addMultipleChoiceItem()
    .setTitle('¿Ya completaste el Diagnóstico Prisma®?')
    .setChoiceValues(['Sí', 'No', 'No estoy seguro'])
    .setRequired(true)
    .setHelpText('Así podemos revisarlo antes de la reunión si ya lo hiciste.');

  form
    .addCheckboxItem()
    .setTitle('¿Qué horarios te quedan mejor?')
    .setChoiceValues(['Mañana', 'Mediodía', 'Tarde', 'Cualquier horario'])
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle('Contanos brevemente en qué momento está tu negocio (opcional)')
    .setRequired(false);

  return form;
}
