/**
 * Decorative accent: one beam of light refracting into many facets,
 * echoing the "team as multiple perspectives" idea without photography.
 */
export default function FacetPatternVisual() {
  const rays = [-24, -14, -5, 5, 14, 24];

  return (
    <svg
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rayFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      {rays.map((angle) => (
        <line
          key={angle}
          x1="80"
          y1="150"
          x2="780"
          y2={150 + angle * 6}
          stroke="url(#rayFade)"
          strokeWidth="2"
        />
      ))}
      <circle cx="80" cy="150" r="5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}
