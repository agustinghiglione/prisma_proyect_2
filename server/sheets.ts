/**
 * Manda una copia de cada evento importante (diagnóstico iniciado, diagnóstico
 * completo, agendamiento) a una planilla de Google Sheets, vía un Google Apps
 * Script publicado como Web App (ver google-apps-script/sheets_webhook.gs).
 *
 * Es un espejo para mirar fácil desde Drive, no la fuente de verdad — la base
 * SQLite (server/db.ts) lo sigue siendo. Por eso esto es fire-and-forget: si
 * no hay SHEETS_WEBHOOK_URL configurada, o si el POST falla, no rompe nada
 * y no bloquea la respuesta al cliente.
 */
export async function enviarASheet(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, fecha: new Date().toISOString() }),
    });
  } catch (err) {
    console.error('[sheets] no se pudo enviar el registro a Google Sheets:', err);
  }
}
