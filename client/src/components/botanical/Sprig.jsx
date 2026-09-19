const nodes = [
  { y: 240, s: 1 },
  { y: 190, s: 0.9 },
  { y: 140, s: 0.8 },
  { y: 95, s: 0.68 },
  { y: 55, s: 0.55 },
]

const LEAF = 'M0 0 C 20 -16, 50 -16, 70 0 C 50 16, 20 16, 0 0 Z'

const Sprig = ({ className = '' }) => (
  <svg
  viewBox="0 0 200 300"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.2"
  strokeLinecap="round"
  className={className}
  aria-hidden="true"
  >
    <path d="M100 295 C 92 210, 108 120, 100 25" />

    {nodes.flatMap(({ y, s }) => 
    [-35, -145].map((rot) => (
      <g key={`${y}-${rot}`} transform={`translate(100 ${y}) rotate(${rot}) scale(${s})`}>
        <path d={LEAF} />
        <path d="M0 0 L62 0" />
      </g>
    ))
    )}

    <g transform="translate(100 25) rotate(-90) scale(0.5)">
      <path d={LEAF} />
      <path d="M0 0 L62 0" />
    </g>
  </svg>
)

export default Sprig;