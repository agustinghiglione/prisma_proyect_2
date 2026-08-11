/**
 * Cómo usar este script:
 * 1. Ir a https://script.google.com/ → Nuevo proyecto.
 * 2. Borrar el contenido de Code.gs y pegar todo este archivo.
 * 3. En el menú de funciones (arriba), elegir "crearFormularioDiagnostico" y
 *    hacer clic en Ejecutar. La primera vez va a pedir autorización.
 * 4. Repetir eligiendo "crearFormularioAgendar".
 * 5. Ver → Registros (o Ejecuciones) para copiar los links de cada formulario
 *    (el de edición y el de "para compartir").
 *
 * Crea el Formulario de Diagnóstico Prisma® con las 6 preguntas y los datos
 * de contacto, en el mismo orden que usa el sitio.
 */
function crearFormularioDiagnostico() {
  const form = FormApp.create('Diagnóstico Prisma®')
    .setDescription(
      'Respondé estas preguntas y recibí, por email, un primer vistazo claro sobre dónde está tu negocio hoy.',
    )
    .setCollectEmail(false)
    .setShowLinkToRespondAgain(false);

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

  Logger.log('Editar formulario: %s', form.getEditUrl());
  Logger.log('Link para compartir: %s', form.getPublishedUrl());
  Logger.log('ID del formulario (para el script de feedback): %s', form.getId());
}

/**
 * Crea el formulario para agendar la primera conversación.
 * No incluye selección de horario: Google Forms no tiene un selector de
 * turnos real (eso es una función de Google Calendar, no de Forms). Acá se
 * pide una preferencia de horario en texto libre y el equipo coordina por
 * email o WhatsApp.
 */
function crearFormularioAgendar() {
  const form = FormApp.create('Agendar una conversación — Prisma Consultora')
    .setDescription('Dejanos tus datos y coordinamos la primera conversación, sin costo ni compromiso.')
    .setCollectEmail(false)
    .setShowLinkToRespondAgain(false);

  form.addTextItem().setTitle('Nombre').setRequired(true);
  form.addTextItem().setTitle('Negocio').setRequired(true);
  form.addTextItem().setTitle('Email').setRequired(true);
  form.addTextItem().setTitle('Teléfono / WhatsApp (opcional)').setRequired(false);

  form
    .addCheckboxItem()
    .setTitle('¿Qué horarios te quedan mejor?')
    .setChoiceValues(['Mañana', 'Mediodía', 'Tarde', 'Cualquier horario'])
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle('Contanos brevemente en qué momento está tu negocio (opcional)')
    .setRequired(false);

  Logger.log('Editar formulario: %s', form.getEditUrl());
  Logger.log('Link para compartir: %s', form.getPublishedUrl());
}
