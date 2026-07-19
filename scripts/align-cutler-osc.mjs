/**
 * Align Jay Cutler legend data with One Step Closer (2005/2006 DVD).
 * Volume model per Jay: ~20 working sets per body part (≈5 moves × 4 sets),
 * warm-ups excluded from that count. Higher bodybuilding reps (10-15), short rest.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) =>
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const NOTE =
  'Working set — controlled tempo, short rest (30-60s), chase the pump; stop shy of failure';

const WU = (intensity) => ({ label: 'W1', kind: 'warmup', intensity });
const WU2 = (intensity) => ({ label: 'W2', kind: 'warmup', intensity });
const WS = (n) => ({ label: String(n), kind: 'working', intensity: NOTE });

/** `sets` = working-set count (Jay's ~20/body-part math). Warm-ups sit in setScheme only. */
function slot(exerciseId, workingSets, repRange, extra = {}) {
  const withWarmups = extra.withWarmups === true;
  const { withWarmups: _w, ...rest } = extra;
  const setScheme = [];
  if (withWarmups) {
    setScheme.push(WU('~30% — groove only, never near failure'));
    setScheme.push(WU2('~60% — feel set, still not a working set'));
  }
  for (let i = 1; i <= workingSets; i++) setScheme.push(WS(i));
  return {
    exerciseId,
    sets: workingSets,
    repRange,
    setScheme,
    ...rest,
  };
}

const FULL = {
  title: 'Jay Cutler — One Step Closer (Full DVD)',
  url: 'https://www.youtube.com/watch?v=tbK4zFcuVIk',
};
const P1 = {
  title: 'Jay Cutler — One Step Closer 1/5',
  url: 'https://www.youtube.com/watch?v=qj1tHjSN_nM',
};
const P2 = {
  title: 'Jay Cutler — One Step Closer 2/5',
  url: 'https://www.youtube.com/watch?v=qcSiPF6ZGsM',
};
const P4 = {
  title: 'Jay Cutler — One Step Closer Part 4/5',
  url: 'https://www.youtube.com/watch?v=KaxiL6ayp_M',
};
const MESO = {
  title: 'Jay Cutler — Heir to the Olympia Throne (MESO-Rx / Ron Harris)',
  url: 'https://thinksteroids.com/articles/jay-cutler-ifbb-pro-bodybuilder/',
};
const VOLT = {
  title: 'Jay Cutler on Sets Per Body Part — Fitness Volt',
  url: 'https://fitnessvolt.com/jay-cutler-sets-per-body-part/',
};

const stylePatch = {
  name: 'One Step Closer Volume',
  tags: ['High volume', '20 working sets', 'Short rest', 'Olympia prep'],
  summary:
    "Jay Cutler's One Step Closer / Olympia-era high-volume training: about 20 working sets per body part (typically 4–5 exercises × 3–4 working sets — warm-ups do not count), short 30–60s rests, and bodybuilding rep ranges that live in the 10–15 zone more than pure strength work. Filmed at Gold's through the 2005 Olympia and the weeks after — stacks of angles, controlled mind-muscle reps, and dense pumps. Scale down if you cannot recover from pro-level volume.",
  principles: [
    'Aim for ~20 working sets per body part — Jay\'s career standard (warm-ups and feel sets do not count).',
    'Use 4–5 exercises and 3–4 working sets each; vary angles, not just load.',
    'Rest ~30–60 seconds — speed training for metabolic stress and the pump.',
    'Reps stay mostly in the 10–15 bodybuilding range; compounds can sit 8–12 when heavy.',
    'Control every rep — contraction and stretch beat ego weight.',
    'Rest after brutal back and leg days in the 3-on / 1-off / 2-on / 1-off rotation.',
  ],
  intensityTechniques: ['drop-set', 'forced-reps', 'partials'],
  guidelines: {
    trainingDaysPerWeek: '5 (classic 3 on, 1 off, 2 on, 1 off rotation)',
    frequencyPerMuscle: 'Once per week; calves twice; abs often with shoulders.',
    warmupProtocol:
      '1–2 progressive warm-ups / feel sets on the first compound of the day (and when load jumps). Warm-ups are not part of the ~20 working-set target.',
    workingSetProtocol:
      '~20 working sets per body part: usually 5 movements × 4 working sets (or 4 × 3–4). Arms day hits both biceps and triceps near that volume each. Short rests; sessions run long.',
    repRanges: [
      { target: 'Compounds', range: '8-12 reps (often closer to 10-12)' },
      { target: 'Isolation & pump work', range: '12-15 reps' },
      { target: 'Legs (extensions, curls, lunges)', range: '12-20 reps' },
      { target: 'Calves & abs', range: '15-20+ reps' },
    ],
  },
  splitOverview: [
    { day: 'Day 1', focus: 'Chest' },
    { day: 'Day 2', focus: 'Arms (Triceps & Biceps)' },
    { day: 'Day 3', focus: 'Back' },
    { day: 'Day 4', focus: 'Rest' },
    { day: 'Day 5', focus: 'Shoulders, Traps, Calves & Abs' },
    { day: 'Day 6', focus: 'Legs' },
    { day: 'Day 7', focus: 'Rest' },
  ],
  sources: [FULL, P1, P2, P4, MESO, VOLT],
};

