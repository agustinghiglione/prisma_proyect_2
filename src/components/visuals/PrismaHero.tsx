import { motion } from 'framer-motion';
import { AREAS, irAArea } from '../../data/areas';

/**
 * El concepto de marca dibujado: una consulta (luz blanca) entra al prisma y
 * sale separada en las seis áreas. En escritorio cada rayo lleva su etiqueta
 * y es un botón que abre esa área; en celular se muestra sin etiquetas (los
 * chips van debajo, en el Hero).
 */
const COLORES = ['#223c54', '#345b78', '#5b8db0', '#7e9b78', '#e4b15e', '#c98a4b'];

// Geometría (viewBox 0 0 600 420)
const P_TOP = { x: 250, y: 60 };
const P_IZQ = { x: 150, y: 340 };
const P_DER = { x: 350, y: 340 };
const ENTRADA = { x: 205, y: 205 }; // punto sobre la cara izquierda
const SALIDA = { x: 292, y: 190 }; // punto sobre la cara derecha
const X_FIN = 395;
const Y_FIN = (i: number) => 70 + i * 56; // 70 … 350

export default function PrismaHero({ conEtiquetas = true }: { conEtiquetas?: boolean }) {
  return (
    <svg
      viewBox={conEtiquetas ? '0 0 650 420' : '0 0 420 420'}
      className="h-auto w-full"
      role="img"
      aria-label="Una consulta entra en un prisma y se separa en las seis áreas de Consultora Prisma"
    >
      <defs>
        <linearGradient id="prisma-cara" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#e8d3ae" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#345b78" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="prisma-haz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e4b15e" stopOpacity="0" />
          <stop offset="100%" stopColor="#e4b15e" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Haz de entrada: la consulta */}
      <motion.line
        x1={0}
        y1={245}
        x2={ENTRADA.x}
        y2={ENTRADA.y}
        stroke="url(#prisma-haz)"
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <text x={8} y={228} className="fill-ink-soft" style={{ fontSize: 14, fontWeight: 600 }}>
        Tu consulta
      </text>

      {/* Rayos hacia cada área */}
      {AREAS.map((a, i) => (
        <motion.line
          key={a.slug}
          x1={SALIDA.x}
          y1={SALIDA.y}
          x2={X_FIN}
          y2={Y_FIN(i)}
          stroke={COLORES[i]}
          strokeWidth={4}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 + i * 0.08, ease: 'easeOut' }}
        />
      ))}

      {/* Luz interna del prisma */}
      <polygon
        points={`${ENTRADA.x},${ENTRADA.y} ${SALIDA.x},${SALIDA.y} ${SALIDA.x + 6},${SALIDA.y + 40}`}
        fill="#e4b15e"
        opacity={0.35}
      />

      {/* El prisma */}
      <polygon
        points={`${P_TOP.x},${P_TOP.y} ${P_IZQ.x},${P_IZQ.y} ${P_DER.x},${P_DER.y}`}
        fill="url(#prisma-cara)"
        stroke="#223c54"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <line x1={P_TOP.x} y1={P_TOP.y} x2={P_TOP.x + 12} y2={P_IZQ.y} stroke="#223c54" strokeOpacity={0.18} strokeWidth={1.5} />

      {/* Etiquetas clicables (solo escritorio) */}
      {conEtiquetas &&
        AREAS.map((a, i) => (
          <motion.g
            key={a.slug}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.3 + i * 0.08 }}
            onClick={() => irAArea(a.slug)}
            className="cursor-pointer [&:hover_text]:fill-primary [&:hover_rect]:stroke-primary"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' ? irAArea(a.slug) : undefined)}
            aria-label={`Ver el área ${a.nombre}`}
          >
            <circle cx={X_FIN} cy={Y_FIN(i)} r={6} fill={COLORES[i]} />
            <rect
              x={X_FIN + 14}
              y={Y_FIN(i) - 15}
              width={a.nombre.length * 8.4 + 26}
              height={30}
              rx={15}
              fill="#ffffff"
              stroke="#e7ddc9"
            />
            <text
              x={X_FIN + 26}
              y={Y_FIN(i) + 5}
              className="fill-ink"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {a.nombre}
            </text>
          </motion.g>
        ))}
    </svg>
  );
}
