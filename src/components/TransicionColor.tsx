/**
 * Franja de degradado entre dos secciones de distinto color, para que el
 * cambio no "pegue" de golpe. Las clases van completas (Tailwind no detecta
 * clases armadas por partes).
 */
const VARIANTES = {
  'arena-a-azul': 'bg-gradient-to-b from-sand to-primary-dark',
  'azul-a-arena': 'bg-gradient-to-b from-primary to-sand',
} as const;

export default function TransicionColor({ variante }: { variante: keyof typeof VARIANTES }) {
  return <div aria-hidden className={`h-28 sm:h-40 ${VARIANTES[variante]}`} />;
}
