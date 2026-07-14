import type { Routine, RoutineExercise, SetKind, SetTarget, TrainingStyle } from '../schema';

export type ResolvedSet = SetTarget & { kind: SetKind };

export type SetProtocolGuide = {
  title: string;
  warmup: string;
  working: string;
  failure: string;
};

const kindLabels: Record<SetKind, string> = {
  warmup: 'Warm-up',
  working: 'Working',
  failure: 'To failure',
  backoff: 'Back-off',
  'all-out': 'All-out',
};

const STYLE_PROTOCOLS: Record<string, SetProtocolGuide> = {
  'blood-and-guts': {
    title: 'Blood & Guts set scheme',
    warmup: '1–3 progressive warm-ups (W1, W2…) — pyramid up, never near failure.',
    working: 'Usually one all-out working set (F1) at 100%.',
    failure:
      'F1 is taken to absolute failure, then extended with forced reps, rest-pause, negatives, or drops. F2 (~90%) is an optional second failure set.',
  },
  'heavy-duty': {
    title: 'Heavy Duty set scheme',
    warmup: '1–3 warm-up sets per exercise — never approaching failure.',
    working: 'Exactly one working set per exercise after warm-ups.',
    failure:
      'The single working set (F1) goes to momentary muscular failure, sometimes extended with forced reps, negatives, or a static hold.',
  },
  'coleman-powerbuilding': {
    title: 'Coleman powerbuilding set scheme',
    warmup: '2 progressive warm-ups on compounds (~30%, then ~60% of working weight).',
    working:
      'Remaining sets are straight working weight — heavy, controlled, and not taken to failure.',
    failure: 'No failure techniques — progressive overload through load and volume.',
  },
  htlt: {
    title: 'HTLT set scheme',
    warmup: 'Light warm-up sets (12–20 reps) stopping 3–5 reps shy of failure.',
    working:
      'Straight sets in the target rep range with a controlled 2-1-1 tempo — beat last time.',
    failure:
      'Only the final set of each movement goes all-out (advanced). Partials or a drop set optional.',
  },
  personal: {
    title: 'My Hevy set scheme (HIT-style)',
    warmup: 'W1 and W2 are progressive warm-ups — never taken near failure.',
    working: 'F1 is the all-out working set at 100% of your target load.',
    failure:
      'F1 goes to failure; F2 (~90%) is a second near-failure set when programmed. Superset pairs share the same intent.',
  },
};

export function setKindLabel(kind: SetKind): string {
  return kindLabels[kind];
}

export function inferSetKind(label: string, intensity: string): SetKind {
  const normalizedLabel = label.trim().toUpperCase();
  const normalizedIntensity = intensity.toLowerCase();

  if (
    /^W\d/.test(normalizedLabel) ||
    normalizedLabel.includes('WU') ||
    normalizedLabel.includes('WARM')
  ) {
    return 'warmup';
  }
  if (normalizedLabel === 'F2' || normalizedIntensity.includes('90%')) {
    return 'backoff';
  }
  if (
    normalizedLabel === 'F1' ||
    normalizedIntensity.includes('to failure') ||
    normalizedIntensity.includes('static hold')
  ) {
    return 'failure';
  }
  if (
    normalizedIntensity.includes('all out') ||
    normalizedIntensity.includes('all-out') ||
    normalizedIntensity.includes('all out')
  ) {
    return 'all-out';
  }
  return 'working';
}

export function resolveSetKind(target: SetTarget): SetKind {
  return target.kind ?? inferSetKind(target.label, target.intensity);
}

export function resolveSetScheme(
  slot: RoutineExercise,
  style?: TrainingStyle,
  collection: Routine['collection'] = 'legend',
): { sets: ResolvedSet[]; inferred: boolean } {
  if (slot.setScheme.length > 0) {
    return {
      sets: slot.setScheme.map((target) => ({
        ...target,
        kind: resolveSetKind(target),
      })),
      inferred: false,
    };
  }

  const styleId =
    style?.id ?? (collection === 'personal' ? 'personal' : undefined);

  switch (styleId) {
    case 'blood-and-guts':
    case 'personal':
      return { sets: personalHitScheme(slot), inferred: true };
    case 'heavy-duty':
      return { sets: heavyDutyScheme(), inferred: true };
    case 'coleman-powerbuilding':
      return { sets: colemanScheme(slot), inferred: true };
    case 'htlt':
      return { sets: htltScheme(slot), inferred: true };
    default:
      return {
        sets: [
          {
            label: '1–N',
            kind: 'working',
            intensity: 'Follow the methodology warm-up and working-set guidelines.',
          },
        ],
        inferred: true,
      };
  }
}

