# Scripts para crear los formularios de Google

Estos archivos **no forman parte del sitio** — son scripts de Google Apps
Script para generar los formularios de Google rápido, en vez de armarlos a
mano campo por campo. Se corren una sola vez desde [script.google.com](https://script.google.com).

## Antes de leer esto

Ver la conversación con Claude para el contexto completo, pero en resumen:
el **Diagnóstico Prisma®** ya vive en el sitio como una experiencia
interactiva (una pregunta por pantalla) que calcula el informe al instante y
guarda cada respuesta en la planilla de Google Sheets automáticamente. Pasar
ese diagnóstico a un Google Form externo pierde esa experiencia y rompe la
función que reconoce si el visitante ya hizo el diagnóstico antes de llegar
a "Conversemos sobre tu negocio". Por eso estos scripts están pensados como
una **alternativa o complemento**, no un reemplazo recomendado del
diagnóstico del sitio.

Distinto es el formulario para **agendar la primera conversación**: ese
siempre fue pensado como un Google Form externo, así que no hay ningún
conflicto en armarlo así.

## Archivos

- `crear_formularios.gs` — crea ambos formularios (Diagnóstico y Agendar)
  con todas las preguntas ya cargadas.
- `diagnostico_feedback.gs` — opcional. Si igual querés que el Formulario de
  Diagnóstico le mande un email automático con un resumen del resultado a
  quien lo completa (lo más parecido a "feedback automático" que se puede
  lograr con Forms, ya que el modo Quiz nativo de Google no permite puntuar
  cada opción de forma graduada como hace el sitio).

## Cómo usarlo

1. Ir a [script.google.com](https://script.google.com) → **Nuevo proyecto**.
2. Pegar el contenido de `crear_formularios.gs`.
3. En el menú de funciones (arriba de la barra de herramientas), elegir
   `crearFormularioDiagnostico` → **Ejecutar**. La primera vez pide
   autorización (es tu propia cuenta de Google, no hay riesgo).
4. Repetir con `crearFormularioAgendar`.
5. Abrir **Ver → Registros de ejecución** para copiar los links de cada
   formulario (edición y para compartir) y el ID del formulario de
   Diagnóstico.
6. *(Opcional)* Si querés el email automático: pegar `diagnostico_feedback.gs`
   en el mismo proyecto, reemplazar `FORM_ID` por el ID copiado en el paso
   anterior, elegir `instalarTrigger` → **Ejecutar**. Desde ahí, cada
   respuesta nueva dispara un email automático.
