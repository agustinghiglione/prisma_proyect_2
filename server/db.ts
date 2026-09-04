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
    email TEXT,                       -- obligatorio desde la Parte 1 (ver migración más abajo)
    negocio TEXT,
    respuestas TEXT NOT NULL,        -- JSON: número[] (1-4 por dimensión) — Parte 1, gratis
    respuestas_2 TEXT,                -- JSON: número[] — Parte 2, se completa recién tras pagar
    web_url TEXT,                     -- opcional: URL que el cliente dejó para el análisis "por fuera"
    sintesis TEXT,                    -- texto final (de Gemini, o el de respaldo) — se guarda para no regenerarlo en cada consulta
    estado TEXT NOT NULL DEFAULT 'pendiente',  -- pendiente | pagado
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    pagado_en TEXT,
    estado_cliente TEXT,               -- ciclo de vida del cliente: DiagnosticoA | DiagnosticoFull | EnContacto | Contactado | Agendado | Trabajando | FinTrabajo
    acepta_terminos_en TEXT,           -- cuándo aceptó Términos y Condiciones / Política de Privacidad (evidencia del consentimiento)
    email_parte1_enviado_en TEXT,      -- cuándo se le mandó el mail con el resultado de la Parte 1 (gratis)
    email_completo_enviado_en TEXT     -- cuándo se le mandó el mail con el informe completo (pago)
  );
`);

// Migraciones livianas: si la tabla ya existía de una versión anterior sin
// estas columnas, se agregan ahora. No pasa nada si ya están (se ignora el error).
for (const alter of [
  'ALTER TABLE diagnosticos ADD COLUMN respuestas_2 TEXT',
  'ALTER TABLE diagnosticos ADD COLUMN sintesis TEXT',
  'ALTER TABLE diagnosticos ADD COLUMN estado_cliente TEXT',
  'ALTER TABLE diagnosticos ADD COLUMN acepta_terminos_en TEXT',
  'ALTER TABLE diagnosticos ADD COLUMN email_parte1_enviado_en TEXT',
  'ALTER TABLE diagnosticos ADD COLUMN email_completo_enviado_en TEXT',
]) {
  try {
    db.exec(alter);
  } catch {
    // ya existe, seguimos
  }
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
  sintesis: string | null;
  estado: 'pendiente' | 'pagado';
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  creado_en: string;
  pagado_en: string | null;
  estado_cliente: string | null;
  acepta_terminos_en: string | null;
  email_parte1_enviado_en: string | null;
  email_completo_enviado_en: string | null;
}

/**
 * Alta del diagnóstico — desde ahora el mail (y la aceptación de Términos y
 * Política de Privacidad) son obligatorios ya en la Parte 1, no recién al
 * pagar: así se le puede mandar por mail el resultado gratis aunque nunca
 * pague el completo. `estado_cliente` arranca en 'DiagnosticoA' — el primer
 * escalón del ciclo de vida del cliente.
 */
export function crearDiagnostico(data: {
  id: string;
  nombre: string;
  negocio: string;
  email: string;
  respuestas: number[];
}) {
  db.prepare(
    `INSERT INTO diagnosticos (id, nombre, negocio, email, respuestas, estado_cliente, acepta_terminos_en)
     VALUES (@id, @nombre, @negocio, @email, @respuestas, 'DiagnosticoA', datetime('now'))`,
  ).run({
    id: data.id,
    nombre: data.nombre,
    negocio: data.negocio,
    email: data.email,
    respuestas: JSON.stringify(data.respuestas),
  });
}

/** Se llama al pasar a pagar — el mail ya está seteado desde la Parte 1, esto permite corregirlo y sumar la web opcional. */
export function actualizarContacto(id: string, data: { email: string; webUrl?: string }) {
  db.prepare('UPDATE diagnosticos SET email = ?, web_url = COALESCE(?, web_url) WHERE id = ?').run(
    data.email,
    data.webUrl ?? null,
    id,
  );
}

/** Se llama justo después de mandar el mail de la Parte 1 (gratis) — deja registro de cuándo se mandó. */
export function marcarEmailParte1Enviado(id: string) {
  db.prepare(`UPDATE diagnosticos SET email_parte1_enviado_en = datetime('now') WHERE id = ?`).run(id);
}

/** Se llama justo después de mandar el informe completo (pago) — deja registro de cuándo se mandó y avanza el estado del cliente. */
export function marcarEmailCompletoEnviado(id: string) {
  db.prepare(
    `UPDATE diagnosticos SET email_completo_enviado_en = datetime('now'), estado_cliente = 'DiagnosticoFull' WHERE id = ?`,
  ).run(id);
}

/**
 * Busca el diagnóstico más reciente de un mail — se usa para, al llegar un
 * pedido de agendar, encontrar "al mismo cliente" y avanzar su estado a
 * EnContacto (si todavía no llegó más lejos que eso).
 */
export function buscarDiagnosticoPorEmail(email: string): DiagnosticoRow | undefined {
  return db
    .prepare('SELECT * FROM diagnosticos WHERE email = ? ORDER BY creado_en DESC LIMIT 1')
    .get(email) as DiagnosticoRow | undefined;
}

export function actualizarEstadoCliente(id: string, estado: string) {
  db.prepare('UPDATE diagnosticos SET estado_cliente = ? WHERE id = ?').run(estado, id);
}

/**
 * Para el panel de administración: todos los diagnósticos cuyo estado_cliente
 * esté entre los pedidos (o todos, si no se pasa ninguno), del más nuevo al
 * más viejo. Se usa tanto para listar/filtrar como para armar la lista de
 * destinatarios al mandar un mail masivo desde el panel.
 */
export function listarDiagnosticosPorEstados(estados: string[]): DiagnosticoRow[] {
  if (estados.length === 0) {
    return db.prepare('SELECT * FROM diagnosticos ORDER BY creado_en DESC').all() as DiagnosticoRow[];
  }
  const placeholders = estados.map(() => '?').join(', ');
  return db
    .prepare(`SELECT * FROM diagnosticos WHERE estado_cliente IN (${placeholders}) ORDER BY creado_en DESC`)
    .all(...estados) as DiagnosticoRow[];
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

export function guardarSintesis(id: string, sintesis: string) {
  db.prepare('UPDATE diagnosticos SET sintesis = ? WHERE id = ?').run(sintesis, id);
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
