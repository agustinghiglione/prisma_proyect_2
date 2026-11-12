import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { COLOR_AREA, ETIQUETA_NIVEL, nivelDe, type RespuestaDimension } from '../lib/diagnostico';

interface PrismaResultadoProps {
  /** Áreas medidas, con su valor de 1 a 4. */
  scores: RespuestaDimension[];
  /** Áreas que todavía no se midieron (se muestran bloqueadas). */
  bloqueadas?: string[];
}

/**
 * El resultado del diagnóstico como un prisma: la luz entra por la izquierda y
 * sale en un haz por área, con el color del módulo. El largo del haz es el
 * nivel de esa área. Las áreas bloqueadas (las que suma el diagnóstico
 * completo) salen como un haz punteado con candado.
 */
export default function PrismaResultado({ scores, bloqueadas = [] }: PrismaResultadoProps) {
  const filas = [
    ...scores.map((s) => ({ area: s.dimension, valor: s.valor as number | null })),
    ...bloqueadas.map((area) => ({ area, valor: null as number | null })),
  ];
  const ALTO_FILA = 44;
  const alto = filas.length * ALTO_FILA + 16;
  const cy = alto / 2;
  const X0 = 96; // donde empiezan los haces
  const LARGO = 232; // largo máximo de un haz

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-4 sm:p-5">
      <svg viewBox={`0 0 340 ${alto}`} className="w-full" role="img" aria-label="Tu Prisma: nivel de cada área">
        {/* Luz que entra */}
        <motion.line
          x1={0} y1={cy} x2={40} y2={cy} stroke="#e8d3ae" strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
        />
        {/* Prisma */}
        <motion.polygon
          points={`58,${cy - 34} 82,${cy + 26} 34,${cy + 26}`}
          fill="rgba(255,255,255,0.10)" stroke="#e8d3ae" strokeWidth={2.5} strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.2 }}
          style={{ transformOrigin: `58px ${cy}px` }}
        />
        {filas.map((f, i) => {
          const y = 8 + i * ALTO_FILA + 28;
          // El azul de Contabilidad se aclara: sobre el fondo oscuro no se distinguía.
          const base = COLOR_AREA[f.area] ?? '#ffffff';
          const color = base === '#345b78' ? '#6c9fc6' : base;
          const medido = f.valor !== null;
          const largo = medido ? Math.max(0.16, (f.valor as number) / 4) * LARGO : LARGO;
          const demora = 0.5 + i * 0.14;
          return (
            <g key={f.area}>
              {/* del prisma a la fila */}
              <motion.line
                x1={72} y1={cy} x2={X0} y2={y} stroke={medido ? color : 'rgba(255,255,255,0.3)'} strokeWidth={2} strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.25, delay: demora }}
              />
              {/* pista */}
              <line x1={X0} y1={y} x2={X0 + LARGO} y2={y} stroke="rgba(255,255,255,0.10)" strokeWidth={9} strokeLinecap="round" />
              {/* haz */}
              <motion.line
                x1={X0} y1={y} x2={X0 + largo} y2={y}
                stroke={medido ? color : 'rgba(255,255,255,0.35)'} strokeWidth={medido ? 9 : 2} strokeLinecap="round"
                strokeDasharray={medido ? undefined : '3 7'}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: demora + 0.15, ease: 'easeOut' }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: demora + 0.2 }}>
                <text x={X0} y={y - 11} fill="#ffffff" fontSize={11.5} fontWeight={600}>{f.area}</text>
                <text x={X0 + LARGO} y={y - 11} fill={medido ? '#e8d3ae' : 'rgba(255,255,255,0.6)'} fontSize={10.5} textAnchor="end">
                  {medido ? ETIQUETA_NIVEL[nivelDe(f.valor as number)] : 'En el completo'}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
      {bloqueadas.length > 0 && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
          <Lock size={12} /> {bloqueadas.join(' y ')} se mide en el diagnóstico completo.
        </p>
      )}
    </div>
  );
}