function personalHitScheme(slot: RoutineExercise): ResolvedSet[] {
  if (slot.exerciseId === 'treadmill') {
    return [
      {
        label: '1',
        kind: 'working',
        intensity: 'Steady-state — fat-burning heart rate, not maximal effort.',
      },
    ];
  }

  if (slot.sets <= 2) {
    return [
      { label: 'W1', kind: 'warmup', intensity: '30–50% — groove the movement' },
      { label: 'F1', kind: 'failure', intensity: '100% — all-out to failure' },
    ];
  }

  if (slot.sets === 3) {
    return [
      { label: 'W1', kind: 'warmup', intensity: '30–40%' },
      { label: 'W2', kind: 'warmup', intensity: '55–65%' },
      { label: 'F1', kind: 'failure', intensity: '100% — to failure + technique' },
    ];
  }

  const sets: ResolvedSet[] = [
    { label: 'W1', kind: 'warmup', intensity: '30–40% — not near failure' },
    { label: 'W2', kind: 'warmup', intensity: '55–65% — groove only' },
    { label: 'F1', kind: 'failure', intensity: '100% — all-out to failure' },
  ];

  if (slot.sets >= 4) {
    sets.push({
      label: 'F2',
      kind: 'backoff',
      intensity: '~90% — second near-failure set',
    });
  }

  if (slot.sets > 4) {
    sets.push({
      label: `+${slot.sets - 4}`,
      kind: 'working',
      intensity: `${slot.sets - 4} additional set(s) at working weight per your Hevy log`,
    });
  }

  return sets;
}

function heavyDutyScheme(): ResolvedSet[] {
  return [
    {
      label: 'Warm-ups',
      kind: 'warmup',
      intensity: '1–3 progressive sets — never to failure',
    },
    {
      label: 'F1',
      kind: 'failure',
      intensity: 'One all-out set to momentary muscular failure',
    },
  ];
}

function colemanScheme(slot: RoutineExercise): ResolvedSet[] {
  const sets: ResolvedSet[] = [
    { label: 'W1', kind: 'warmup', intensity: '~30% of working weight' },
    { label: 'W2', kind: 'warmup', intensity: '~60% of working weight' },
  ];

  for (let i = 1; i <= slot.sets; i += 1) {
    sets.push({
      label: String(i),
      kind: 'working',
      intensity: 'Heavy & controlled — straight set, stop shy of failure',
    });
  }

  return sets;
}

function htltScheme(slot: RoutineExercise): ResolvedSet[] {
  if (slot.sets <= 1) {
    return [
      {
        label: '1',
        kind: 'all-out',
        intensity: 'Target rep range, controlled tempo, beat last time',
      },
    ];
  }

  const sets: ResolvedSet[] = [
    {
      label: 'WU',
      kind: 'warmup',
      intensity: '12–20 reps, 3–5 reps in reserve',
    },
  ];

  for (let i = 1; i < slot.sets; i += 1) {
    sets.push({
      label: String(i),
      kind: 'working',
      intensity: 'Target rep range, 2-1-1 tempo, controlled',
    });
  }

  sets.push({
    label: String(slot.sets),
    kind: 'all-out',
    intensity: 'All-out finisher — to failure OK, partials/drop optional',
  });

  return sets;
}

export function getSetProtocolGuide(
  style?: TrainingStyle,
  collection: Routine['collection'] = 'legend',
): SetProtocolGuide {
  if (collection === 'personal') {
    return STYLE_PROTOCOLS.personal;
  }
  if (style && STYLE_PROTOCOLS[style.id]) {
    return STYLE_PROTOCOLS[style.id];
  }
  return {
    title: 'Set scheme',
    warmup: 'Progressive warm-ups before heavier work.',
    working: 'Working sets at the target rep range.',
    failure: 'Follow the curator methodology for failure and intensity techniques.',
  };
}

export function summarizeSetScheme(sets: ResolvedSet[]): string {
  const kinds = new Set(sets.map((s) => s.kind));
  const parts: string[] = [];
  if (kinds.has('warmup')) parts.push('warm-ups');
  if (kinds.has('working')) parts.push('working sets');
  if (kinds.has('failure') || kinds.has('all-out')) parts.push('failure/all-out');
  if (kinds.has('backoff')) parts.push('back-off');
  return parts.join(' · ');
}
