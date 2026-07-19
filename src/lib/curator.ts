/** Two-letter initials for a curator/creator name, e.g. "Dorian Yates" -> "DY". */
export function curatorInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const gradients: Record<string, string> = {
  'blood-and-guts': 'linear-gradient(135deg, #ef5350, #8b1a1a)',
  'heavy-duty': 'linear-gradient(135deg, #7a70ff, #3a2fb0)',
  'coleman-powerbuilding': 'linear-gradient(135deg, #f5a524, #b45309)',
  htlt: 'linear-gradient(135deg, #2dd4bf, #0e8a8a)',
  'heath-fst7': 'linear-gradient(135deg, #e879f9, #86198f)',
  'arnold-golden-era': 'linear-gradient(135deg, #fcd34d, #b45309)',
  'haney-stimulate': 'linear-gradient(135deg, #34d399, #047857)',
  'zane-aesthetics': 'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  'cutler-volume': 'linear-gradient(135deg, #fb7185, #be123c)',
  'bannout-lion': 'linear-gradient(135deg, #fbbf24, #92400e)',
  'jackson-blade': 'linear-gradient(135deg, #cbd5e1, #475569)',
  'gaspari-annihilation': 'linear-gradient(135deg, #f87171, #991b1b)',
};

/** A distinct avatar gradient per curator (keyed by style id). */
export function curatorGradient(styleId: string): string {
  return gradients[styleId] ?? 'linear-gradient(135deg, #c45c26, #7a3418)';
}
