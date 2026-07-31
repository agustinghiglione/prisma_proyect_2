/**
 * Placeholder hero visual: "amanecer sobre el mar" per brand brief.
 * Swap for a real photograph at /img/hero-amanecer.jpg and replace
 * this component with a plain <img> once definitive photography lands.
 */
export default function SunriseVisual() {
  return (
    <svg
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123c73" />
          <stop offset="42%" stopColor="#3f6f96" />
          <stop offset="68%" stopColor="#e8c9a3" />
          <stop offset="100%" stopColor="#f7ede1" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e5a7a" />
          <stop offset="100%" stopColor="#123c73" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#f3d9ad" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f3d9ad" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="900" fill="url(#sky)" />

      <circle cx="600" cy="560" r="260" fill="url(#sun)">
        <animate attributeName="r" values="250;270;250" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="600" cy="560" r="70" fill="#fdf1dd" opacity="0.9" />

      <rect y="560" width="1200" height="340" fill="url(#sea)" />

      <g opacity="0.35" stroke="#fdf1dd" strokeWidth="2" strokeLinecap="round">
        <line x1="520" y1="600" x2="680" y2="600">
          <animate attributeName="x1" values="520;500;520" dur="5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="680;700;680" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="480" y1="650" x2="720" y2="650">
          <animate attributeName="x1" values="480;460;480" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="720;740;720" dur="6s" repeatCount="indefinite" />
        </line>
        <line x1="440" y1="710" x2="760" y2="710">
          <animate attributeName="x1" values="440;410;440" dur="7s" repeatCount="indefinite" />
          <animate attributeName="x2" values="760;790;760" dur="7s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  );
}
