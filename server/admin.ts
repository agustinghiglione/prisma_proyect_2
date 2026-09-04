import { Router } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { calcularResultado, calcularResultadoCompleto } from '../src/lib/diagnostico';
import { listarDiagnosticosPorEstados, actualizarEstadoCliente, type DiagnosticoRow } from './db';
import { enviarMailPersonalizado } from './email';

/**
 * Panel de administración interno (lo usa Damian desde la sección nueva en
 * la página de herramientas). No es una cuenta de usuario — es una única
 * contraseña compartida (ADMIN_PASSWORD), como se definió con él. En vez de
 * mandar esa contraseña en cada pedido, el login la cambia por un token
 * firmado con expiración — así no queda dando vueltas en cada request ni en
 * los logs.
 */

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24hs — suficiente para una sesión de trabajo, sin que quede para siempre.

function secreto(): string {
  // Si no se define un secreto de firma aparte, se deriva de la contraseña
  // misma — alcanza para este caso (un solo admin, sin necesidad de rotar
  // tokens de terceros) y evita que Damian tenga que configurar dos
  // variables de entorno para lo mismo.
  return process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || '';
}

function firmarToken(expiraEn: number): string {
  const payload = String(expiraEn);
  const firma = createHmac('sha256', secreto()).update(payload).digest('hex');
  return Buffer.from(`${payload}.${firma}`).toString('base64url');
}

function tokenValido(token: string): boolean {
  try {
    const decodificado = Buffer.from(token, 'base64url').toString('utf8');
    const [payload, firma] = decodificado.split('.');
    if (!payload || !firma) return false;

    const firmaEsperada = createHmac('sha256', secreto()).update(payload).digest('hex');
    const a = Buffer.from(firma);
    const b = Buffer.from(firmaEsperada);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

    const expiraEn = Number(payload);
    return Number.isFinite(expiraEn) && Date.now() < expiraEn;
  } catch {
    return false;
  }
}

export const adminRouter = Router();

adminRouter.post('/login', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'El servidor no tiene configurada ADMIN_PASSWORD.' });
  }

  const { password } = req.body ?? {};
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Falta la contraseña.' });
  }

  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);
  const coincide = a.length === b.length && timingSafeEqual(a, b);
  if (!coincide) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  const expiraEn = Date.now() + TOKEN_TTL_MS;
  res.json({ token: firmarToken(expiraEn), expiraEn });
});

/** Protege todo lo que se registre después de este middleware en el router. */
adminRouter.use((req, res, next) => {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (!token || !tokenValido(token)) {
    return res.status(401).json({ error: 'Sesión inválida o vencida. Volvé a iniciar sesión.' });
  }
  next();
});

const ESTADOS_VALIDOS = [
  'DiagnosticoA',
  'DiagnosticoFull',
  'EnContacto',
  'Contactado',
  'Agendado',
  'Trabajando',
  'FinTrabajo',
];

function resumenCliente(d: DiagnosticoRow) {
  const respuestas = JSON.parse(d.respuestas) as number[];
  const parte1 = calcularResultado(respuestas);
  const respuestas2 = d.respuestas_2 ? (JSON.parse(d.respuestas_2) as number[]) : null;
  const completo = respuestas2 ? calcularResultadoCompleto(respuestas, respuestas2) : null;

  return {
    id: d.id,
    nombre: d.nombre,
    negocio: d.negocio,
    email: d.email,
    webUrl: d.web_url,
    estado: d.estado,
    estadoCliente: d.estado_cliente,
    creadoEn: d.creado_en,
    pagadoEn: d.pagado_en,
    aceptaTerminosEn: d.acepta_terminos_en,
    emailParte1EnviadoEn: d.email_parte1_enviado_en,
    emailCompletoEnviadoEn: d.email_completo_enviado_en,
    parte1: { overallPercent: parte1.overallPercent, scores: parte1.scores },
    completo: completo
      ? { overallPercent: completo.overallPercent, scores: completo.todos, sintesis: d.sintesis }
      : null,
  };
}

/**
 * Lista de clientes para el panel, opcionalmente filtrada por estado_cliente
 * (?estados=DiagnosticoA,EnContacto). Sin filtro, trae todos. Incluye las
 * respuestas ya traducidas a porcentaje/dimensión — no los arrays crudos —
 * para que el panel no tenga que reimplementar ese cálculo.
 */
adminRouter.get('/clientes', (req, res) => {
  const estadosParam = typeof req.query.estados === 'string' ? req.query.estados : '';
  const estados = estadosParam
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  const invalidos = estados.filter((e) => !ESTADOS_VALIDOS.includes(e));
  if (invalidos.length > 0) {
    return res.status(400).json({ error: `Estado(s) inválido(s): ${invalidos.join(', ')}` });
  }

  const filas = listarDiagnosticosPorEstados(estados);
  res.json({ clientes: filas.map(resumenCliente) });
});

/**
 * Manda un mail redactado a mano (asunto + cuerpo HTML + adjunto opcional) a
 * todos los clientes cuyo estado_cliente esté entre los filtrados. Solo se
 * manda a los que tienen mail cargado. Después de cada envío exitoso, si ese
 * cliente estaba en EnContacto pasa a Contactado — el único paso del ciclo de
 * vida que se decidió automatizar así (el resto los actualiza Damian a mano).
 */
adminRouter.post('/enviar-mail', async (req, res) => {
  const { estados, asunto, cuerpoHtml, adjunto } = req.body ?? {};

  if (!Array.isArray(estados) || estados.length === 0) {
    return res.status(400).json({ error: 'Elegí al menos un estado de cliente.' });
  }
  const invalidos = estados.filter((e: unknown) => typeof e !== 'string' || !ESTADOS_VALIDOS.includes(e));
  if (invalidos.length > 0) {
    return res.status(400).json({ error: `Estado(s) inválido(s): ${invalidos.join(', ')}` });
  }
  if (!asunto || typeof asunto !== 'string' || !asunto.trim()) {
    return res.status(400).json({ error: 'Falta el asunto.' });
  }
  if (!cuerpoHtml || typeof cuerpoHtml !== 'string' || !cuerpoHtml.trim()) {
    return res.status(400).json({ error: 'Falta el cuerpo del mail.' });
  }
  if (adjunto && (typeof adjunto.filename !== 'string' || typeof adjunto.contentBase64 !== 'string')) {
    return res.status(400).json({ error: 'Adjunto inválido.' });
  }

  const clientes = listarDiagnosticosPorEstados(estados).filter((c) => !!c.email);

  let enviados = 0;
  let actualizados = 0;
  const fallidos: { email: string; error: string }[] = [];

  for (const cliente of clientes) {
    try {
      await enviarMailPersonalizado({
        to: cliente.email!,
        asunto,
        cuerpoHtml,
        adjunto: adjunto ?? null,
      });
      enviados++;
      if (cliente.estado_cliente === 'EnContacto') {
        actualizarEstadoCliente(cliente.id, 'Contactado');
        actualizados++;
      }
    } catch (err) {
      console.error(`[admin/enviar-mail] no se pudo mandar a ${cliente.email}:`, err);
      fallidos.push({ email: cliente.email!, error: err instanceof Error ? err.message : 'Error desconocido' });
    }
  }

  res.json({ destinatarios: clientes.length, enviados, actualizados, fallidos });
});
