import { motion } from 'framer-motion';

interface ShineSweepProps {
  /** Seconds the light band takes to cross the element. */
  duration?: number;
  /** Seconds to wait before the next sweep. */
  repeatDelay?: number;
  /** Width of the light band, as a fraction of the container. */
  bandWidth?: string;
  className?: string;
}

/**
 * A soft diagonal band of light that sweeps across its parent, simulating a
 * reflection passing through glass. Parent must be `relative overflow-hidden`.
 */
export default function ShineSweep({
  duration = 1.8,
  repeatDelay = 3.2,
  bandWidth = '40%',
  className = '',
}: ShineSweepProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(115deg, transparent calc(50% - ${bandWidth}), rgba(255,248,230,0.75) 50%, transparent calc(50% + ${bandWidth}))`,
        mixBlendMode: 'screen',
      }}
      initial={{ x: '-60%' }}
      animate={{ x: '60%' }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity, repeatDelay }}
    />
  );
}
