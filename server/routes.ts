import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import {
  calcularResultado,
  calcularResultadoCompleto,
  DIMENSIONES,
  DIMENSIONES_PARTE2,
  respuestasParaSheet,
} from '../src/lib/diagnostico';
import {
  crearDiagnostico,
  obtenerDiagnostico,
  actualizarContacto,
  guardarPreferencia,
  marcarComoPagado,
  guardarParte2,
  guardarSintesis,
  contarDiagnosticos,
  crearAgendamiento,
  marcarEmailParte1Enviado,
  marcarEmailCompletoEnviado,
  buscarDiagnosticoPorEmail,
  actualizarEstadoCliente,
} from './db';
import { crearPreferenciaDePago, consultarPago } from './mercadopago';
import { enviarInformeCompleto, enviarInformeParte1, enviarNotificacionAgendamiento } from './email';
import { generarSintesis } from './ia';
import { enviarASheet } from './sheets';

const HORARIOS_VALIDOS = ['manana', 'mediodia', 'tarde', 'cualquiera'];
const DIAGNOSTICO_VALIDOS = ['si', 'no', 'no_seguro'];

export const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Guarda las respuestas del diagnóstico gratis y devuelve el resultado
 * completo (el frontend decide qué mostrar y qué tapar). El mail, el
 * negocio y la aceptación de Términos y Política de Privacidad son
 * obligatorios ya en este primer paso — no recién al pagar — porque el
 * resultado de esta Parte 1 se manda por mail aunque el cliente nunca pague
 * el diagnóstico completo.
 */
router.post('/diagnostico', async (req, res) => {
  const { nombre, negocio, email, aceptaTerminos, respuestas } = req.body ?? {};

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'Falta el nombre.' });
  }
  if (!negocio || typeof negocio !== 'string' || !negocio.trim()) {
    return res.status(400).json({ error: 'Falta el nombre de tu negocio.' });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresá un email válido.' });
  }
  if (aceptaTerminos !== true) {
    return res.status(400).json({ error: 'Tenés que aceptar los Términos y la Política de Privacidad.' });
  }
  if (!Array.isArray(respuestas) || respuestas.length !== DIMENSIONES.length) {
    return res.status(400).json({ error: `Se esperan ${DIMENSIONES.length} respuestas.` });
  }

  const id = randomUUID();
  crearDiagnostico({ id, nombre, negocio, email, respuestas });

  const resultado = calcularResultado(respuestas);

  void enviarASheet({
    tipo: 'diagnostico_parte1',
    id,
    nombre,
    negocio,
    email,
    overallPercent: resultado.overallPercent,
    ...respuestasParaSheet(DIMENSIONES, respuestas, 'p1'),
  });

  try {
    await enviarInformeParte1({ email, nombre, resultado });
    marcarEmailParte1Enviado(id);
  } catch (err) {
    // No bloquea la respuesta: el resultado ya se ve en pantalla aunque el
    // mail falle — igual que en la Parte 2, no queremos que un problema de
    // SMTP le tape a alguien su propio diagnóstico.
    console.error('[diagnostico] no se pudo enviar el mail de la Parte 1:', err);
  }

  res.json({ id, resultado });
});

/**
 * Cuántos diagnósticos se iniciaron en total — la prueba social que se
 * muestra al empezar y antes de pagar. Cuenta real, no un número fijo.
 */
router.get('/estadisticas', (_req, res) => {
  res.json({ total: contarDiagnosticos() });
});

/**
 * Crea la preferencia de pago de Mercado Pago. El mail ya quedó guardado
 * desde la Parte 1 — acá solo se permite corregirlo si hace falta, y se
 * guarda el link de la web si lo dejó, para mirarla más adelante.
 *
 * Modo de prueba: con SKIP_PAYMENT=true en el entorno, se salta Mercado Pago
 * por completo y el diagnóstico se marca pagado directo — pensado para
 * compartir el sitio y que se pueda ver el diagnóstico completo sin pagar
 * de verdad. Se saca borrando esa variable de entorno, sin tocar código.
 */
router.post('/diagnostico/:id/pagar', async (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });
  if (diagnostico.estado === 'pagado') {
    return res.status(400).json({ error: 'Este diagnóstico ya está pagado.' });
  }

  const { email, webUrl } = req.body ?? {};
  const emailFinal = email || diagnostico.email;
  if (!emailFinal || !EMAIL_RE.test(emailFinal)) {
    return res.status(400).json({ error: 'Ingresá un email válido para recibir el diagnóstico completo.' });
  }
  actualizarContacto(diagnostico.id, { email: emailFinal, webUrl });

  if (process.env.SKIP_PAYMENT === 'true') {
    marcarComoPagado(diagnostico.id, 'modo-prueba');
    return res.json({ omitido: true });
  }

  try {
    const { preferenceId, initPoint, qrDataUrl } = await crearPreferenciaDePago(diagnostico.id);
    guardarPreferencia(diagnostico.id, preferenceId);
    res.json({ initPoint, qrDataUrl });
  } catch (err) {
    console.error('[mercadopago] error creando la preferencia:', err);
    res.status(502).json({ error: 'No se pudo iniciar el pago. Probá de nuevo en un momento.' });
  }
});

/**
 * El frontend consulta acá si ya se confirmó el pago (polling simple), y si
 * la Parte 2 ya está completa. Mientras no lo esté, el frontend sabe que
 * tiene que mostrar las 6 preguntas adicionales.
 */
