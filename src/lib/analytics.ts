/**
 * Eventos de analítica. Cada evento va a dos lugares:
 * - Umami (https://cloud.umami.is), con el nombre tal cual.
 * - Píxel de Meta, con el evento estándar que corresponda (para optimizar anuncios)
 *   y además como evento personalizado con el mismo nombre.
 * Los dos scripts se cargan en index.html solo para consultoraprisma.digital, así que en
 * localhost o en copias de prueba esto no hace nada. Nunca mandar datos personales
 * (nombre, email, teléfono) en un evento.
 */
type DatosEvento = Record<string, string | number | boolean>;

type Fbq = (accion: 'track' | 'trackCustom', nombre: string, datos?: DatosEvento) => void;

/** Eventos del sitio que equivalen a un evento estándar de Meta. */
const EVENTOS_META: Record<string, string> = {
  consulta_enviada: 'Lead',
  analisis_web_pedido: 'Lead',
  diagnostico_completado: 'CompleteRegistration',
  diagnostico_completo_pago_iniciado: 'InitiateCheckout',
};

export function evento(nombre: string, datos?: DatosEvento) {
  try {
    const umami = (window as unknown as { umami?: { track: (n: string, d?: DatosEvento) => void } }).umami;
    umami?.track(nombre, datos);
  } catch {
    // La analítica nunca debe romper la página.
  }
  try {
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (!fbq) return;
    const estandar = EVENTOS_META[nombre];
    if (estandar) fbq('track', estandar, { content_name: nombre, ...datos });
    fbq('trackCustom', nombre, datos);
  } catch {
    // La analítica nunca debe romper la página.
  }
}
