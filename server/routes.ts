import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { calcularResultado, DIMENSIONES } from '../src/lib/diagnostico';
import {
  crearDiagnostico,
  obtenerDiagnostico,
  actualizarContacto,
  guardarPreferencia,
  marcarComoPagado,
} from './db';
import { crearPreferenciaDePago, consultarPago } from './mercadopago';
import { enviarResultado } from './email';

export const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Guarda las respuestas del diagnóstico gratis y devuelve el resultado
 * completo (el frontend decide qué mostrar y qué tapar). Todavía no pide
 * mail — eso es opcional acá y recién se vuelve obligatorio al pagar.
 */
router.post('/diagnostico', async (req, res) => {
  const { nombre, negocio, respuestas } = req.body ?? {};

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'Falta el nombre.' });
  }
  if (!Array.isArray(respuestas) || respuestas.length !== DIMENSIONES.length) {
    return res.status(400).json({ error: `Se esperan ${DIMENSIONES.length} respuestas.` });
  }

  const id = randomUUID();
  crearDiagnostico({ id, nombre, negocio, respuestas });

  const resultado = calcularResultado(respuestas);
  res.json({ id, resultado });
});

/** El usuario elige recibir el resultado gratis por mail (opcional, desde la pantalla de resultado). */
router.post('/diagnostico/:id/enviar-mail', async (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });

  const { email } = req.body ?? {};
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresá un email válido.' });
  }

  actualizarContacto(diagnostico.id, { email });

  try {
    const respuestas = JSON.parse(diagnostico.respuestas);
    const resultado = calcularResultado(respuestas);
    await enviarResultado({ email, nombre: diagnostico.nombre ?? '', resultado, completo: false });
    res.json({ ok: true });
  } catch (err) {
    console.error('[diagnostico] no se pudo enviar el mail gratuito:', err);
    res.status(502).json({ error: 'No pudimos mandar el mail. Probá de nuevo en un momento.' });
  }
});

/**
 * Crea la preferencia de pago de Mercado Pago. Acá sí es obligatorio el
 * mail (es donde llega el diagnóstico completo cuando se confirme el pago),
 * y se guarda el link de la web si lo dejó, para mirarla más adelante.
 */
router.post('/diagnostico/:id/pagar', async (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });
  if (diagnostico.estado === 'pagado') {
    return res.status(400).json({ error: 'Este diagnóstico ya está pagado.' });
  }

  const { email, webUrl } = req.body ?? {};
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresá un email válido para recibir el diagnóstico completo.' });
  }
  actualizarContacto(diagnostico.id, { email, webUrl });

  try {
    const { preferenceId, initPoint, qrDataUrl } = await crearPreferenciaDePago(diagnostico.id);
    guardarPreferencia(diagnostico.id, preferenceId);
    res.json({ initPoint, qrDataUrl });
  } catch (err) {
    console.error('[mercadopago] error creando la preferencia:', err);
    res.status(502).json({ error: 'No se pudo iniciar el pago. Probá de nuevo en un momento.' });
  }
});

/** El frontend consulta acá si ya se confirmó el pago (polling simple). */
router.get('/diagnostico/:id', (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });

  const respuestas = JSON.parse(diagnostico.respuestas);
  const resultado = calcularResultado(respuestas);

  res.json({ estado: diagnostico.estado, resultado });
});

/**
 * Mercado Pago llama acá cada vez que cambia el estado de un pago. NUNCA se
 * confirma un pago por el redirect del navegador solo — siempre se le
 * vuelve a preguntar a la API de Mercado Pago con el ID de pago recibido acá.
 */
router.post('/webhooks/mercadopago', async (req, res) => {
  try {
    const paymentId = req.body?.data?.id ?? req.query['data.id'];
    if (!paymentId) return res.sendStatus(200); // notificación que no nos interesa (ej. de otro tipo)

    const pago = await consultarPago(String(paymentId));
    const diagnosticoId = pago.external_reference;

    if (pago.status === 'approved' && diagnosticoId) {
      const diagnostico = obtenerDiagnostico(diagnosticoId);
      if (diagnostico && diagnostico.estado !== 'pagado') {
        marcarComoPagado(diagnosticoId, String(paymentId));
        const respuestas = JSON.parse(diagnostico.respuestas);
        const resultado = calcularResultado(respuestas);
        await enviarResultado({
          email: diagnostico.email,
          nombre: diagnostico.nombre ?? '',
          resultado,
          completo: true,
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[webhook mercadopago] error procesando la notificación:', err);
    // Se responde 200 igual: si le devolvemos error, Mercado Pago reintenta
    // en bucle una notificación que quizás nunca se pueda procesar (ej. un
    // pago de prueba viejo). El log ya deja rastro para revisar a mano.
    res.sendStatus(200);
  }
});
