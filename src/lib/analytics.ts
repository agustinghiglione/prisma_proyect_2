/**
 * Eventos de Umami (https://cloud.umami.is). El script se carga en index.html solo
 * para consultoraprisma.digital (data-domains), así que en localhost o en copias de
 * prueba esto no hace nada. Nunca mandar datos personales (nombre, email) en un evento.
 */
type DatosEvento = Record<string, string | number | boolean>;

export function evento(nombre: string, datos?: DatosEvento) {
  try {
    const umami = (window as unknown as { umami?: { track: (n: string, d?: DatosEvento) => void } }).umami;
    umami?.track(nombre, datos);
  } catch {
    // La analítica nunca debe romper la página.
  }
}
