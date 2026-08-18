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
    nombre TEXT NOT NULL,
    email TEXT,                       -- se pide recién si el usuario quiere el mail, o al pasar a pagar
    negocio TEXT,
    respuestas TEXT NOT NULL,        -- JSON: número[] (1-4 por dimensión) — Parte 1, gratis
    respuestas_2 TEXT,                -- JSON: número[] — Parte 2, se completa recién tras pagar
    web_url TEXT,                     -- opcional: URL que el cliente dejó para el análisis "por fuera"
    estado TEXT NOT NULL DEFAULT 'pendiente',  -- pendiente | pagado
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    pagado_en TEXT
  );
`);

// Migración liviana: si la tabla ya existía de una versión anterior sin esta
// columna, se agrega ahora. No pasa nada si ya está (se ignora el error).
try {
  db.exec('ALTER TABLE diagnosticos ADD COLUMN respuestas_2 TEXT');
} catch {
  // ya existe, seguimos
}

db.exec(`
  CREATE TABLE IF NOT EXISTS agendamientos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    hizo_diagnostico TEXT NOT NULL,   -- 'si' | 'no' | 'no_seguro'
    horario TEXT NOT NULL,             -- 'manana' | 'mediodia' | 'tarde' | 'cualquiera'
    contexto TEXT,
    creado_en TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export interface DiagnosticoRow {
  id: string;
  nombre: string;
  email: string | null;
  negocio: string | null;
  respuestas: string;
  respuestas_2: string | null;
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
  negocio?: string;
  respuestas: number[];
}) {
  db.prepare(
    `INSERT INTO diagnosticos (id, nombre, negocio, respuestas)
     VALUES (@id, @nombre, @negocio, @respuestas)`,
  ).run({
    id: data.id,
    nombre: data.nombre,
    negocio: data.negocio ?? null,
    respuestas: JSON.stringify(data.respuestas),
  });
}

/** Se llama al pedir el mail gratis, o al pasar a pagar — ambos casos completan el contacto. */
export function actualizarContacto(id: string, data: { email: string; webUrl?: string }) {
  db.prepare('UPDATE diagnosticos SET email = ?, web_url = COALESCE(?, web_url) WHERE id = ?').run(
    data.email,
    data.webUrl ?? null,
    id,
  );
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

export function guardarParte2(id: string, respuestas: number[]) {
  db.prepare('UPDATE diagnosticos SET respuestas_2 = ? WHERE id = ?').run(
    JSON.stringify(respuestas),
    id,
  );
}

export function contarDiagnosticos(): number {
  const row = db.prepare('SELECT COUNT(*) as n FROM diagnosticos').get() as { n: number };
  return row.n;
}

/** Busca un diagnóstico por el ID de preferencia de Mercado Pago (lo manda el webhook vía external_reference, pero esto sirve de respaldo). */
export function buscarPorPreferencia(preferenceId: string): DiagnosticoRow | undefined {
  return db
    .prepare('SELECT * FROM diagnosticos WHERE mp_preference_id = ?')
    .get(preferenceId) as DiagnosticoRow | undefined;
}

export interface AgendamientoData {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  hizoDiagnostico: 'si' | 'no' | 'no_seguro';
  horario: 'manana' | 'mediodia' | 'tarde' | 'cualquiera';
  contexto?: string;
}

export function crearAgendamiento(data: AgendamientoData) {
  db.prepare(
    `INSERT INTO agendamientos (id, nombre, email, telefono, hizo_diagnostico, horario, contexto)
     VALUES (@id, @nombre, @email, @telefono, @hizoDiagnostico, @horario, @contexto)`,
  ).run({
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono ?? null,
    hizoDiagnostico: data.hizoDiagnostico,
    horario: data.horario,
    contexto: data.contexto ?? null,
  });
}
