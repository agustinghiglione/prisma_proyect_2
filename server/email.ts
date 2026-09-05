import nodemailer from 'nodemailer';
import type { ResultadoCompleto, ResultadoDiagnostico } from '../src/lib/diagnostico';

const AZUL_OCEANO = '#223C54';
const AZUL_HORIZONTE = '#345B78';
const ARENA = '#E8D3AE';
const ARENA_CLARA = '#F5EBD8';
const MARFIL = '#FAF8F5';
const TEXTO = '#2D3748';
const TEXTO_SUAVE = '#5B6672';

export function transportador() {
  // Pensado para usar el mail con dominio propio (Titan Email de Hostinger,
  // u otro) por SMTP — así no hace falta un tercer proveedor de mail.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function filaBarra(dim: { dimension: string; valor: number }) {
  const pct = Math.round((dim.valor / 4) * 100);
  return `
    <tr><td style="padding:10px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td align="left" style="font-family:Arial,sans-serif;font-size:13px;color:${TEXTO};padding-bottom:6px;">${dim.dimension}</td>
        <td align="right" style="font-family:Arial,sans-serif;font-size:13px;color:${TEXTO_SUAVE};padding-bottom:6px;">${pct}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="${pct}%" bgcolor="${AZUL_HORIZONTE}" style="height:8px;line-height:8px;font-size:1px;border-radius:5px 0 0 5px;">&nbsp;</td>
        <td width="${100 - pct}%" bgcolor="${ARENA_CLARA}" style="height:8px;line-height:8px;font-size:1px;border-radius:0 5px 5px 0;">&nbsp;</td>
      </tr></table>
    </td></tr>`;
}

function listaChips(items: { dimension: string }[], color: string) {
  return items
    .map(
      (x) =>
        `<span style="display:inline-block;background:${color};color:${AZUL_OCEANO};font-family:Arial,sans-serif;font-size:12px;font-weight:bold;padding:6px 12px;border-radius:999px;margin:0 6px 6px 0;">${x.dimension}</span>`,
    )
    .join('');
}

function seccionOpcional(titulo: string, contenidoHtml: string) {
  return contenidoHtml
    ? `<p style="margin:24px 0 8px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">${titulo}</p>${contenidoHtml}`
    : '';
}

/**
 * El resultado de la Parte 1 (gratis) — se manda apenas el cliente completa
 * el cuestionario corto y deja su mail, la pague o no el diagnóstico
 * completo después. Sin síntesis de IA (esa es parte de la Parte 2 paga) y
 * con las cinco áreas que toca la Parte 1, no las seis.
 */
export async function enviarInformeParte1(params: { email: string; nombre: string; resultado: ResultadoDiagnostico }) {
  const { email, nombre, resultado } = params;

  const agendarUrl = process.env.AGENDAR_URL ?? `${process.env.SITE_URL}/#contacto`;

  // Ya no se muestra el porcentaje de cada área individual (ver más abajo):
  // un cliente que contesta todo alto podía leer un "100%" como "ya está,
  // no necesito nada más" y no agendar ni pagar el completo. Se deja solo
  // el número general (que sí sirve como dato de entrada) y las áreas
  // fuertes/con oportunidad como chips, sin cifras — y si no hay ninguna
  // oportunidad real (contestó todo alto), un mensaje que igual empuja a
  // seguir, en vez de dejar esa sección vacía.
  const sinOportunidades = resultado.oportunidades.length === 0;

  const html = `
  <div style="background:${MARFIL};padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E7DDC9;">
      <tr>
        <td style="background:${AZUL_OCEANO};padding:28px 32px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.5px;color:${ARENA};">tu diagnóstico Prisma&reg; — primera parte</p>
          <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#ffffff;opacity:0.85;">Preparado para ${nombre || 'vos'}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:${TEXTO_SUAVE};">Nivel general de claridad</p>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:36px;font-weight:bold;color:${AZUL_HORIZONTE};">${resultado.overallPercent}%</p>

          ${seccionOpcional('Fortalezas', resultado.fortalezas.length ? `<div>${listaChips(resultado.fortalezas, ARENA)}</div>` : '')}
          ${
            sinOportunidades
              ? `<p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};line-height:1.6;">Veníamos bien en las áreas que medimos — y ahí es justo donde más ayuda un diagnóstico completo: para profesionalizar lo que ya funciona y que aguante el próximo salto de tamaño del negocio.</p>`
              : seccionOpcional('Dónde te podemos ayudar', `<div>${listaChips(resultado.oportunidades, ARENA_CLARA)}</div>`)
          }

          <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};line-height:1.6;">
            Esto es solo el primer vistazo. El diagnóstico completo profundiza en cada una de estas áreas, suma
            Personas, y te deja una síntesis puntual de dónde conviene empezar.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 4px;">
            <tr>
              <td align="center" bgcolor="${AZUL_HORIZONTE}" style="border-radius:999px;">
                <a href="${agendarUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">Ver mi diagnóstico completo</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;background:${MARFIL};border-top:1px solid #E7DDC9;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:${TEXTO_SUAVE};text-align:center;">Prisma Consultora</p>
        </td>
      </tr>
    </table>
  </div>`;

  await transportador().sendMail({
    from: process.env.MAIL_FROM ?? '"Consultora Prisma" <contacto@consultoraprisma.digital>',
    to: email,
    subject: 'tu diagnóstico Prisma® — primera parte',
    html,
  });
}

/**
 * El informe completo: las seis áreas reales de Prisma, con su puntaje, más
 * la síntesis final (de Gemini, o el respaldo local si no hay clave o falló
 * la llamada) — sin justificar cada respuesta una por una, la síntesis va
 * directo a dónde Prisma puede ayudar.
 */
export async function enviarInformeCompleto(params: {
  email: string;
  nombre: string;
  resultado: ResultadoCompleto;
  sintesis: string;
}) {
  const { email, nombre, resultado, sintesis } = params;

  const fortalezas = resultado.fortalezas;
  const oportunidades = resultado.oportunidades;

  const agendarUrl = process.env.AGENDAR_URL ?? `${process.env.SITE_URL}/#contacto`;

  const html = `
  <div style="background:${MARFIL};padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E7DDC9;">
      <tr>
        <td style="background:${AZUL_OCEANO};padding:28px 32px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${ARENA};">Diagnóstico Prisma&reg; completo</p>
          <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#ffffff;opacity:0.85;">Preparado para ${nombre || 'vos'}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:${TEXTO_SUAVE};">Nivel general de claridad</p>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:36px;font-weight:bold;color:${AZUL_HORIZONTE};">${resultado.overallPercent}%</p>

          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">Tus seis áreas</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${resultado.todos.map(filaBarra).join('')}</table>

          ${seccionOpcional('Fortalezas', fortalezas.length ? `<div>${listaChips(fortalezas, ARENA)}</div>` : '')}
          ${seccionOpcional('Dónde te podemos ayudar', oportunidades.length ? `<div>${listaChips(oportunidades, ARENA_CLARA)}</div>` : '')}

          <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};line-height:1.6;">
            ${sintesis}
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 4px;">
            <tr>
              <td align="center" bgcolor="${AZUL_HORIZONTE}" style="border-radius:999px;">
                <a href="${agendarUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">Agendar mi primera conversación</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;background:${MARFIL};border-top:1px solid #E7DDC9;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:${TEXTO_SUAVE};text-align:center;">Prisma Consultora</p>
        </td>
      </tr>
    </table>
  </div>`;

  await transportador().sendMail({
    from: process.env.MAIL_FROM ?? '"Consultora Prisma" <contacto@consultoraprisma.digital>',
    to: email,
    subject: 'Tu Diagnóstico Prisma® completo',
    html,
  });
}

