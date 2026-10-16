/**
 * Testimonios de clientes. REGLA: un testimonio se publica solo con la
 * aprobación escrita del cliente (texto, nombre y cargo). Mientras
 * `aprobado` sea false, se ve únicamente en local (npm run dev) con la
 * marca "Borrador" y NO aparece en el sitio publicado.
 */
export interface Testimonio {
  texto: string;
  nombre: string;
  detalle: string;
  /** Módulos que trabajamos con ese cliente (slugs de data/modulos.ts). */
  modulos: string[];
  aprobado: boolean;
}

export const TESTIMONIOS: Testimonio[] = [
  {
    texto:
      'Necesitábamos ordenar procesos y números que veníamos arrastrando. Damian entendió rápido cómo trabajamos y nos dejó todo organizado y fácil de seguir. Hoy tenemos claridad para tomar decisiones y seguir creciendo.',
    nombre: 'Valeria Urdaniz',
    detalle: 'Técnica en Comercio Exterior y Aduanas · Immabot',
    modulos: ['administracion', 'tecnologia'],
    aprobado: false,
  },
  {
    texto:
      'Antes respondía mensajes y anotaba turnos entre cliente y cliente. Prisma automatizó los turnos desde la web y desde Instagram, el pedido de reseña después de cada turno y las respuestas a las consultas de siempre; las que necesitan mi respuesta me llegan a mí. Hoy me dedico a lo que sé hacer y a seguir mejorando.',
    nombre: '[Nombre]',
    detalle: '[Peluquería · ciudad]',
    modulos: ['tecnologia', 'administracion'],
    aprobado: false,
  },
];

/** Proyecto del equipo: tucvonline. La reseña tiene que ser real y aprobada. */
export const TUCVONLINE = {
  url: 'https://tucvonline.com/?utm_source=consultoraprisma&utm_medium=web&utm_campaign=clientes',
  resena: '[Reseña real de un usuario de tucvonline]',
  autor: '[Nombre del usuario]',
  aprobado: false,
};

const enLocal = import.meta.env.DEV;

/** Lo que se muestra: todo en local (con marca de borrador), solo lo aprobado publicado. */
export const testimoniosVisibles = () => TESTIMONIOS.filter((t) => t.aprobado || enLocal);
export const tucvonlineVisible = () => TUCVONLINE.aprobado || enLocal;
export const hayClientes = () => testimoniosVisibles().length > 0 || tucvonlineVisible();