const LABEL = ['One Step Closer'];

const cutlerRoutines = [
  {
    id: 'cutler-chest-calves',
    name: 'One Step Closer - Chest',
    day: 'Day 1',
    styleId: 'cutler-volume',
    sortOrder: 1,
    labels: LABEL,
    focus: ['chest'],
    description:
      'Post-Olympia chest from One Step Closer: five angles × 4 working sets (~20 working sets). Incline dumbbell and barbell pressing, flat bench, dips, flye/decline work, and pullovers — higher-rep bodybuilding volume, short rest.',
    source: { name: P2.title, url: P2.url },
    exercises: [
      slot('incline-dumbbell-press', 4, '10-12', {
        withWarmups: true,
        notes: 'Leads the DVD chest segment — 4 working sets after warm-ups.',
      }),
      slot('barbell-bench-press', 4, '10-12', {
        notes: 'Flat barbell for mid-pec mass — stay in the 10-12 zone.',
      }),
      slot('incline-barbell-press', 4, '10-12', {
        notes: 'Second incline angle for upper-chest thickness.',
      }),
      slot('weighted-triceps-dip', 4, '10-15', {
        notes: 'Chest-focused dips — lean forward, higher reps for the pump.',
      }),
      slot('decline-bench-press', 4, '10-12', {
        notes: 'Decline / lower-chest sweep from the DVD pairing.',
      }),
      slot('dumbbell-pullover', 4, '12-15', {
        notes: 'Pullovers finish chest — stretch and high-rep pump.',
      }),
    ],
    collection: 'legend',
  },
  {
    id: 'cutler-arms',
    name: 'One Step Closer - Arms',
    day: 'Day 2',
    styleId: 'cutler-volume',
    sortOrder: 2,
    labels: LABEL,
    focus: ['triceps', 'biceps'],
    description:
      "Arms at Gold's from One Step Closer: ~4 working sets on each movement, higher-rep pushdowns and curls. Triceps and biceps each land near Jay's ~20 working-set body-part target — dense volume, short rest, no ego swinging.",
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('triceps-pushdown', 4, '12-15', {
        withWarmups: true,
        notes: 'Rope / pushdown opens tris — 12-15 for the pump.',
      }),
      slot('close-grip-bench-press', 4, '10-12', {
        notes: 'Close-grip mass builder (DVD pairs with dips).',
      }),
      slot('overhead-triceps-extension-cable', 4, '12-15', {
        notes: 'Overhead cable — long-head stretch, higher reps.',
      }),
      slot('lying-triceps-extension', 4, '10-12', {
        notes: 'Skull crushers / EZ extensions for belly of the tri.',
      }),
      slot('one-arm-triceps-pushdown', 4, '12-15', {
        notes: 'One-arm / reverse-grip detail — finish tris near 20 working sets.',
      }),
      slot('preacher-curl-barbell', 4, '10-12', {
        withWarmups: true,
        notes: 'Preacher curls open the biceps block.',
      }),
      slot('barbell-curl', 4, '10-12', {
        notes: 'Standing barbell curls — controlled, 10-12.',
      }),
      slot('alternating-dumbbell-curl', 4, '12-15', {
        notes: 'Alternate dumbbell curls for peak and pump.',
      }),
      slot('hammer-curl', 4, '12-15', {
        notes: 'Hammers for brachialis — higher reps to finish near 20 for bis.',
      }),
      slot('cable-biceps-curl', 4, '12-15', {
        notes: 'Cable curls keep constant tension for the last pump.',
      }),
    ],
    collection: 'legend',
  },
  {
    id: 'cutler-back',
    name: 'One Step Closer - Back',
    day: 'Day 3',
    styleId: 'cutler-volume',
    sortOrder: 3,
    labels: LABEL,
    focus: ['back', 'lats', 'lower-back'],
    description:
      "Contest-prep back from One Step Closer (~3.5 weeks out): width then thickness — pulldowns, one-arm rows, bent-over and corner T-bar rows, seated rows, incline DB rows, then deadlifts. About 4 working sets each (~24+ working sets) in the 10-12 zone Jay lived in on camera.",
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('lat-pulldown', 4, '10-12', {
        withWarmups: true,
        notes: 'Front pulldowns open for width — 4 working sets.',
      }),
      slot('one-arm-dumbbell-row', 4, '10-12', {
        notes: 'Favorite thickness builder — DVD shows heavy DBs for higher reps.',
      }),
      slot('barbell-row', 4, '10-12', {
        notes: 'Bent-over rows for mid-back density.',
      }),
      slot('t-bar-row', 4, '10-12', {
        notes: 'Corner T-bar at Gold\'s — plates to the collar.',
      }),
      slot('seated-cable-row', 4, '12-15', {
        notes: 'Seated rows deeper in the session — squeeze and higher reps.',
      }),
      slot('iso-lateral-row', 4, '10-12', {
        notes: 'Machine / incline-style row angle from the DVD exercise list.',
      }),
      slot('deadlift', 4, '8-12', {
        notes: 'Heavy conventional deadlifts to finish — still multiple working sets, not a one-and-done.',
      }),
    ],
    collection: 'legend',
  },
  {
    id: 'cutler-shoulders-traps',
    name: 'One Step Closer - Shoulders, Traps, Calves & Abs',
    day: 'Day 5',
    styleId: 'cutler-volume',
    sortOrder: 4,
    labels: LABEL,
    focus: ['shoulders', 'traps', 'rear-delts', 'calves', 'abs'],
    description:
      'Shoulders/traps from One Step Closer (Part 4/5 teases this session): military presses, laterals, front raises, rear-delt machine and cables, shrugs, upright rows — ~4×12-15 on delts (~20+ working sets), then high-rep calves and abs.',
    source: { name: P4.title, url: P4.url },
    exercises: [
      slot('military-press', 4, '10-12', {
        withWarmups: true,
        notes: 'Standing barbell presses — DVD shoulder opener.',
      }),
      slot('dumbbell-lateral-raise', 4, '12-15', {
        notes: 'Seated/standing laterals — medial delts thrive on higher reps.',
      }),
      slot('front-raise', 4, '12-15', {
        notes: 'Dumbbell front raises — 12-15 controlled reps.',
      }),
      slot('rear-delt-fly-machine', 4, '12-15', {
        notes: 'Rear delts on the pec-deck / rear-fly machine.',
      }),
      slot('one-arm-cable-lateral-raise', 4, '12-15', {
        notes: 'Standing cable rear laterals — DVD highlight.',
      }),
      slot('barbell-shrug', 4, '12-15', {
        notes: 'Shrugs for traps — higher reps, short rest.',
      }),
      slot('upright-row', 4, '12-15', {
        notes: 'Upright rows finish delts/traps near the 20-set mark.',
      }),
      slot('standing-calf-raise', 4, '15-20', {
        notes: 'Standing calves — high reps, full stretch.',
      }),
      slot('seated-calf-raise', 4, '15-20', {
        notes: 'Seated calves for soleus volume.',
      }),
      slot('decline-crunch', 4, '15-25', {
        notes: 'Abs trained as hard as any other part on this DVD day.',
      }),
    ],
    collection: 'legend',
  },
  {
    id: 'cutler-legs',
    name: 'One Step Closer - Legs',
    day: 'Day 6',
    styleId: 'cutler-volume',
    sortOrder: 5,
    labels: LABEL,
    focus: ['quads', 'hamstrings', 'calves'],
    description:
      'December 2005 leg day from One Step Closer: extensions, presses, hack and front squats, walking lunges, lying curls, stiff-legs, and calves — 4 working sets and higher-rep quad/ham work that built the Cutler sweep. Expect 20+ working sets before calves.',
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('leg-extension', 4, '15-20', {
        withWarmups: true,
        notes: 'High-rep extensions pre-exhaust — classic Cutler quad opener.',
      }),
      slot('leg-press', 4, '12-15', {
        notes: 'Heavy presses still in a bodybuilding 12-15 zone.',
      }),
      slot('hack-squat', 4, '10-15', {
        notes: 'Hack squats paired with front squats on the DVD.',
      }),
      slot('front-squat', 4, '10-12', {
        notes: 'Front squats (~405 featured) — upright torso, deep quads.',
      }),
      slot('walking-lunge', 4, '12-15', {
        notes: 'Walking lunges for sweep — higher reps each leg.',
      }),
      slot('lying-leg-curl', 4, '12-15', {
        notes: 'Lying leg curls — 4 working sets for hams.',
      }),
      slot('standing-leg-curl', 4, '12-15', {
        notes: 'Standing leg curls from the DVD hamstring list.',
      }),
      slot('romanian-deadlift', 4, '10-12', {
        notes: 'Dumbbell stiff-leg deadlifts — stretch under control.',
      }),
      slot('standing-calf-raise', 4, '15-20', {
        notes: 'Standing calves to close the session.',
      }),
    ],
    collection: 'legend',
  },
];

const styles = read('src/data/styles.json');
const styleIdx = styles.findIndex((s) => s.id === 'cutler-volume');
if (styleIdx < 0) throw new Error('cutler-volume style missing');
styles[styleIdx] = { ...styles[styleIdx], ...stylePatch };
write('src/data/styles.json', styles);

const routines = read('src/data/routines.json');
const byId = new Map(cutlerRoutines.map((r) => [r.id, r]));
let replaced = 0;
for (let i = 0; i < routines.length; i++) {
  if (byId.has(routines[i].id)) {
    routines[i] = byId.get(routines[i].id);
    replaced += 1;
  }
}
if (replaced !== 5) throw new Error(`Expected 5 Cutler routines, replaced ${replaced}`);
write('src/data/routines.json', routines);

for (const w of cutlerRoutines) {
  const working = w.exercises.reduce((n, e) => n + e.sets, 0);
  console.log(`${w.id}: ${w.exercises.length} exercises, ${working} working sets`);
}
console.log('Cutler volume realigned to ~20 working sets / higher reps.');