/**
 * Mail "a mano" desde el panel de administración: asunto y cuerpo (HTML o
 * texto plano, lo que Damian haya escrito en el composer) libres, con un
 * adjunto opcional. A diferencia de los mails automáticos de arriba, acá el
 * contenido lo arma una persona, no una plantilla — así que no se le agrega
 * ningún diseño propio, se manda tal cual se redactó.
 */
export async function enviarMailPersonalizado(params: {
  to: string;
  asunto: string;
  cuerpoHtml: string;
  adjunto?: { filename: string; contentType?: string; contentBase64: string } | null;
}) {
  const { to, asunto, cuerpoHtml, adjunto } = params;

  await transportador().sendMail({
    from: process.env.MAIL_FROM ?? '"Consultora Prisma" <contacto@consultoraprisma.digital>',
    to,
    subject: asunto,
    html: cuerpoHtml,
    attachments: adjunto
      ? [
          {
            filename: adjunto.filename,
            content: Buffer.from(adjunto.contentBase64, 'base64'),
            contentType: adjunto.contentType,
          },
        ]
      : undefined,
  });
}

const HIZO_DIAGNOSTICO_TEXTO: Record<string, string> = {
  si: 'Sí',
  no: 'No',
  no_seguro: 'No está seguro',
};

const HORARIO_TEXTO: Record<string, string> = {
  manana: 'Mañana',
  mediodia: 'Mediodía',
  tarde: 'Tarde',
  cualquiera: 'Cualquier horario',
};

/**
 * Notificación interna al equipo (no al cliente) cuando alguien pide agendar
 * una conversación. Sin esto, los pedidos quedarían solo en la base de datos
 * y nadie se enteraría de que llegó un lead nuevo.
 */
export async function enviarNotificacionAgendamiento(datos: {
  nombre: string;
  email: string;
  telefono?: string;
  hizoDiagnostico: string;
  horario: string;
  contexto?: string;
}) {
  const destino = process.env.TEAM_EMAIL ?? 'contacto@consultoraprisma.digital';

  const filas = [
    ['Nombre', datos.nombre],
    ['Email', datos.email],
    ['Teléfono / WhatsApp', datos.telefono || '—'],
    ['¿Ya hizo el diagnóstico?', HIZO_DIAGNOSTICO_TEXTO[datos.hizoDiagnostico] ?? datos.hizoDiagnostico],
    ['Horario preferido', HORARIO_TEXTO[datos.horario] ?? datos.horario],
    ['Contexto', datos.contexto || '—'],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-family:Arial,sans-serif;font-size:13px;color:${TEXTO_SUAVE};white-space:nowrap;">${label}</td><td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};">${value}</td></tr>`,
    )
    .join('');

  await transportador().sendMail({
    from: process.env.MAIL_FROM ?? '"Consultora Prisma" <contacto@consultoraprisma.digital>',
    to: destino,
    replyTo: datos.email,
    subject: `Nuevo pedido de conversación — ${datos.nombre}`,
    html: `
      <div style="background:${MARFIL};padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #E7DDC9;">
          <tr><td>
            <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:${AZUL_OCEANO};">
              Alguien pidió agendar una primera conversación
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0">${filas}</table>
          </td></tr>
        </table>
      </div>`,
  });
}
