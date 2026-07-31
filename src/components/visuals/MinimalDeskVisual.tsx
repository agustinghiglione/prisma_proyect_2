/**
 * Placeholder visual: "escritorio minimalista" per brand brief.
 * Swap for a real photograph at /img/problemas-escritorio.jpg once
 * definitive photography lands, and drop this component.
 */
export default function MinimalDeskVisual() {
  return (
    <svg
      viewBox="0 0 480 480"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="deskShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#123c73" floodOpacity="0.12" />
        </filter>
        <linearGradient id="laptopScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123c73" />
          <stop offset="100%" stopColor="#1e5a7a" />
        </linearGradient>
      </defs>

      <rect width="480" height="480" rx="28" fill="#f5f7fa" />

      {/* notebook */}
      <g transform="translate(70,290) rotate(-8)" filter="url(#deskShadow)">
        <rect width="150" height="110" rx="10" fill="#ffffff" stroke="#e4e9f0" strokeWidth="2" />
        <line x1="20" y1="30" x2="130" y2="30" stroke="#e4e9f0" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="50" x2="130" y2="50" stroke="#e4e9f0" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="70" x2="95" y2="70" stroke="#e4e9f0" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* pen */}
      <g transform="translate(150,370) rotate(30)">
        <rect width="90" height="7" rx="3.5" fill="#1e5a7a" />
        <rect x="80" width="12" height="7" rx="3.5" fill="#123c73" />
      </g>

      {/* laptop, top-down */}
      <g transform="translate(150,90)" filter="url(#deskShadow)">
        <rect width="230" height="160" rx="14" fill="#ffffff" stroke="#e4e9f0" strokeWidth="2" />
        <rect x="16" y="16" width="198" height="98" rx="8" fill="url(#laptopScreen)" />
        <rect x="16" y="128" width="198" height="16" rx="6" fill="#f5f7fa" />
      </g>

      {/* coffee cup */}
      <g transform="translate(330,300)" filter="url(#deskShadow)">
        <circle r="34" fill="#ffffff" stroke="#e4e9f0" strokeWidth="2" />
        <circle r="24" fill="#123c73" opacity="0.08" />
        <path d="M 24 -6 Q 40 -2 30 12" stroke="#1e5a7a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* small plant */}
      <g transform="translate(370,120)" filter="url(#deskShadow)">
        <rect x="-20" y="20" width="40" height="30" rx="6" fill="#ffffff" stroke="#e4e9f0" strokeWidth="2" />
        <path d="M0,20 C -4,0 -22,-6 -30,-24" stroke="#1e5a7a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M0,20 C 2,-4 14,-14 26,-22" stroke="#1e5a7a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M0,20 C 0,-6 0,-20 2,-34" stroke="#123c73" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
