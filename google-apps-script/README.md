# Scripts para crear los formularios de Google

Estos archivos **no forman parte del sitio** — son scripts de Google Apps
Script para generar los formularios de Google rápido, en vez de armarlos a
mano campo por campo. Se corren una sola vez desde [script.google.com](https://script.google.com).

## Cómo se conectan los dos formularios

- Al completar el **Diagnóstico**, el mensaje de confirmación invita a
  agendar la conversación y deja el link directo al formulario de Agendar.
- El formulario de **Agendar** pregunta "¿Ya completaste el Diagnóstico
  Prisma®?", así el equipo sabe antes de la reunión si hay un diagnóstico
  previo para revisar.
- Cada formulario queda conectado a su propia planilla de respuestas nueva
  (el "Link to Sheets" de la interfaz de Forms, hecho automáticamente).

## Archivos

- `crear_formularios.gs` — crea ambos formularios ya conectados entre sí,
  con todas las preguntas cargadas y sus planillas de respuestas. Correr
  desde script.google.com (ver abajo).
- `prompt_gemini.md` — la misma especificación, en formato de prompt, para
  pedirle a Gemini (con acceso a Google Workspace) que arme ambos
  formularios directamente desde el chat. Alternativa más rápida si no
  querés tocar código.
- `diagnostico_feedback.gs` — opcional. Manda un email automático con un
  resumen del resultado a quien completa el Diagnóstico (lo más parecido a
  "feedback automático" que se puede lograr con Forms, ya que el modo Quiz
  nativo de Google no permite puntuar cada opción de forma graduada como
  hace el sitio).

## Cómo usarlo (con Apps Script)

1. Ir a [script.google.com](https://script.google.com) → **Nuevo proyecto**.
2. Pegar el contenido de `crear_formularios.gs`.
3. En el menú de funciones (arriba de la barra de herramientas), elegir
   `crearAmbosFormularios` → **Ejecutar**. La primera vez pide autorización
   (es tu propia cuenta de Google, no hay riesgo).
4. Abrir **Ver → Registros de ejecución** para copiar los links de cada
   formulario (edición y para compartir) y el ID del formulario de
   Diagnóstico.
5. *(Opcional)* Si querés el email automático: pegar `diagnostico_feedback.gs`
   en el mismo proyecto, reemplazar `FORM_ID` por el ID copiado en el paso
   anterior, elegir `instalarTrigger` → **Ejecutar**. Desde ahí, cada
   respuesta nueva dispara un email automático.
