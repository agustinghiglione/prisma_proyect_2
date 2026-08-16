import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(path.join(DATA_DIR, 'prisma.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS diagnosticos (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    email TEXT NOT NULL,
    negocio TEXT,
    respuestas TEXT NOT NULL,        -- JSON: número[] (1-4 por dimensión)
    web_url TEXT,                     -- opcional: URL que el cliente dejó para el análisis "por fuera"
    estado TEXT NOT NULL DEFAULT 'pendiente',  -- pendiente | pagado
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    pagado_en TEXT
  );
`);

export interface DiagnosticoRow {
  id: string;
  nombre: string | null;
  email: string;
  negocio: string | null;
  respuestas: string;
  web_url: string | null;
  estado: 'pendiente' | 'pagado';
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  creado_en: string;
  pagado_en: string | null;
}

export function crearDiagnostico(data: {
  id: string;
  nombre: string;
  email: string;
  negocio: string;
  respuestas: number[];
  webUrl?: string;
}) {
  db.prepare(
    `INSERT INTO diagnosticos (id, nombre, email, negocio, respuestas, web_url)
     VALUES (@id, @nombre, @email, @negocio, @respuestas, @webUrl)`,
  ).run({
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    negocio: data.negocio,
    respuestas: JSON.stringify(data.respuestas),
    webUrl: data.webUrl ?? null,
  });
}

export function obtenerDiagnostico(id: string): DiagnosticoRow | undefined {
  return db.prepare('SELECT * FROM diagnosticos WHERE id = ?').get(id) as DiagnosticoRow | undefined;
}

export function guardarPreferencia(id: string, preferenceId: string) {
  db.prepare('UPDATE diagnosticos SET mp_preference_id = ? WHERE id = ?').run(preferenceId, id);
}

export function marcarComoPagado(id: string, paymentId: string) {
  db.prepare(
    `UPDATE diagnosticos SET estado = 'pagado', mp_payment_id = ?, pagado_en = datetime('now') WHERE id = ?`,
  ).run(paymentId, id);
}

/** Busca un diagnóstico por el ID de preferencia de Mercado Pago (lo manda el webhook vía external_reference, pero esto sirve de respaldo). */
export function buscarPorPreferencia(preferenceId: string): DiagnosticoRow | undefined {
  return db
    .prepare('SELECT * FROM diagnosticos WHERE mp_preference_id = ?')
    .get(preferenceId) as DiagnosticoRow | undefined;
}
