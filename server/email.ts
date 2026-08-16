import nodemailer from 'nodemailer';
import {
  RECOMENDACIONES,
  nivelDe,
  type ResultadoDiagnostico,
} from '../src/lib/diagnostico';

const AZUL_OCEANO = '#223C54';
const AZUL_HORIZONTE = '#345B78';
const ARENA = '#E8D3AE';
const ARENA_CLARA = '#F5EBD8';
const MARFIL = '#FAF8F5';
const TEXTO = '#2D3748';
const TEXTO_SUAVE = '#5B6672';

function transportador() {
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

function emailHtml(nombre: string, resultado: ResultadoDiagnostico, completo: boolean) {
  const recomendacionesHtml = resultado.oportunidades
    .map((o) => {
      const nivel = nivelDe(o.valor);
      return `<li style="margin-bottom:8px;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};line-height:1.5;">${RECOMENDACIONES[o.dimension][nivel]}</li>`;
    })
    .join('');

  const agendarUrl = process.env.AGENDAR_URL ?? `${process.env.SITE_URL}/#contacto`;

  return `
  <div style="background:${MARFIL};padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E7DDC9;">
      <tr>
        <td style="background:${AZUL_OCEANO};padding:28px 32px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${ARENA};">
            ${completo ? 'Diagnóstico Prisma&reg; completo' : 'Informe Ejecutivo Prisma&reg;'}
          </p>
          <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#ffffff;opacity:0.85;">Preparado para ${nombre || 'vos'}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:${TEXTO_SUAVE};">Nivel general de claridad</p>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:36px;font-weight:bold;color:${AZUL_HORIZONTE};">${resultado.overallPercent}%</p>

          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">Mapa de prioridades</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${resultado.scores.map(filaBarra).join('')}</table>

          <p style="margin:24px 0 8px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">Fortalezas</p>
          <div>${listaChips(resultado.fortalezas, ARENA)}</div>

          <p style="margin:20px 0 8px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">Oportunidades</p>
          <div>${listaChips(resultado.oportunidades, ARENA_CLARA)}</div>

          <p style="margin:24px 0 8px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${AZUL_OCEANO};">
            ${completo ? 'Recomendaciones' : 'Primeras recomendaciones'}
          </p>
          <ul style="margin:0;padding-left:18px;">${recomendacionesHtml}</ul>

          <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${TEXTO};line-height:1.6;">
            ${completo
              ? 'Este es tu diagnóstico completo. El siguiente paso es que conversemos sobre cómo implementarlo en tu negocio.'
              : 'Con este diagnóstico ya estás a mitad de camino: el próximo paso es que conversemos sobre tu negocio.'}
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
}

export async function enviarResultado(params: {
  email: string;
  nombre: string;
  resultado: ResultadoDiagnostico;
  completo: boolean;
}) {
  const { email, nombre, resultado, completo } = params;
  const asunto = completo ? 'Tu Diagnóstico Prisma® completo' : 'Tu Informe Ejecutivo Prisma®';

  await transportador().sendMail({
    from: process.env.MAIL_FROM ?? '"Prisma Consultora" <contacto@prismaconsultora.com>',
    to: email,
    subject: asunto,
    html: emailHtml(nombre, resultado, completo),
  });
}
