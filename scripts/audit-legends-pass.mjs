/**
 * Multi-pass legend accuracy audit revisions.
 * Pass A (official): Arnold Encyclopedia day order, Dexter Iron Man interview,
 *   Heath/Hany FST-7, Zane frankzane.com 5-5-5-6, Gaspari Nutrition shoulders,
 *   Mentzer.org + Heavy Duty College, Coleman/RCSS, HTLT official, Haney calves.
 * Pass B (accredited secondary): source URL upgrades, principle wording.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) =>
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const WU = (i) => ({ label: 'W1', kind: 'warmup', intensity: i });
const WU2 = (i) => ({ label: 'W2', kind: 'warmup', intensity: i });
const WS = (n, note) => ({
  label: String(n),
  kind: 'working',
  intensity: note ?? 'Straight working set — controlled, stop shy of failure',
});

function scheme(working, withWarmups = false, note) {
  const out = [];
  if (withWarmups) {
    out.push(WU('~30% of working weight'));
    out.push(WU2('~60% of working weight'));
  }
  for (let i = 1; i <= working; i++) out.push(WS(i, note));
  return out;
}

function slot(exerciseId, workingSets, repRange, extra = {}) {
  const { withWarmups, note, notes, setScheme, ...rest } = extra;
  return {
    exerciseId,
    sets: workingSets,
    repRange,
    setScheme: setScheme ?? scheme(workingSets, withWarmups === true, note),
    ...(notes ? { notes } : {}),
    ...rest,
  };
}

const FST7 = {
  label: 'F7',
  kind: 'all-out',
  intensity: 'FST-7 — 7×8-12, 30-45s rest; flex/stretch between sets',
};

function fst7Finisher(exerciseId, notes) {
  return {
    exerciseId,
    sets: 7,
    repRange: '8-12',
    notes,
    setScheme: Array.from({ length: 7 }, () => ({ ...FST7 })),
  };
}

const styles = read('src/data/styles.json');
const routines = read('src/data/routines.json');

function patchStyle(id, patch) {
  const i = styles.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`Missing style ${id}`);
  styles[i] = { ...styles[i], ...patch, guidelines: { ...styles[i].guidelines, ...patch.guidelines } };
}

function replaceRoutine(id, next) {
  const i = routines.findIndex((r) => r.id === id);
  if (i < 0) throw new Error(`Missing routine ${id}`);
  routines[i] = next;
}

function upsertRoutine(next) {
  const i = routines.findIndex((r) => r.id === next.id);
  if (i >= 0) routines[i] = next;
  else routines.push(next);
}

function removeRoutine(id) {
  const i = routines.findIndex((r) => r.id === id);
  if (i >= 0) routines.splice(i, 1);
}

// ——— Arnold: Encyclopedia Level-1 day order (Chest/Back → Shoulders/Arms → Legs) ———
patchStyle('arnold-golden-era', {
  summary:
    "Arnold Schwarzenegger's Golden Era approach from The New Encyclopedia of Modern Bodybuilding: enormous volume, agonist-antagonist pairing, and each major group twice per week on a six-day split — Chest & Back, Shoulders & Arms, Legs, then repeat. Early career used the Golden Six full-body template three non-consecutive days per week. Supersets, giant sets, and 8-12 (often higher) reps define the pump-first aesthetic of the era.",
  principles: [
    'Train each major body part twice per week on the competitive six-day split.',
    'Pair antagonists (chest with back) so you can superset and keep density high.',
    'Give shoulders and arms their own day so arms are fresh — not pre-fatigued from chest/back.',
    'Use high volume: often 15-20+ sets for large parts across several angles.',
    'Progressive overload with controlled form; chase the pump without ego form breakdown.',
    'Golden Six is the beginner/early-career full-body alternative (3×/week).',
  ],
  guidelines: {
    trainingDaysPerWeek: '6 (Encyclopedia Level 1); Golden Six: 3 full-body days',
    frequencyPerMuscle: 'Twice per week on the competitive split; 3×/week on Golden Six.',
    warmupProtocol: 'Progressive warm-ups on the first compound of each session.',
    workingSetProtocol:
      'Competitive split: typically 4-5 working sets per exercise, 10-20+ sets per large body part; supersets on chest/back and arms. Golden Six: 3-4 × 10 (AMRAP chin-ups/sit-ups).',
    repRanges: [
      { target: 'Golden Six', range: '10 reps (AMRAP on chin-ups & sit-ups)' },
      { target: 'Competitive compounds', range: '8-12 reps' },
      { target: 'Calves & abs', range: '15-25 reps' },
    ],
  },
  splitOverview: [
    { day: 'Mon & Thu', focus: 'Chest & Back' },
    { day: 'Tue & Fri', focus: 'Shoulders & Arms' },
    { day: 'Wed & Sat', focus: 'Legs & Lower Back' },
    { day: 'Sun', focus: 'Rest' },
    { day: 'Golden Six alt.', focus: 'Full body — Mon / Wed / Fri' },
  ],
  sources: [
    {
      title: 'The New Encyclopedia of Modern Bodybuilding — Arnold Schwarzenegger & Bill Dobbins',
      url: 'https://www.penguinrandomhouse.com/books/322959/the-new-encyclopedia-of-modern-bodybuilding-by-arnold-schwarzenegger/',
    },
    {
      title: "Arnold's Golden Six Routine - Fitness Volt",
      url: 'https://fitnessvolt.com/arnolds-golden-six-routine/',
    },
    {
      title: 'Arnold Split overview - StrengthLog (Encyclopedia-based)',
      url: 'https://www.strengthlog.com/arnold-split/',
    },
    {
      title: 'Tip: Train With Arnold\'s Golden Six - T Nation',
      url: 'https://archive.t-nation.com/training/tip-train-with-arnolds-golden-six/',
    },
  ],
});

replaceRoutine('arnold-shoulders-arms', {
  ...routines.find((r) => r.id === 'arnold-shoulders-arms'),
  day: 'Tue & Fri',
  sortOrder: 3,
  description:
    'Encyclopedia Level-1 shoulders and arms day — delts, bis, and tris trained fresh (not after chest/back). High volume, 8-12 reps, often supersetted.',
  source: {
    name: 'The New Encyclopedia of Modern Bodybuilding (Arnold Split)',
    url: 'https://www.strengthlog.com/arnold-split/',
  },
});

replaceRoutine('arnold-legs', {
  ...routines.find((r) => r.id === 'arnold-legs'),
  day: 'Wed & Sat',
  sortOrder: 4,
  name: 'Competitive Split - Legs & Lower Back',
  focus: ['quads', 'hamstrings', 'calves', 'lower-back'],
  description:
    'Encyclopedia Level-1 legs day — squats, presses, extensions, curls, and calves. Runs Wednesday & Saturday after chest/back and shoulders/arms days.',
  source: {
    name: 'The New Encyclopedia of Modern Bodybuilding (Arnold Split)',
    url: 'https://www.strengthlog.com/arnold-split/',
  },
});

replaceRoutine('arnold-chest-back', {
  ...routines.find((r) => r.id === 'arnold-chest-back'),
  sortOrder: 2,
  description:
    'Encyclopedia Level-1 chest and back — agonist/antagonist pairing for supersets and an upper-body pump. Trained Monday & Thursday.',
  source: {
    name: 'The New Encyclopedia of Modern Bodybuilding (Arnold Split)',
    url: 'https://www.strengthlog.com/arnold-split/',
  },
  exercises: [
    slot('barbell-bench-press', 5, '8-12', { withWarmups: true }),
    slot('incline-barbell-press', 5, '8-12'),
    slot('dumbbell-pullover', 4, '10-12', {
      notes: 'Pullovers bridge chest and lats — Encyclopedia staple.',
    }),
    slot('pull-up', 4, '8-12'),
    slot('barbell-row', 5, '8-12'),
    slot('seated-cable-row', 4, '8-12'),
  ],
});

// ——— Phil Heath / Hany Rambod FST-7 ———
patchStyle('heath-fst7', {
  name: 'FST-7',
  creator: 'Phil Heath / Hany Rambod',
  summary:
    "Fascial Stretch Training-7 (FST-7), created by coach Hany Rambod and made famous with Phil Heath: a body-part split with 3-4 straight working sets on most lifts, then a seven-set isolation finisher (8-12 reps, 30-45 seconds rest) to flood the muscle and stretch the fascia. Abs often first when trained. Heath typically trained five to six days per week with one major group (or pairing) per day.",
  principles: [
    'Finish each body part with FST-7 on an isolation move: 7 sets × 8-12, 30-45s rest.',
    'Flex and stretch the target muscle between the sevens — the pump is the point.',
    'Most other exercises: 3-4 working sets in the 8-12 hypertrophy zone.',
    'Train five to six days on a traditional body-part split; recover a full week per large muscle.',
    'Control every rep; use weight as a tool for the target muscle.',
    'Abs first on days they are trained (per Rambod).',
  ],
  guidelines: {
    trainingDaysPerWeek: '5-6',
    frequencyPerMuscle: 'Once per week for large muscles with FST-7.',
    warmupProtocol: '1-2 progressive warm-ups per exercise; abs first when included.',
    workingSetProtocol:
      '3-5 exercises with 3-4 working sets, then one FST-7 isolation finisher (7×8-12, 30-45s). Sessions ~70-90 minutes.',
    repRanges: [
      { target: 'Compounds & most work', range: '8-12 reps' },
      { target: 'FST-7 finishers', range: '8-12 reps × 7 sets' },
      { target: 'Calves & abs', range: '12-20 reps' },
    ],
  },
  sources: [
    {
      title: 'FST-7 — Official (Hany Rambod)',
      url: 'https://www.hanyrambod.com/fst7/',
    },
    {
      title: '8 Tips to Train Like Phil Heath - Muscle & Fitness (interview with Hany Rambod)',
      url: 'https://www.muscleandfitness.com/athletes-celebrities/pro-tips/8-tips-train-phil-heath/',
    },
    {
      title: 'Training Style: FST-7 - Muscle & Fitness / Flex',
      url: 'https://www.muscleandfitness.com/flexonline/training/training-style-fst-7/',
    },
    {
      title: 'Training with THE GIFT - Mr Olympia Phil Heath - Muscle & Fitness',
      url: 'https://www.muscleandfitness.com/flexonline/flex-news/training-gift-mr-olympia-phil-heath/',
    },
  ],
});

// Fix Heath FST-7 finishers to 7 working sets (not 2WU+7) and 8-12
for (const id of ['heath-legs', 'heath-chest-triceps', 'heath-back-biceps', 'heath-shoulders']) {
  const r = routines.find((x) => x.id === id);
  if (!r) continue;
  r.exercises = r.exercises.map((ex) => {
    if (ex.setScheme?.some((s) => s.label === 'F7')) {
      return fst7Finisher(ex.exerciseId, ex.notes ?? 'FST-7 isolation finisher.');
    }
    // Normalize compounds to 4 working + warmups on first only
    return ex;
  });
  // Ensure first exercise has warmups and 4 working if it was the old 5-total pattern
  if (r.exercises[0] && !r.exercises[0].setScheme?.some((s) => s.label === 'F7')) {
    const first = r.exercises[0];
    r.exercises[0] = slot(first.exerciseId, 4, first.repRange === '10-12' ? '8-12' : first.repRange || '8-12', {
      withWarmups: true,
      notes: first.notes,
    });
  }
  for (let i = 1; i < r.exercises.length; i++) {
    const ex = r.exercises[i];
    if (ex.setScheme?.some((s) => s.label === 'F7')) continue;
    const reps = ex.repRange?.includes('15') ? ex.repRange : '8-12';
    r.exercises[i] = slot(ex.exerciseId, 4, reps, { notes: ex.notes });
  }
  r.source = {
    name: 'FST-7 / Hany Rambod + Phil Heath (Muscle & Fitness)',
    url: 'https://www.muscleandfitness.com/athletes-celebrities/pro-tips/8-tips-train-phil-heath/',
  };
}

// Explicit FST-7 finishers per day
{
  const legs = routines.find((r) => r.id === 'heath-legs');
  legs.exercises = [
    slot('leg-extension', 4, '10-12', { withWarmups: true }),
    slot('leg-press', 4, '10-12'),
    slot('barbell-squat', 4, '8-12'),
    fst7Finisher('lying-leg-curl', 'FST-7 hamstring finisher.'),
    slot('standing-calf-raise', 4, '12-20'),
  ];
  legs.description =
    'Phil Heath / Hany Rambod leg day: compounds for 4 working sets, then FST-7 lying leg curls (7×8-12, 30-45s).';

  const chest = routines.find((r) => r.id === 'heath-chest-triceps');
  chest.exercises = [
    slot('incline-barbell-press', 4, '8-12', { withWarmups: true }),
    slot('incline-bench-press-smith', 4, '8-12'),
    slot('incline-dumbbell-flye', 4, '10-12'),
    fst7Finisher('cable-crossover', 'FST-7 chest finisher.'),
    slot('triceps-pushdown', 4, '8-12'),
    slot('lying-triceps-extension', 4, '8-12'),
  ];

  const back = routines.find((r) => r.id === 'heath-back-biceps');
  back.exercises = [
    slot('lat-pulldown', 4, '8-12', { withWarmups: true }),
    slot('barbell-row', 4, '8-12'),
    slot('seated-cable-row', 4, '8-12'),
    slot('incline-dumbbell-curl', 4, '8-12'),
    fst7Finisher('cable-biceps-curl', 'FST-7 biceps finisher.'),
  ];

  const shoulders = routines.find((r) => r.id === 'heath-shoulders');
  shoulders.exercises = [
    slot('smith-machine-shoulder-press', 4, '8-12', { withWarmups: true }),
    slot('dumbbell-lateral-raise', 4, '10-12'),
    slot('dumbbell-shrug', 4, '10-12'),
    fst7Finisher('rear-delt-fly-machine', 'FST-7 rear-delt finisher.'),
    slot('face-pull', 4, '12-15'),
  ];
}

// ——— Frank Zane Growth Program (frankzane.com) ———
patchStyle('zane-aesthetics', {
  summary:
    "Frank Zane's Growth Program (frankzane.com): a three-way split — Pull (back, biceps, forearms, abs), Legs (thighs, calves, abs), Push (chest, shoulders, triceps, abs). Used for the 1979 Olympia on a 3-on/1-off cycle; Zane now prefers a 5-5-5-6 recovery cycle (train 3 days out of 5 three times, then 3 out of 6) so you grow between sessions.",
  principles: [
    'Three-way split: pull, legs, push — symmetry over sheer mass.',
    'Train abs every workout; include forearms on pull day.',
    'Prefer more rest than a rigid 3-on/1-off forever — Zane\'s modern 5-5-5-6 cycle.',
    'Moderate loads, strict form, inter-set stretching; vary order slightly each session.',
    'Quality and proportion beat chasing the heaviest possible weight.',
    'Log sessions; progressive overload with control.',
  ],
  guidelines: {
    trainingDaysPerWeek: 'Historically 3 on / 1 off; recommended now: 5-5-5-6 recovery cycle',
    frequencyPerMuscle: 'Once per pull/legs/push rotation (extra rest on 5-5-5-6).',
    warmupProtocol: 'One light warm-up set per exercise; never rush into heavy weight.',
    workingSetProtocol: '3-4 sets × 8-12 with moderate loads and strict form; stretch between sets on key moves.',
    repRanges: [
      { target: 'Most exercises', range: '8-12 reps' },
      { target: 'Calves', range: '12-15 reps' },
      { target: 'Abs', range: '15-25 reps' },
    ],
  },
  splitOverview: [
    { day: 'Day 1', focus: 'Back, Biceps, Forearms & Abs' },
    { day: 'Day 2', focus: 'Thighs, Calves & Abs' },
    { day: 'Day 3', focus: 'Chest, Shoulders, Triceps & Abs' },
    { day: 'Cycle', focus: 'Rest per 3-on/1-off or 5-5-5-6' },
  ],
  sources: [
    {
      title: 'The Growth Program, Then and Now — Frank Zane (official)',
      url: 'https://frankzane.com/the-growth-program-then-and-now-frank-zane/',
    },
    {
      title: 'Frank Zane Three-Way Training Split - Fitness Volt',
      url: 'https://fitnessvolt.com/frank-zane-training-split/',
    },
    {
      title: 'The Legend of Frank Zane - SimplyShredded',
      url: 'https://simplyshredded.com/the-legend-of-zane-an-interview.html',
    },
  ],
});

replaceRoutine('zane-pull', {
  id: 'zane-pull',
  name: 'Growth Program - Pull',
  day: 'Day 1',
  styleId: 'zane-aesthetics',
  sortOrder: 1,
  labels: ['Growth Program'],
  focus: ['back', 'lats', 'biceps', 'forearms', 'abs'],
  description:
    'Official Growth Program Day 1 — back, biceps, forearms, abs. Moderate loads, 8-12 reps, abs every session.',
  source: {
    name: 'The Growth Program — Frank Zane (official)',
    url: 'https://frankzane.com/the-growth-program-then-and-now-frank-zane/',
  },
  exercises: [
    slot('lat-pulldown', 4, '8-12', { withWarmups: true }),
    slot('barbell-row', 4, '8-12'),
    slot('seated-cable-row', 3, '8-12'),
    slot('barbell-curl', 4, '8-12'),
    slot('alternating-dumbbell-curl', 3, '10-12'),
    slot('hammer-curl', 3, '10-12', { notes: 'Forearm/brachialis emphasis on pull day.' }),
    slot('decline-crunch', 3, '15-25'),
  ],
  collection: 'legend',
});

replaceRoutine('zane-legs', {
  id: 'zane-legs',
  name: 'Growth Program - Legs',
  day: 'Day 2',
  styleId: 'zane-aesthetics',
  sortOrder: 2,
  labels: ['Growth Program'],
  focus: ['quads', 'hamstrings', 'calves', 'abs'],
  description: 'Official Growth Program Day 2 — thighs, calves, abs.',
  source: {
    name: 'The Growth Program — Frank Zane (official)',
    url: 'https://frankzane.com/the-growth-program-then-and-now-frank-zane/',
  },
  exercises: [
    slot('leg-extension', 4, '10-12', { withWarmups: true }),
    slot('barbell-squat', 4, '8-12'),
    slot('leg-press', 3, '10-12'),
    slot('lying-leg-curl', 4, '10-12'),
    slot('standing-calf-raise', 4, '12-15'),
    slot('decline-crunch', 3, '15-25'),
  ],
  collection: 'legend',
});

replaceRoutine('zane-push', {
  id: 'zane-push',
  name: 'Growth Program - Push',
  day: 'Day 3',
  styleId: 'zane-aesthetics',
  sortOrder: 3,
  labels: ['Growth Program'],
  focus: ['chest', 'shoulders', 'triceps', 'abs'],
  description: 'Official Growth Program Day 3 — chest, shoulders, triceps, abs.',
  source: {
    name: 'The Growth Program — Frank Zane (official)',
    url: 'https://frankzane.com/the-growth-program-then-and-now-frank-zane/',
  },
  exercises: [
    slot('incline-dumbbell-flye', 4, '10-12', { withWarmups: true }),
    slot('incline-barbell-press', 4, '8-12'),
    slot('dumbbell-lateral-raise', 4, '10-12'),
    slot('machine-shoulder-press', 3, '8-12'),
    slot('triceps-pushdown', 4, '10-12'),
    slot('decline-crunch', 3, '15-25'),
  ],
  collection: 'legend',
});

// ——— Dexter Jackson: Iron Man Magazine interview (2004 five-day split) ———
patchStyle('jackson-blade', {
  summary:
    "Dexter Jackson — The Blade — from his Iron Man Magazine interview: a five-day split after moving up from three days a week. Monday chest & abs, Tuesday back & calves, Wednesday/Thursday off, Friday quads, Saturday shoulders & arms, Sunday hamstrings. About 10 working sets per body part across 2-3 exercises historically; 3-4 sets on most lifts (5 on squats), mostly 6-10 reps with high-rep (up to 30) extensions/curls for detail, supersets often, forced reps sparingly.",
  principles: [
    'Train smart for longevity — heal injuries fully; ego does not own the session.',
    'Compounds first (squats, bench, rows, chins) — the bread and butter.',
    'Moderate volume: ~3-4 working sets per exercise; ~10 working sets per body part as a baseline.',
    'Supersets often; forced reps only occasionally.',
    'Separate quads and hamstrings when legs take too much out of one session.',
    'Conditioning is identity — The Blade never missed peak sharpness.',
  ],
  intensityTechniques: ['forced-reps'],
  guidelines: {
    trainingDaysPerWeek: '5 (Wed & Thu off in the Iron Man interview split)',
    frequencyPerMuscle: 'Once per week.',
    warmupProtocol: '2-3 warm-up sets on the first compound of each session.',
    workingSetProtocol:
      '3-4 working sets × 6-10 on most lifts (5 on squats). Leg extensions/curls can go very high-rep (up to ~30) for detail. Supersets common.',
    repRanges: [
      { target: 'Most compounds', range: '6-10 reps' },
      { target: 'Leg extensions / curls (detail)', range: '12-30 reps' },
      { target: 'Calves & abs', range: '12-20 reps' },
    ],
  },
  splitOverview: [
    { day: 'Mon', focus: 'Chest & Abs' },
    { day: 'Tue', focus: 'Back & Calves' },
    { day: 'Wed–Thu', focus: 'Rest' },
    { day: 'Fri', focus: 'Quads' },
    { day: 'Sat', focus: 'Shoulders & Arms' },
    { day: 'Sun', focus: 'Hamstrings' },
  ],
  sources: [
    {
      title: 'The Blade — Iron Man Magazine (Dexter Jackson interview)',
      url: 'https://www.ironmanmagazine.com/the-blade/',
    },
    {
      title: 'Dexter Jackson chest training - Fitness Volt / YouTube',
      url: 'https://fitnessvolt.com/dexter-jackson-chest-training/',
    },
    {
      title: 'Dexter Jackson on machines & longevity - Generation Iron',
      url: 'https://generationiron.com/dexter-jackson-tips-machine-work-time-off/',
    },
  ],
});

removeRoutine('jackson-chest-biceps');
removeRoutine('jackson-quads-calves');
removeRoutine('jackson-shoulders-triceps');
removeRoutine('jackson-back-hams');

const jacksonNote = 'Controlled 1s up / 1s down — Iron Man interview cadence.';
upsertRoutine({
  id: 'jackson-chest-abs',
  name: 'The Blade - Chest & Abs',
  day: 'Mon',
  styleId: 'jackson-blade',
  sortOrder: 1,
  labels: ['Iron Man interview split'],
  focus: ['chest', 'abs'],
  description:
    'Iron Man interview Monday: bench, incline, decline, optional crossovers precontest; abs (crunches / hanging raises).',
  source: {
    name: 'The Blade — Iron Man Magazine',
    url: 'https://www.ironmanmagazine.com/the-blade/',
  },
  exercises: [
    slot('barbell-bench-press', 4, '6-10', { withWarmups: true, note: jacksonNote }),
    slot('incline-barbell-press', 4, '6-10', { note: jacksonNote }),
    slot('decline-bench-press', 3, '6-10', { note: jacksonNote }),
    slot('cable-crossover', 3, '10-15', { notes: 'Precontest detail — optional off-season.' }),
    slot('decline-crunch', 3, '15-20'),
    slot('leg-raise-parallel-bars', 3, '12-20', { notes: 'Hanging knee-ups / leg raises.' }),
  ],
  collection: 'legend',
});

upsertRoutine({
  id: 'jackson-back-calves',
  name: 'The Blade - Back & Calves',
  day: 'Tue',
  styleId: 'jackson-blade',
  sortOrder: 2,
  labels: ['Iron Man interview split'],
  focus: ['back', 'lats', 'calves'],
  description: 'Iron Man interview Tuesday: pulldowns, bent-over rows, T-bar, deadlifts; standing & seated calves.',
  source: {
    name: 'The Blade — Iron Man Magazine',
    url: 'https://www.ironmanmagazine.com/the-blade/',
  },
  exercises: [
    slot('lat-pulldown', 4, '6-10', { withWarmups: true, note: jacksonNote }),
    slot('barbell-row', 4, '6-10', { note: jacksonNote }),
    slot('t-bar-row', 3, '6-10', { note: jacksonNote }),
    slot('deadlift', 3, '6-10', { note: jacksonNote }),
    slot('standing-calf-raise', 4, '12-20'),
    slot('seated-calf-raise', 3, '12-20'),
  ],
  collection: 'legend',
});

upsertRoutine({
  id: 'jackson-quads',
  name: 'The Blade - Quads',
  day: 'Fri',
  styleId: 'jackson-blade',
  sortOrder: 3,
  labels: ['Iron Man interview split'],
  focus: ['quads'],
  description:
    'Iron Man interview Friday quads alone: squats (up to 5 sets), hack squats, lunges, high-rep extensions for detail.',
  source: {
    name: 'The Blade — Iron Man Magazine',
    url: 'https://www.ironmanmagazine.com/the-blade/',
  },
  exercises: [
    slot('barbell-squat', 5, '6-10', { withWarmups: true, note: jacksonNote }),
    slot('hack-squat', 4, '8-12', { note: jacksonNote }),
    slot('walking-lunge', 3, '8-12', { note: jacksonNote }),
    slot('leg-extension', 4, '15-30', {
      notes: 'Dexter cited very high-rep extensions for ripped quads.',
    }),
  ],
  collection: 'legend',
});

upsertRoutine({
  id: 'jackson-shoulders-arms',
  name: 'The Blade - Shoulders & Arms',
  day: 'Sat',
  styleId: 'jackson-blade',
  sortOrder: 4,
  labels: ['Iron Man interview split'],
  focus: ['shoulders', 'rear-delts', 'biceps', 'triceps'],
  description:
    'Iron Man interview Saturday: machine presses, laterals, rear laterals; curls and pushdowns/skulls/dips. Supersets common.',
  source: {
    name: 'The Blade — Iron Man Magazine',
    url: 'https://www.ironmanmagazine.com/the-blade/',
  },
  exercises: [
    slot('machine-shoulder-press', 4, '6-10', { withWarmups: true, note: jacksonNote }),
    slot('dumbbell-lateral-raise', 4, '8-12', { note: jacksonNote }),
    slot('rear-delt-fly-machine', 3, '10-15', { note: jacksonNote }),
    slot('barbell-curl', 4, '6-10', { note: jacksonNote }),
    slot('alternating-dumbbell-curl', 3, '8-12', { note: jacksonNote }),
    slot('triceps-pushdown', 4, '8-12', { note: jacksonNote }),
    slot('lying-triceps-extension', 3, '8-12', { note: jacksonNote }),
    slot('weighted-triceps-dip', 3, '6-10', { note: jacksonNote }),
  ],
  collection: 'legend',
});

upsertRoutine({
  id: 'jackson-hams',
  name: 'The Blade - Hamstrings',
  day: 'Sun',
  styleId: 'jackson-blade',
  sortOrder: 5,
  labels: ['Iron Man interview split'],
  focus: ['hamstrings'],
  description:
    'Iron Man interview Sunday: lying and seated leg curls plus stiff-legged deadlifts — hams alone after Friday quads.',
  source: {
    name: 'The Blade — Iron Man Magazine',
    url: 'https://www.ironmanmagazine.com/the-blade/',
  },
  exercises: [
    slot('lying-leg-curl', 4, '12-30', {
      withWarmups: true,
      notes: 'High-rep curls for detail when chasing condition.',
    }),
    slot('standing-leg-curl', 4, '10-15', { notes: 'Seated/standing curl variation.' }),
    slot('romanian-deadlift', 4, '6-10', { note: jacksonNote }),
  ],
  collection: 'legend',
});

// ——— Gaspari: official shoulder pre-exhaust ———
patchStyle('gaspari-annihilation', {
  sources: [
    {
      title: 'Pre-Exhaustion Shoulder Training — Gaspari Nutrition (official)',
      url: 'https://gasparinutrition.com/blogs/old-school-training-tips/pre-exhaustion-in-a-shoulder-workout',
    },
    {
      title: "Rich Gaspari's Old School Chest and Back Superset — Gaspari Nutrition",
      url: 'https://gasparinutrition.com/blogs/fitness-facts/rich-gasparis-old-school-chest-and-back-superset',
    },
    {
      title: 'Rich Gaspari on Training to Complete Failure - Fitness Volt',
      url: 'https://fitnessvolt.com/rich-gaspari-best-method-building-muscle/',
    },
  ],
});

replaceRoutine('gaspari-shoulders-traps', {
  id: 'gaspari-shoulders-traps',
  name: 'Annihilation - Shoulders (Pre-Exhaust)',
  day: 'Day 4',
  styleId: 'gaspari-annihilation',
  sortOrder: 3,
  labels: ['Gaspari Nutrition'],
  focus: ['shoulders', 'rear-delts', 'traps'],
  description:
    'Official Gaspari Nutrition pre-exhaust shoulder template: high-rep laterals and front raises first, then presses, rear delts, and face pulls — isolation before compounds.',
  source: {
    name: 'Pre-Exhaustion Shoulder Training — Gaspari Nutrition',
    url: 'https://gasparinutrition.com/blogs/old-school-training-tips/pre-exhaustion-in-a-shoulder-workout',
  },
  exercises: [
    slot('dumbbell-lateral-raise', 4, '15-20', {
      withWarmups: true,
      notes: 'Pre-exhaust medial delts — slow tempo, pause at top.',
    }),
    slot('front-raise', 3, '12-15', { notes: 'Seated/alternating front raises before presses.' }),
    slot('military-press', 4, '8-10', {
      notes: 'Presses after isolation — moderate load, delts already pre-fatigued.',
    }),
    slot('machine-shoulder-press', 3, '10-12', {
      notes: 'Arnold-press style full-delt work from the Gaspari sample.',
    }),
    slot('rear-delt-fly-machine', 3, '15-20'),
    slot('face-pull', 3, '15-20'),
    slot('barbell-shrug', 3, '10-12'),
  ],
  collection: 'legend',
});

// ——— Mentzer sources ———
patchStyle('heavy-duty', {
  sources: [
    {
      title: 'Heavy Duty: The Ideal Routine - MikeMentzer.org',
      url: 'https://mikementzer.org/heavy-duty-the-ideal-routine/',
    },
    {
      title: "Mike Mentzer's Ideal Routine: A Heavy Duty Blueprint - MikeMentzer.org",
      url: 'https://mikementzer.org/mike-mentzers-ideal-routine-a-heavy-duty-blueprint/',
    },
    {
      title: 'Heavy Duty College (official YouTube)',
      url: 'https://www.youtube.com/@HeavyDutyCollege',
    },
    {
      title: "Mike Mentzer's Consolidated Routine - Liftosaur",
      url: 'https://www.liftosaur.com/programs/mike-mentzer-consolidated',
    },
  ],
});

// ——— Coleman sources ———
patchStyle('coleman-powerbuilding', {
  sources: [
    {
      title: 'Ronnie Coleman Signature Series — How to be Hardcore (official)',
      url: 'https://ronniecoleman.net/blogs/articles/how-to-be-hardcore',
    },
    {
      title: 'Ronnie Coleman Workout Routine - Fitness Volt',
      url: 'https://fitnessvolt.com/ronnie-coleman-workout-program/',
    },
    {
      title: 'RCSS YouTube / training archive',
      url: 'https://ronniecoleman.net/pages/youtube-2',
    },
  ],
  summary:
    "Ronnie Coleman — 8× Mr. Olympia — built historic mass on heavy compounds plus mountains of accessory volume, typically six days a week with large groups twice. Official RCSS framing: lift as heavy as possible for as many quality sets and reps as possible, with a hardcore Metroflex mindset. Documented splits commonly run back/bis, chest/tris, legs, shoulders/traps on a weekly rotation.",
});

// ——— HTLT sources ———
patchStyle('htlt', {
  sources: [
    {
      title: 'Harder Than Last Time Training Programs — Coach Greg Inc. (official)',
      url: 'https://www.gregdoucette.com/products/htlt-training-programs',
    },
    {
      title: 'Coach Greg YouTube (HTLT principles)',
      url: 'https://www.youtube.com/@gregdoucette',
    },
    {
      title: 'Greg Doucette Profile - Generation Iron',
      url: 'https://generationiron.com/greg-doucette-profile-bio-stats/',
    },
  ],
});

// ——— Haney: calves/abs every day note + sources ———
patchStyle('haney-stimulate', {
  summary:
    "Lee Haney's eight-Olympia philosophy — stimulate, don't annihilate. Favorite structure: three days on, one off (chest & arms; legs; back & shoulders; rest), with calves and abs every training day. Pyramid into working sets at ~75-85% max; pair push with pull when possible for joint longevity. Do not chase failure every session.",
  principles: [
    'Stimulate the muscle — do not annihilate it every workout.',
    'Three on, one off gives each body part ~three recovery days.',
    'Train calves and abs every training day.',
    'Pyramid warm-ups into heavy work; top sets often 6-10 at 75-85%.',
    'Protect joints — prefer push/pull pairings over stacking two press days.',
    'Consistency and longevity beat one reckless all-out week.',
  ],
  guidelines: {
    trainingDaysPerWeek: '3 on, 1 off (repeating cycle)',
    frequencyPerMuscle: 'Once every four days in the cycle.',
    warmupProtocol: 'Pyramid warm-ups — light 15, then 10, then 8 before top work.',
    workingSetProtocol:
      '3-4 exercises per body part, often 4 working sets on compounds (6-10). Calves & abs every session. Avoid failure every set.',
    repRanges: [
      { target: 'Warm-up pyramid', range: '15 → 10 → 8' },
      { target: 'Working sets', range: '6-10 reps' },
      { target: 'Calves & abs', range: '15-25 reps' },
    ],
  },
  sources: [
    {
      title: "Lee Haney's Training Split Suggestions - Muscle & Fitness / Flex",
      url: 'https://www.muscleandfitness.com/flexonline/training/lee-haneys-opinion-training-splits/',
    },
    {
      title: "Workout Systems: Lee Haney's 4-Day Training Split - Poliquin Group",
      url: 'https://poliquingroup.com/ArticlesMultimedia/Articles/Article/2690/Workout_Systems_Lee_Haneys_4-Day_Training_Split.aspx',
    },
    {
      title: 'Lee Haney Workout: Top Training Tips - The Barbell',
      url: 'https://thebarbell.com/lee-haney-workout/',
    },
  ],
});

for (const id of ['haney-chest-arms', 'haney-legs', 'haney-back-shoulders']) {
  const r = routines.find((x) => x.id === id);
  if (!r) continue;
  if (!r.focus.includes('calves')) r.focus = [...r.focus, 'calves'];
  if (!r.focus.includes('abs')) r.focus = [...r.focus, 'abs'];
  const hasCalves = r.exercises.some((e) => e.exerciseId.includes('calf'));
  const hasAbs = r.exercises.some((e) => e.exerciseId.includes('crunch') || e.exerciseId.includes('raise'));
  if (!hasCalves) {
    r.exercises.push(slot('standing-calf-raise', 4, '15-25', { notes: 'Calves every Haney training day.' }));
  }
  if (!hasAbs) {
    r.exercises.push(slot('decline-crunch', 3, '15-25', { notes: 'Abs every Haney training day.' }));
  }
  r.source = {
    name: "Lee Haney 3-on/1-off — Poliquin / Muscle & Fitness",
    url: 'https://poliquingroup.com/ArticlesMultimedia/Articles/Article/2690/Workout_Systems_Lee_Haneys_4-Day_Training_Split.aspx',
  };
}

// ——— Yates: keep DVD as primary; clarify calendar variance ———
patchStyle('blood-and-guts', {
  summary:
    "Dorian Yates' Blood & Guts HIT as filmed at Temple Gym in the 1996 documentary: one progressive warm-up pyramid then a single all-out working set per exercise to absolute failure and beyond with a partner. Body parts once every six days on a four-day training week (two on, one off, two on, rest). Weekly calendar order varies across interviews; this collection follows the Blood & Guts DVD session order and exercise selections.",
});

// ——— Bannout: keep structure, upgrade sources / honesty in summary ———
patchStyle('bannout-lion', {
  summary:
    "Samir Bannout — Lion of Lebanon, 1983 Mr. Olympia — trained on a hard 3-on/1-off cycle with old-school volume, short rests (~35s in prep), and heavy compounds. Public workout reconstructions vary; the sessions here follow commonly cited 1983-prep templates (shoulders & arms; legs & abs; chest & back) rather than a single surviving official program PDF. Treat set counts as high-volume era references and scale to recovery.",
  sources: [
    {
      title: 'Samir Bannout - The Lion of Lebanon - Fitness Volt',
      url: 'https://fitnessvolt.com/1725/samir-bannout-the-lion-of-lebanon/',
    },
    {
      title: "Samir Bannout's Workout and Diet - Iron and Grit Fitness",
      url: 'https://ironandgrit.com/2021/05/02/samir-bannout-workout/',
    },
    {
      title: 'Old School Bodybuilder: Samir Bannout Workout - Nutribody',
      url: 'https://nutribody.com/old-school-bodybuilder-samir-bannout-workout/',
    },
  ],
});

// ——— Cutler: already OSC-aligned; ensure Volt sets article is present ———
{
  const c = styles.find((s) => s.id === 'cutler-volume');
  if (c && !c.sources.some((s) => s.url.includes('jay-cutler-sets-per-body-part'))) {
    c.sources.push({
      title: 'Jay Cutler on Sets Per Body Part — Fitness Volt',
      url: 'https://fitnessvolt.com/jay-cutler-sets-per-body-part/',
    });
  }
}

write('src/data/styles.json', styles);
write('src/data/routines.json', routines);

const legend = routines.filter((r) => r.collection === 'legend');
console.log('Styles:', styles.length, 'Legend workouts:', legend.filter((r) => r.styleId).length);
for (const id of [
  'arnold-golden-era',
  'heath-fst7',
  'zane-aesthetics',
  'jackson-blade',
  'gaspari-annihilation',
  'haney-stimulate',
]) {
  const st = styles.find((s) => s.id === id);
  const rs = legend.filter((r) => r.styleId === id);
  console.log(id, '→', rs.map((r) => r.day).join(' | '), '| sources', st.sources.length);
}
