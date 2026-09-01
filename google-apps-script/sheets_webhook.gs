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
 * Si en algún momento cambiás este código (como ahora, que se agregaron las
 * columnas de cada pregunta), tenés que volver a pegarlo acá y hacer
 * "Implementar → Gestionar implementaciones → editar (lápiz) → Nueva
 * versión" para que el cambio quede activo en la URL que ya está en uso —
 * la URL no cambia, así que no hay que tocar nada en el servidor.
 *
 * Nota: si las pestañas "Diagnósticos (parte 1)" y "Diagnósticos completos"
 * ya existen de pruebas anteriores, sus encabezados quedaron con las
 * columnas viejas (no se actualizan solas). Para que salgan con todas las
 * columnas nuevas, borrá esas dos pestañas una vez — se vuelven a crear
 * solas, completas, con el próximo evento.
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

// Claves tal cual las manda el servidor (server/sheets.ts) — no tocar sin
// tocar también el backend.
var COLUMNAS = {
  diagnostico_parte1: [
    'fecha', 'id', 'nombre', 'negocio', 'overallPercent',
    'p1_administracion', 'p1_finanzas', 'p1_contabilidad_impuestos', 'p1_estrategia', 'p1_tecnologia',
  ],
  diagnostico_completo: [
    'fecha', 'id', 'nombre', 'negocio', 'email', 'overallPercent', 'fortalezas', 'oportunidades', 'sintesis',
    'p1_administracion', 'p1_finanzas', 'p1_contabilidad_impuestos', 'p1_estrategia', 'p1_tecnologia',
    'p2_estrategia', 'p2_finanzas', 'p2_administracion', 'p2_personas', 'p2_contabilidad_impuestos', 'p2_tecnologia',
  ],
  agendamiento: ['fecha', 'id', 'nombre', 'email', 'telefono', 'hizoDiagnostico', 'horario', 'contexto'],
};

// Encabezados legibles para cada columna — si una clave no está acá, se usa
// la clave tal cual como respaldo.
var ENCABEZADOS = {
  fecha: 'Fecha',
  id: 'ID',
  nombre: 'Nombre',
  negocio: 'Negocio',
  email: 'Email',
  telefono: 'Teléfono',
  overallPercent: '% general',
  fortalezas: 'Fortalezas',
  oportunidades: 'Oportunidades',
  sintesis: 'Síntesis',
  hizoDiagnostico: 'Hizo el diagnóstico',
  horario: 'Horario preferido',
  contexto: 'Contexto',
  p1_administracion: 'Administración (parte 1, gratis)',
  p1_finanzas: 'Finanzas (parte 1, gratis)',
  p1_contabilidad_impuestos: 'Contabilidad e Impuestos (parte 1, gratis)',
  p1_estrategia: 'Estrategia (parte 1, gratis)',
  p1_tecnologia: 'Tecnología (parte 1, gratis)',
  p2_estrategia: 'Estrategia (parte 2, paga)',
  p2_finanzas: 'Finanzas (parte 2, paga)',
  p2_administracion: 'Administración (parte 2, paga)',
  p2_personas: 'Personas (parte 2, paga)',
  p2_contabilidad_impuestos: 'Contabilidad e Impuestos (parte 2, paga)',
  p2_tecnologia: 'Tecnología (parte 2, paga)',
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
    var encabezados = columnas.map(function (c) { return ENCABEZADOS[c] || c; });
    hoja.appendRow(encabezados);
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
