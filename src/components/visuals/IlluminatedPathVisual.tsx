/**
 * Placeholder visual: "camino iluminado" per brand brief.
 * Swap for a real photograph at /img/contacto-camino.jpg once
 * definitive photography lands, and drop this component.
 */
export default function IlluminatedPathVisual() {
  return (
    <svg
      viewBox="0 0 480 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pathSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123c73" />
          <stop offset="55%" stopColor="#2f6488" />
          <stop offset="100%" stopColor="#f3e7d3" />
        </linearGradient>
        <linearGradient id="pathGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e5a7a" />
          <stop offset="100%" stopColor="#123c73" />
        </linearGradient>
        <radialGradient id="pathGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3dc" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#fff3dc" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff3dc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="480" height="600" fill="url(#pathSky)" />
      <rect y="380" width="480" height="220" fill="url(#pathGround)" />

      <circle cx="240" cy="378" r="150" fill="url(#pathGlow)" />

      {/* converging path */}
      <polygon points="180,600 300,600 252,378 208,378" fill="#f3e7d3" opacity="0.85" />
      <line x1="180" y1="600" x2="208" y2="378" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />
      <line x1="300" y1="600" x2="252" y2="378" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />

      {/* soft side silhouettes for depth */}
      <path d="M0,600 L0,430 C 60,410 110,440 150,470 L110,600 Z" fill="#0c2a52" opacity="0.5" />
      <path d="M480,600 L480,420 C 420,400 370,435 330,468 L370,600 Z" fill="#0c2a52" opacity="0.5" />
    </svg>
  );
}
