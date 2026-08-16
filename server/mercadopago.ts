import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import QRCode from 'qrcode';
import { PRECIO_DIAGNOSTICO_COMPLETO } from '../src/lib/diagnostico';

const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken) {
  console.warn(
    '[mercadopago] Falta MP_ACCESS_TOKEN en el .env.local — la creación de pagos va a fallar hasta que lo cargues.',
  );
}

const client = new MercadoPagoConfig({ accessToken: accessToken ?? '' });

/**
 * Crea la preferencia de pago (Checkout Pro) para un diagnóstico ya guardado
 * en la base, y devuelve el link de pago junto con ese mismo link como QR
 * (una imagen data:URL, lista para un <img src="...">).
 *
 * No es el producto "QR de Mercado Pago Point" (ese es para cobrar en un
 * local físico, con una caja registrada). Esto es más simple: el link de
 * Checkout Pro de siempre, convertido en una imagen QR para que alguien lo
 * escanee con el celular en vez de tipear los datos de la tarjeta en la
 * pantalla donde está haciendo el diagnóstico.
 */
export async function crearPreferenciaDePago(diagnosticoId: string) {
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:5173';

  const preference = new Preference(client);
  const resultado = await preference.create({
    body: {
      items: [
        {
          id: 'diagnostico-completo',
          title: 'Diagnóstico Prisma® completo',
          description: 'Informe completo con las 5 dimensiones, evidencia y plan de acción.',
          quantity: 1,
          unit_price: PRECIO_DIAGNOSTICO_COMPLETO,
          currency_id: 'ARS',
        },
      ],
      external_reference: diagnosticoId,
      back_urls: {
        success: `${siteUrl}/diagnostico/gracias`,
        pending: `${siteUrl}/diagnostico/pendiente`,
        failure: `${siteUrl}/diagnostico/error`,
      },
      // "auto_return" solo lo acepta Mercado Pago con una success URL pública
      // (https, no localhost) — se activa sola cuando SITE_URL ya es real.
      // No hace falta para que el flujo funcione: la confirmación real viene
      // del webhook y del polling, no del redirect.
      ...(siteUrl.startsWith('https://') ? { auto_return: 'approved' as const } : {}),
      notification_url: process.env.MP_WEBHOOK_URL, // ej: https://prismaconsultora.com/api/webhooks/mercadopago
    },
  });

  const initPoint = resultado.init_point!;
  const qrDataUrl = await QRCode.toDataURL(initPoint, { margin: 1, width: 320 });

  return {
    preferenceId: resultado.id!,
    initPoint,
    qrDataUrl,
  };
}

/**
 * Le pregunta a Mercado Pago, con el ID de pago que llega en el webhook, si
 * ese pago está realmente aprobado. Nunca se confía en el redirect del
 * navegador solo — eso se puede falsificar.
 */
export async function consultarPago(paymentId: string) {
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
