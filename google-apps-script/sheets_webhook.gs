/**
 * Web App que recibe los eventos del backend de Prisma (server/sheets.ts) y
 * los va agregando como filas en esta misma planilla, una pestaña por tipo
 * de evento. No hace falta tocar nada del backend para usar esto — el
 * backend ya manda los datos, esto solo los recibe y los escribe.
 *
 * Cómo instalarlo (una sola vez):
 * 1. Creá una planilla nueva en Google Sheets (puede estar vacía).
 * 2. Extensiones → Apps Script. Borrá el contenido de Code.gs que viene por
 *    defecto y pegá este archivo entero en su lugar.
 * 3. Guardá (el ícono de disquete). Ponele un nombre al proyecto si te lo pide.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier usuario" (así el servidor puede
 *      llamarla sin que le pidan iniciar sesión con una cuenta de Google)
 * 5. Autorizá los permisos que te pida (es tu propio script, es seguro).
 * 6. Copiá la URL que te da ("URL de la aplicación web", termina en /exec).
 * 7. Esa URL va en el .env.local del servidor, como SHEETS_WEBHOOK_URL.
 *
 * Si en algún momento cambiás este código, tenés que "Implementar → Gestionar
 * implementaciones → editar (lápiz) → Nueva versión" para que el cambio
 * quede activo en la URL que ya está en uso.
 */

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
  var libro = SpreadsheetApp.getActiveSpreadsheet();
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