router.get('/diagnostico/:id', (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });

  const respuestas = JSON.parse(diagnostico.respuestas);
  const resultado = calcularResultado(respuestas);
  const parte2Completa = !!diagnostico.respuestas_2;

  res.json({
    estado: diagnostico.estado,
    resultado,
    parte2Completa,
    resultadoCompleto: parte2Completa
      ? calcularResultadoCompleto(respuestas, JSON.parse(diagnostico.respuestas_2!))
      : null,
    sintesis: parte2Completa ? diagnostico.sintesis : null,
  });
});

/**
 * Se llama recién cuando el diagnóstico ya está pagado — completa la Parte 2
 * y con eso arma y manda el informe completo por mail.
 */
router.post('/diagnostico/:id/parte-2', async (req, res) => {
  const diagnostico = obtenerDiagnostico(req.params.id);
  if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado.' });
  if (diagnostico.estado !== 'pagado') {
    return res.status(403).json({ error: 'Este diagnóstico todavía no está pagado.' });
  }

  const { respuestas } = req.body ?? {};
  if (!Array.isArray(respuestas) || respuestas.length !== DIMENSIONES_PARTE2.length) {
    return res.status(400).json({ error: `Se esperan ${DIMENSIONES_PARTE2.length} respuestas.` });
  }

  guardarParte2(diagnostico.id, respuestas);

  const respuestasParte1 = JSON.parse(diagnostico.respuestas);
  const resultadoCompleto = calcularResultadoCompleto(respuestasParte1, respuestas);

  const sintesis = await generarSintesis(resultadoCompleto, diagnostico.nombre ?? '', diagnostico.negocio);
  guardarSintesis(diagnostico.id, sintesis);

  void enviarASheet({
    tipo: 'diagnostico_completo',
    id: diagnostico.id,
    nombre: diagnostico.nombre ?? '',
    negocio: diagnostico.negocio ?? '',
    email: diagnostico.email ?? '',
    overallPercent: resultadoCompleto.overallPercent,
    fortalezas: resultadoCompleto.fortalezas.map((f) => f.dimension).join(', '),
    oportunidades: resultadoCompleto.oportunidades.map((o) => o.dimension).join(', '),
    sintesis,
    ...respuestasParaSheet(DIMENSIONES, respuestasParte1, 'p1'),
    ...respuestasParaSheet(DIMENSIONES_PARTE2, respuestas, 'p2'),
  });

  try {
    if (diagnostico.email) {
      await enviarInformeCompleto({
        email: diagnostico.email,
        nombre: diagnostico.nombre ?? '',
        resultado: resultadoCompleto,
        sintesis,
      });
      marcarEmailCompletoEnviado(diagnostico.id);
    }
  } catch (err) {
    // No bloquea la respuesta: el informe ya se puede ver en pantalla aunque
    // el mail falle.
    console.error('[diagnostico] no se pudo enviar el informe completo:', err);
  }

  res.json({ resultadoCompleto, sintesis });
});

/**
 * Mercado Pago llama acá cada vez que cambia el estado de un pago. NUNCA se
 * confirma un pago por el redirect del navegador solo — siempre se le
 * vuelve a preguntar a la API de Mercado Pago con el ID de pago recibido acá.
 * Solo desbloquea el acceso a la Parte 2 — el informe y el mail salen recién
 * cuando el cliente la completa.
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

/**
 * Pedido de una primera conversación — reemplaza el Google Form. Guarda el
 * pedido y le avisa al equipo por mail (a diferencia del diagnóstico, acá el
 * mail va para nosotros, no para quien completa el formulario).
 */
router.post('/agendar', async (req, res) => {
  const { nombre, email, telefono, hizoDiagnostico, horario, contexto } = req.body ?? {};

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'Falta el nombre.' });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresá un email válido.' });
  }
  if (!DIAGNOSTICO_VALIDOS.includes(hizoDiagnostico)) {
    return res.status(400).json({ error: 'Falta indicar si ya hiciste el diagnóstico.' });
  }
  if (!HORARIOS_VALIDOS.includes(horario)) {
    return res.status(400).json({ error: 'Falta elegir un horario.' });
  }

  const id = randomUUID();
  crearAgendamiento({ id, nombre, email, telefono, hizoDiagnostico, horario, contexto });

  // Si ese mail ya tiene un diagnóstico (misma persona), pedir agendar es el
  // siguiente escalón de su ciclo de vida — pero solo si todavía no llegó
  // más lejos que el diagnóstico (para no pisar un estado más avanzado que
  // ya se haya seteado a mano, ej. desde el panel de admin).
  const diagnosticoDelMismoMail = buscarDiagnosticoPorEmail(email);
  if (diagnosticoDelMismoMail && ['DiagnosticoA', 'DiagnosticoFull'].includes(diagnosticoDelMismoMail.estado_cliente ?? '')) {
    actualizarEstadoCliente(diagnosticoDelMismoMail.id, 'EnContacto');
  }

  void enviarASheet({
    tipo: 'agendamiento',
    id,
    nombre,
    email,
    telefono: telefono ?? '',
    hizoDiagnostico,
    horario,
    contexto: contexto ?? '',
  });

  try {
    await enviarNotificacionAgendamiento({ nombre, email, telefono, hizoDiagnostico, horario, contexto });
  } catch (err) {
    // El pedido ya quedó guardado en la base aunque el mail de aviso falle.
    console.error('[agendar] no se pudo enviar la notificación al equipo:', err);
  }

  res.json({ ok: true });
});
