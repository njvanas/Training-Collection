/**
 * Pass 3–4: Mentzer consolidation (official A/B), Coleman volume bump.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) =>
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const styles = read('src/data/styles.json');
const routines = read('src/data/routines.json');

const WU = (i) => ({ label: 'W1', kind: 'warmup', intensity: i });
const WU2 = (i) => ({ label: 'W2', kind: 'warmup', intensity: i });
const WS = (n, note) => ({
  label: String(n),
  kind: 'working',
  intensity: note ?? 'Heavy & controlled — straight set',
});

function scheme(n, wu = false, note) {
  const o = wu ? [WU('~30% of working weight'), WU2('~60% of working weight')] : [];
  for (let i = 1; i <= n; i++) o.push(WS(i, note));
  return o;
}

function cslot(id, n, reps, wu = false, notes) {
  return {
    exerciseId: id,
    sets: n,
    repRange: reps,
    setScheme: scheme(n, wu, 'Heavy Metroflex volume — controlled, stop shy of failure'),
    ...(notes ? { notes } : {}),
  };
}

const failScheme = (warmNote) => [
  { label: 'Warm-ups', kind: 'warmup', intensity: warmNote },
  {
    label: 'F1',
    kind: 'failure',
    intensity: 'One all-out set to momentary muscular failure',
  },
];

const ca = routines.find((r) => r.id === 'mentzer-consolidation-a');
ca.description =
  'Heavy Duty Consolidation Workout A (MikeMentzer.org): squat then close-grip palms-up pulldown — one set each to failure. Alternate with Workout B every 7–10+ days.';
ca.source = {
  name: 'Consolidation Program — MikeMentzer.org',
  url: 'https://mikementzer.org/the-consolidation-program-and-the-indirect-effect/',
};
ca.focus = ['quads', 'lats', 'back'];
ca.exercises = [
  {
    exerciseId: 'barbell-squat',
    sets: 1,
    repRange: '8-15',
    notes: 'Systemic catalyst — one set to failure.',
    setScheme: failScheme('1–3 progressive — never to failure'),
  },
  {
    exerciseId: 'reverse-grip-lat-pulldown',
    sets: 1,
    repRange: '6-10',
    notes: 'Close-grip palms-up pulldown.',
    setScheme: failScheme('1–2 progressive — never to failure'),
  },
];

const cb = routines.find((r) => r.id === 'mentzer-consolidation-b');
cb.description =
  'Heavy Duty Consolidation Workout B (MikeMentzer.org): deadlift then dips — one set each to failure. Alternate with Workout A every 7–10+ days; extend rest if progress stalls.';
cb.source = {
  name: 'Consolidation Program — MikeMentzer.org',
  url: 'https://mikementzer.org/consolidated-program-final-heavy-duty-logic/',
};
cb.focus = ['back', 'lower-back', 'hamstrings', 'triceps', 'chest'];
cb.exercises = [
  {
    exerciseId: 'deadlift',
    sets: 1,
    repRange: '5-8',
    notes: 'Total-body deadlift to near/true failure.',
    setScheme: failScheme('1–3 progressive — never to failure'),
  },
  {
    exerciseId: 'weighted-triceps-dip',
    sets: 1,
    repRange: '6-10',
    notes: 'Parallel-bar dips — Mentzer called these the upper-body squat.',
    setScheme: failScheme('1–2 progressive — never to failure'),
  },
];

const back = routines.find((r) => r.id === 'coleman-back-biceps');
back.description =
  'Ronnie Coleman back and biceps — high-volume Metroflex style (~20+ working sets on back plus arms), run Mon & Thu.';
back.source = {
  name: 'Ronnie Coleman Workout Guide — RC Nutrition',
  url: 'https://ronniecolemannutrition.com/blog/ronnie-coleman-workout-guide/',
};
back.exercises = [
  cslot('deadlift', 4, '4-8', true, 'Heavy deadlifts — Olympia-era staple.'),
  cslot('barbell-row', 4, '8-12'),
  cslot('t-bar-row', 4, '8-12'),
  cslot('one-arm-dumbbell-row', 3, '10-12'),
  cslot('seated-cable-row', 3, '10-12'),
  cslot('lat-pulldown', 3, '10-12'),
  cslot('barbell-curl', 4, '10-12'),
  cslot('alternating-dumbbell-curl', 3, '10-12'),
  cslot('hammer-curl', 3, '10-12'),
];

const chest = routines.find((r) => r.id === 'coleman-chest-triceps');
chest.source = back.source;
chest.exercises = [
  cslot('barbell-bench-press', 5, '6-12', true),
  cslot('incline-barbell-press', 4, '8-12'),
  cslot('dumbbell-bench-press', 3, '8-12'),
  cslot('decline-bench-press', 3, '8-12'),
  cslot('cable-crossover', 3, '12-15'),
  cslot('close-grip-bench-press', 4, '8-12'),
  cslot('lying-triceps-extension', 3, '10-12'),
  cslot('triceps-pushdown', 3, '12-15'),
];

const legs = routines.find((r) => r.id === 'coleman-legs');
legs.source = back.source;
legs.exercises = [
  cslot('barbell-squat', 5, '4-8', true, 'Heavy squats — powerbuilding cornerstone.'),
  cslot('leg-press', 4, '8-12'),
  cslot('walking-lunge', 3, '10-12'),
  cslot('leg-extension', 3, '12-15'),
  cslot('lying-leg-curl', 4, '10-12'),
  cslot('romanian-deadlift', 3, '8-12'),
  cslot('standing-calf-raise', 4, '12-15'),
];

const sh = routines.find((r) => r.id === 'coleman-shoulders-traps');
sh.source = back.source;
sh.exercises = [
  cslot('military-press', 4, '8-12', true),
  cslot('dumbbell-lateral-raise', 4, '12-15'),
  cslot('front-raise', 3, '10-15'),
  cslot('rear-delt-fly-machine', 4, '12-15'),
  cslot('barbell-shrug', 4, '10-12'),
  cslot('upright-row', 3, '10-12'),
];

const cs = styles.find((s) => s.id === 'coleman-powerbuilding');
cs.guidelines.workingSetProtocol =
  '3-5 working sets per exercise; 16-25 total working sets per large muscle group per session (Ronnie Coleman Nutrition guide). Warm-ups extra.';
cs.sources = [
  {
    title: 'Ronnie Coleman Workout Guide — Ronnie Coleman Nutrition',
    url: 'https://ronniecolemannutrition.com/blog/ronnie-coleman-workout-guide/',
  },
  {
    title: 'Ronnie Coleman Signature Series — How to be Hardcore',
    url: 'https://ronniecoleman.net/blogs/articles/how-to-be-hardcore',
  },
  {
    title: 'Ronnie Coleman Workout Program - Fitness Volt',
    url: 'https://fitnessvolt.com/ronnie-coleman-workout-program/',
  },
];

const hd = styles.find((s) => s.id === 'heavy-duty');
if (!hd.sources.some((s) => s.url.includes('consolidation-program'))) {
  hd.sources.splice(2, 0, {
    title: 'The Consolidation Program — MikeMentzer.org',
    url: 'https://mikementzer.org/the-consolidation-program-and-the-indirect-effect/',
  });
}

write('src/data/styles.json', styles);
write('src/data/routines.json', routines);
console.log('Pass 3–4 Mentzer consolidation + Coleman volume OK');
