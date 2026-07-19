/**
 * Align Jay Cutler legend data with One Step Closer (2005/2006 DVD).
 * Primary sources: JayCutlerTV YouTube full film + chapter clips.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) =>
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const WU = (intensity) => ({ label: 'W1', kind: 'warmup', intensity });
const WU2 = (intensity) => ({ label: 'W2', kind: 'warmup', intensity });
const WS = (n, note = 'High volume — controlled, short rest (30-60s), stop shy of failure') => ({
  label: String(n),
  kind: 'working',
  intensity: note,
});

function scheme(workingSets = 3, withWarmups = true) {
  const out = withWarmups
    ? [WU('~30% of working weight'), WU2('~60% of working weight')]
    : [];
  for (let i = 1; i <= workingSets; i++) out.push(WS(i));
  return out;
}

function slot(exerciseId, sets, repRange, extra = {}) {
  const working = extra.workingSets ?? Math.max(sets - 2, 1);
  const { workingSets: _w, withWarmups, ...rest } = extra;
  return {
    exerciseId,
    sets,
    repRange,
    setScheme: extra.setScheme ?? scheme(working, withWarmups !== false),
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

const stylePatch = {
  name: 'One Step Closer Volume',
  tags: ['High volume', '5-day split', 'Short rest', 'Olympia prep'],
  summary:
    "Jay Cutler's One Step Closer training, filmed by Mitsuru Okabe through the 2005 Mr. Olympia and the weeks after: legendary Gold's Gym volume — stacks of exercises and sets with short rest, controlled mind-muscle work, and heavy compounds (500-lb deadlifts, 140-lb one-arm rows, 405 front squats). Contest-prep back and shoulders/traps/calves/abs come first on the DVD; chest, arms, and legs were shot post-show while still full and dense. Scale the set counts down if you are not a seasoned high-volume lifter.",
  principles: [
    'Volume drives growth — many exercises and sets per body part, built up over years.',
    'Rest ~30-60 seconds between most sets; keep the session dense and the pump high.',
    'Control the rep and the contraction — feel the muscle through a full range; do not chase ego weight.',
    'Train each major body part once per week on a dedicated day; calves (and often abs) get extra attention.',
    'Hard sessions earn recovery — rest after brutal back and leg days in the weekly rotation.',
    'Consistency over novelty — the same high-volume blueprint, progressed for decades.',
  ],
  intensityTechniques: ['drop-set', 'forced-reps', 'partials'],
  guidelines: {
    trainingDaysPerWeek: '5 (classic 3 on, 1 off, 2 on, 1 off rotation)',
    frequencyPerMuscle: 'Once per week; calves twice; abs often with shoulders.',
    warmupProtocol: '2 progressive warm-up sets on the first compound; lighter warm-ups on later lifts as needed.',
    workingSetProtocol:
      'High-volume sessions: typically 3-4 working sets per exercise after warm-ups, 15-25+ total sets on large body parts for advanced lifters. Scale to 12-16 sets when adapting. Sessions run long — quality over rushing.',
    repRanges: [
      { target: 'Compounds', range: '6-12 reps' },
      { target: 'Isolation & detail', range: '10-15 reps' },
      { target: 'Calves & abs', range: '12-20+ reps' },
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
  sources: [FULL, P1, P2, P4, MESO],
};

const newExercises = [
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    hevyName: 'Incline Bench Press (Dumbbell)',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    category: 'compound',
    cues: [
      'Set the bench to a moderate incline.',
      'Press up and slightly together without locking out hard.',
      'Lower with a stretch across the upper chest.',
    ],
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    hevyName: 'Squat (Barbell)',
    aliases: ['Barbell Front Squat'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'abs'],
    equipment: 'barbell',
    category: 'compound',
    cues: [
      'Bar across the front delts, elbows high.',
      'Sit between the heels with an upright torso.',
      'Drive up through the mid-foot.',
    ],
  },
];

const LABEL = ['One Step Closer'];

const cutlerRoutines = [
  {
    id: 'cutler-back',
    name: 'One Step Closer - Back',
    day: 'Day 3',
    styleId: 'cutler-volume',
    sortOrder: 3,
    labels: LABEL,
    focus: ['back', 'lats', 'lower-back'],
    description:
      "Contest-prep back session from One Step Closer (~3.5 weeks out of the 2005 Olympia at Gold's): front pulldowns, heavy one-arm rows, bent-over and corner T-bar rows, seated rows, then deadlifts — high volume, short rest, brutal thickness work.",
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('lat-pulldown', 5, '8-12', {
        notes: 'Front / wide pulldowns open the DVD back workout for width.',
      }),
      slot('one-arm-dumbbell-row', 5, '8-12', {
        notes: 'Jay\'s favorite thickness builder — filmed with ~140 lb for high reps.',
      }),
      slot('barbell-row', 5, '8-12', {
        notes: 'Bent-over rows for mid-back density.',
      }),
      slot('t-bar-row', 5, '8-12', {
        notes: 'Corner T-bar rows at Gold\'s — plates stacked to the end of the bar.',
      }),
      slot('seated-cable-row', 4, '10-12', {
        notes: 'Seated rows deeper in the session for thickness after width work.',
      }),
      slot('deadlift', 4, '6-10', {
        notes: 'Heavy conventional deadlifts (DVD shows up to ~500 lb) to finish the back.',
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
      'Delts, traps, calves, and abs from One Step Closer: standing military presses, seated laterals, front raises, rear-delt machine and cable laterals, shrugs and upright rows, then standing/seated calves and crunches — the session Teased as next up in Part 4/5.',
    source: { name: P4.title, url: P4.url },
    exercises: [
      slot('military-press', 5, '8-12', {
        notes: 'Standing barbell presses featured on the DVD shoulder day.',
      }),
      slot('dumbbell-lateral-raise', 5, '10-15', {
        notes: 'Seated side laterals — high volume for medial delts.',
      }),
      slot('front-raise', 4, '10-15', {
        notes: 'Dumbbell front raises for anterior delts.',
      }),
      slot('rear-delt-fly-machine', 4, '12-15', {
        notes: 'Rear delts on the pec-deck / rear-fly machine.',
      }),
      slot('one-arm-cable-lateral-raise', 4, '12-15', {
        notes: 'Standing cable rear laterals — DVD highlight for rear-delt detail.',
      }),
      slot('barbell-shrug', 5, '10-12', {
        notes: 'Barbell (and dumbbell) shrugs for traps.',
      }),
      slot('upright-row', 4, '10-12', {
        notes: 'Dumbbell upright rows to finish traps/delts.',
      }),
      slot('standing-calf-raise', 5, '12-20', {
        notes: 'Standing calves — hit hard every shoulder session on the DVD.',
      }),
      slot('seated-calf-raise', 4, '12-20'),
      slot('decline-crunch', 4, '15-25', {
        notes: 'Abs trained as hard as any other body part in this segment.',
      }),
    ],
    collection: 'legend',
  },
  {
    id: 'cutler-chest-calves',
    name: 'One Step Closer - Chest',
    day: 'Day 1',
    styleId: 'cutler-volume',
    sortOrder: 1,
    labels: LABEL,
    focus: ['chest'],
    description:
      'Post-Olympia chest from One Step Closer (~290 lb, still shredded and full): incline dumbbell press, flat bench, dips / incline barbell, decline or flye work, and pullovers — angle after angle with high set counts.',
    source: { name: P2.title, url: P2.url },
    exercises: [
      slot('incline-dumbbell-press', 5, '8-12', {
        notes: 'Incline dumbbell press leads the DVD chest segment.',
      }),
      slot('barbell-bench-press', 5, '8-12', {
        notes: 'Flat barbell bench for mid-pec mass.',
      }),
      slot('weighted-triceps-dip', 4, '8-12', {
        notes: 'Chest-focused dips (paired with incline barbell work on the DVD).',
      }),
      slot('incline-barbell-press', 4, '8-12', {
        notes: 'Incline barbell press for upper-chest thickness.',
      }),
      slot('decline-bench-press', 4, '8-12', {
        notes: 'Decline press / pec-flye pairing for lower-chest sweep.',
      }),
      slot('dumbbell-pullover', 4, '10-12', {
        notes: 'Pullovers finish the chest — stretch and ribcage expansion.',
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
      "Arms at Gold's from One Step Closer: rope and wide pushdowns, close-grip bench / dips, overhead and reverse-grip extensions, then preacher, alternating, barbell, one-arm preacher, and hammer curls — tris and bis both buried in volume.",
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('triceps-pushdown', 5, '10-12', {
        notes: 'Rope / pushdown opens triceps — short rest, full squeeze.',
      }),
      slot('close-grip-bench-press', 4, '8-12', {
        notes: 'Close-grip bench (DVD pairs with dips for mass).',
      }),
      slot('overhead-triceps-extension-cable', 4, '10-12', {
        notes: 'Overhead cable extensions for the long head.',
      }),
      slot('one-arm-triceps-pushdown', 4, '10-12', {
        notes: 'Reverse / one-arm pushdown detail work.',
      }),
      slot('preacher-curl-barbell', 4, '8-12', {
        notes: 'Preacher curls start the biceps block.',
      }),
      slot('alternating-dumbbell-curl', 4, '8-12', {
        notes: 'Alternate dumbbell curls for peak contraction.',
      }),
      slot('barbell-curl', 4, '8-12', {
        notes: 'Standing barbell curls for overall arm mass.',
      }),
      slot('hammer-curl', 4, '10-12', {
        notes: 'Hammer curls for brachialis thickness.',
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
      "December 2005 leg day from One Step Closer (~295 lb): leg extensions into presses, hack / front squats (405 featured), walking lunges, seated and lying leg curls, stiff-leg deadlifts, and more press/curl volume — Jay's trademark sweep built here.",
    source: { name: FULL.title, url: FULL.url },
    exercises: [
      slot('leg-extension', 5, '12-20', {
        notes: 'Extensions pre-exhaust the quads before heavy compounds.',
      }),
      slot('leg-press', 5, '10-15', {
        notes: 'Heavy leg presses — DVD shows stacks of 45s.',
      }),
      slot('hack-squat', 4, '8-12', {
        notes: 'Hack squats paired with front squats on the DVD.',
      }),
      slot('front-squat', 4, '6-10', {
        notes: 'Front squats with ~405 lb featured in the December session.',
      }),
      slot('walking-lunge', 4, '8-12', {
        notes: 'Walking lunges for sweep and conditioning.',
      }),
      slot('lying-leg-curl', 4, '10-12', {
        notes: 'Lying (and seated) leg curls for hamstrings.',
      }),
      slot('romanian-deadlift', 4, '8-12', {
        notes: 'Dumbbell stiff-leg deadlifts for hamstring stretch.',
      }),
      slot('standing-calf-raise', 5, '12-20'),
    ],
    collection: 'legend',
  },
];

const styles = read('src/data/styles.json');
const styleIdx = styles.findIndex((s) => s.id === 'cutler-volume');
if (styleIdx < 0) throw new Error('cutler-volume style missing');
styles[styleIdx] = { ...styles[styleIdx], ...stylePatch };
write('src/data/styles.json', styles);

const exercises = read('src/data/exercises.json');
const exerciseIds = new Set(exercises.map((e) => e.id));
for (const ex of newExercises) {
  if (!exerciseIds.has(ex.id)) {
    exercises.push(ex);
    exerciseIds.add(ex.id);
  }
}
write('src/data/exercises.json', exercises);

const routines = read('src/data/routines.json');
const byId = new Map(cutlerRoutines.map((r) => [r.id, r]));
let replaced = 0;
for (let i = 0; i < routines.length; i++) {
  const next = byId.get(routines[i].id);
  if (next) {
    routines[i] = next;
    replaced += 1;
    byId.delete(routines[i].id);
  }
}
if (replaced !== 5) {
  throw new Error(`Expected to replace 5 Cutler routines, replaced ${replaced}`);
}
write('src/data/routines.json', routines);

console.log(
  `Aligned Cutler One Step Closer: style updated, ${newExercises.length} exercises ensured, 5 workouts replaced.`,
);
