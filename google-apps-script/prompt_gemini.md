# Prompt para Gemini (con acceso a Google Workspace)

Pegar tal cual en el chat. Pide crear el formulario de Agendar primero
porque el de Diagnóstico necesita su link para el mensaje de confirmación.

---

Necesito que crees dos Google Forms nuevos, en este orden, porque el primero necesita el link del segundo.

## 1. Formulario "Agendar una conversación — Prisma Consultora"

Descripción: "Dejanos tus datos y coordinamos la primera conversación, sin costo ni compromiso."

Preguntas, en este orden:
1. Nombre — respuesta corta, obligatoria
2. Negocio — respuesta corta, obligatoria
3. Email — respuesta corta, obligatoria
4. Teléfono / WhatsApp (opcional) — respuesta corta, no obligatoria
5. ¿Ya completaste el Diagnóstico Prisma®? — opción múltiple, obligatoria. Opciones: "Sí", "No", "No estoy seguro". Texto de ayuda: "Así podemos revisarlo antes de la reunión si ya lo hiciste."
6. ¿Qué horarios te quedan mejor? — casillas de verificación, obligatoria. Opciones: "Mañana", "Mediodía", "Tarde", "Cualquier horario"
7. Contanos brevemente en qué momento está tu negocio (opcional) — párrafo, no obligatoria

Conectá las respuestas a una planilla de Google Sheets nueva llamada "Respuestas — Agendar conversación" (en Respuestas → ícono de Sheets → crear planilla nueva).

Cuando termines, dame el link para compartir (el que empieza con forms.gle o docs.google.com/forms/d/e/.../viewform).

## 2. Formulario "Diagnóstico Prisma®"

Descripción: "Respondé estas preguntas y recibí un primer vistazo claro sobre dónde está tu negocio hoy."

Preguntas, en este orden:
1. Nombre — respuesta corta, obligatoria
2. Negocio — respuesta corta, obligatoria
3. Email — respuesta corta, obligatoria
4. ¿Cómo describirías la organización interna de tu negocio hoy? — opción múltiple, obligatoria. Opciones en este orden exacto:
   - Cada cosa se resuelve como surge, sin procesos definidos
   - Hay algo de orden, pero depende de mí estar encima de todo
   - Existen procesos, aunque no siempre se cumplen
   - Los procesos están definidos y el equipo los sigue
5. ¿Con qué información contás a la hora de tomar decisiones importantes? — opción múltiple, obligatoria. Opciones:
   - Principalmente con intuición y experiencia
   - Con datos sueltos, pero difíciles de cruzar
   - Con reportes básicos que reviso de vez en cuando
   - Con información clara y actualizada, lista para decidir
6. ¿Cómo te sentís hoy respecto a tus obligaciones contables e impositivas? — opción múltiple, obligatoria. Opciones:
   - Con incertidumbre, nunca sé si está todo en orden
   - Voy resolviendo, pero siempre corriendo de atrás
   - Está bastante controlado, con algunas dudas puntuales
   - Tranquilo, siento que está todo bajo control
7. ¿Tu negocio tiene hoy una estrategia clara para crecer? — opción múltiple, obligatoria. Opciones:
   - No, vamos resolviendo el día a día
   - Tenemos ideas, pero no un plan concreto
   - Hay objetivos, aunque no siempre los seguimos de cerca
   - Sí, con objetivos claros y seguimiento constante
8. ¿Qué lugar ocupa la tecnología y lo digital en tu negocio hoy? — opción múltiple, obligatoria. Opciones:
   - Prácticamente ninguno
   - Usamos algunas herramientas, sin mucha integración
   - Tenemos presencia digital, pero podríamos aprovecharla mejor
   - Es una parte activa de cómo gestionamos y vendemos
9. Si pudieras resolver una sola cosa primero, ¿cuál sería? — opción múltiple, obligatoria. Opciones:
   - Ordenar la gestión interna
   - Entender mejor los números del negocio
   - Tener más tranquilidad con lo impositivo
   - Definir un rumbo claro de crecimiento
   - Mejorar mi presencia digital

Importante: NO actives el modo Quiz/cuestionario. Son preguntas de diagnóstico, no un examen con respuestas correctas.

Configurá el mensaje de confirmación (Configuración → Presentación → mensaje de confirmación) con este texto exacto, reemplazando [LINK_AGENDAR] por el link para compartir del formulario "Agendar una conversación" que creaste en el paso 1:

"Nos encanta poder ayudarte. Con este diagnóstico ya estás a mitad de camino: el próximo paso es que conversemos sobre tu negocio.

Agendá tu primera conversación acá: [LINK_AGENDAR]"

Conectá las respuestas a una planilla de Google Sheets nueva llamada "Respuestas — Diagnóstico Prisma".

Cuando termines, dame el link para compartir de este formulario también.

---

Si por algún motivo no podés configurar el mensaje de confirmación o conectar la planilla automáticamente, decime cuáles pasos quedaron pendientes para hacerlos manualmente.
