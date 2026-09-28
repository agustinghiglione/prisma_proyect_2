/**
 * Número de WhatsApp Business en formato internacional, solo dígitos
 * (ej. '5491112345678'). Mientras esté vacío, el ícono del footer muestra
 * "no disponible" y no aparece el botón flotante.
 * TODO(Damian): cargar el número cuando WhatsApp Business esté activo.
 */
export const WHATSAPP_NUMERO = '';

export const WHATSAPP_MENSAJE = 'Hola, quiero hacer una consulta sobre mi negocio.';

export function whatsappUrl(): string | null {
  if (!WHATSAPP_NUMERO) return null;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;
}
