/**
 * Web App que recibe los eventos del backend de Prisma (server/sheets.ts) y
 * los va agregando como filas en la planilla indicada más abajo, una pestaña
 * por tipo de evento. No hace falta tocar nada del backend para usar esto —
 * el backend ya manda los datos, esto solo los recibe y los escribe.
 *
 * Este script es INDEPENDIENTE (no está atado a la planilla): se crea desde
 * script.google.com y apunta a la planilla por su ID. Esto evita el error
 * "No se puede abrir el archivo en estos momentos" que a veces tira el menú
 * Extensiones → Apps Script dentro de Sheets.
 *
 * Cómo instalarlo (una sola vez):
 * 1. Andá directo a https://script.google.com/home (con la misma cuenta de
 *    Google donde está la planilla).
 * 2. "Proyecto nuevo". Borrá el contenido de Code.gs que viene por defecto y
 *    pegá este archivo entero en su lugar.
 * 3. Reemplazá el valor de ID_PLANILLA de abajo por el ID de tu planilla
 *    (ya está completado con el que me pasaste).
 * 4. Guardá (el ícono de disquete). Ponele un nombre al proyecto si te lo pide.
 * 5. Implementar → Nueva implementación → tipo "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier usuario" (así el servidor puede
 *      llamarla sin que le pidan iniciar sesión con una cuenta de Google)
 * 6. Autorizá los permisos que te pida (es tu propio script, es seguro).
 *    La primera vez Google va a mostrar una pantalla de advertencia porque
 *    el script no está verificado por Google — es normal en scripts propios:
 *    "Configuración avanzada" → "Ir a [nombre del proyecto] (no seguro)".
 * 7. Copiá la URL que te da ("URL de la aplicación web", termina en /exec).
 * 8. Esa URL va en el .env.local del servidor, como SHEETS_WEBHOOK_URL.
 *
 * Si en algún momento cambiás este código, tenés que "Implementar → Gestionar
 * implementaciones → editar (lápiz) → Nueva versión" para que el cambio
 * quede activo en la URL que ya está en uso.
 */

var ID_PLANILLA = '1yApaepiSSHntAwYu8a-9bqld1jkLYMSJ-qOpYr6aF7w';

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    var hoja = obtenerOCrearHoja_(datos.tipo);
    escribirFila_(hoja, datos);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

var COLUMNAS = {
  diagnostico_parte1: ['fecha', 'id', 'nombre', 'negocio', 'overallPercent'],
  diagnostico_completo: ['fecha', 'id', 'nombre', 'negocio', 'email', 'overallPercent', 'fortalezas', 'oportunidades', 'sintesis'],
  agendamiento: ['fecha', 'id', 'nombre', 'email', 'telefono', 'hizoDiagnostico', 'horario', 'contexto'],
};

var NOMBRES_HOJA = {
  diagnostico_parte1: 'Diagnósticos (parte 1)',
  diagnostico_completo: 'Diagnósticos completos',
  agendamiento: 'Agendamientos',
};

function obtenerOCrearHoja_(tipo) {
  var nombreHoja = NOMBRES_HOJA[tipo] || 'Otros eventos';
  var libro = SpreadsheetApp.openById(ID_PLANILLA);
  var hoja = libro.getSheetByName(nombreHoja);
  if (!hoja) {
    hoja = libro.insertSheet(nombreHoja);
    var columnas = COLUMNAS[tipo] || ['fecha', 'datos'];
    hoja.appendRow(columnas);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function escribirFila_(hoja, datos) {
  var columnas = COLUMNAS[datos.tipo] || ['fecha', 'datos'];
  var fila = columnas.map(function (col) {
    return datos[col] !== undefined ? datos[col] : '';
  });
  hoja.appendRow(fila);
}
