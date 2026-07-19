/**
 * Follow-up fixes from completed legend audits (Mentzer/Coleman/HTLT,
 * Heath/Arnold/Haney, Zane/Bannout/Jackson/Gaspari).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const write = (f, d) => fs.writeFileSync(path.join(root, f), `${JSON.stringify(d, null, 2)}\n`);

const styles = read('src/data/styles.json');
const routines = read('src/data/routines.json');

function patch(id, patch) {
  const i = styles.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(id);
  const cur = styles[i];
  styles[i] = {
    ...cur,
    ...patch,
    guidelines: patch.guidelines ? { ...cur.guidelines, ...patch.guidelines } : cur.guidelines,
    principles: patch.principles ?? cur.principles,
    intensityTechniques: patch.intensityTechniques ?? cur.intensityTechniques,
    sources: patch.sources ?? cur.sources,
    splitOverview: patch.splitOverview ?? cur.splitOverview,
    tags: patch.tags ?? cur.tags,
  };
}

function routine(id) {
  const r = routines.find((x) => x.id === id);
  if (!r) throw new Error(id);
  return r;
}

// ——— Mentzer Ideal ———
patch('heavy-duty', {
  intensityTechniques: ['forced-reps', 'negatives', 'iso-hold'],
  guidelines: {
    workingSetProtocol:
      'Exactly 1 working set per exercise to momentary muscular failure (Ideal), sometimes extended with forced reps, negatives, or a static hold. Pre-exhaust supersets pair isolation into compound. Deadlifts are taken near failure, not always absolute failure.',
  },
  principles: [
    'Intensity is inversely proportional to volume and frequency: the harder you train, the less you can and should do.',
    'One set to true momentary muscular failure per exercise is not just sufficient - it is optimal (deadlifts: near failure).',
    'Only the last, impossible rep recruits the highest-threshold fibers that trigger growth.',
    'Recovery is a finite resource; every extra set or session draws from it and delays growth.',
    'Rest at least 4-7 days between sessions, adding more rest days if progress stalls.',
    'Progress by double progression: add reps within the range, then add weight.',
  ],
});

{
  const w1 = routine('mentzer-w1-chest-back');
  const dl = w1.exercises.find((e) => e.exerciseId === 'deadlift');
  if (dl) {
    dl.notes =
      'Mentzer Ideal: regular-style deadlift taken near failure (not always absolute failure).';
    dl.setScheme = dl.setScheme.map((s) =>
      s.kind === 'failure' || s.label === 'F1'
        ? {
            ...s,
            kind: 'failure',
            intensity: 'Near failure — heavy systemic set; stop short of form breakdown',
          }
        : s,
    );
  }
}

// ——— Coleman ———
patch('coleman-powerbuilding', {
  tags: ['High volume', '6-day split', 'Heavy compounds', 'Metroflex'],
  summary:
    "Ronnie Coleman — 8× Mr. Olympia — built historic mass on heavy compounds plus mountains of accessory volume at Metroflex. Official RCSS framing: lift as heavy as possible for as many quality sets and reps as possible. The weekly template here is a common reconstruction (back/bis and chest/tris twice; legs and shoulders once) — RC Nutrition pages themselves publish more than one day order, so treat it as representative Olympia-era programming, not a single official PDF.",
  principles: [
    'Heavy compound barbell movements (squat, deadlift, bench, row) are the core of every session.',
    'Work in the 8-12 range with the heaviest weight you can control — and 4-8 on the main lifts.',
    'Volume drives growth: often 16-25 working sets on a large group in one session.',
    'Six training days: this reconstruction hits back and chest twice; legs and shoulders once.',
    'Progressive overload through load and total volume, not intensity gimmicks.',
    'Hardcore mindset — recovery came from food and sleep as much as from programmed deloads.',
  ],
  guidelines: {
    frequencyPerMuscle:
      'In this reconstruction: back & chest twice weekly; legs & shoulders/traps once. Other published Coleman weeks differ.',
  },
  sources: [
    {
      title: 'Ronnie Coleman Workout Guide — Ronnie Coleman Nutrition',
      url: 'https://ronniecolemannutrition.com/blog/ronnie-coleman-workout-guide/',
    },
    {
      title: 'Ronnie Coleman Signature Series — How to be Hardcore',
      url: 'https://ronniecoleman.net/blogs/articles/how-to-be-hardcore',
    },
    {
      title: 'Ronnie Coleman official YouTube',
      url: 'https://www.youtube.com/@ronniecoleman8',
    },
    {
      title: 'Ronnie Coleman Workout Program - Fitness Volt',
      url: 'https://fitnessvolt.com/ronnie-coleman-workout-program/',
    },
  ],
});

// ——— HTLT Hardcore pairings ———
patch('htlt', {
  summary:
    "Greg Doucette's Harder Than Last Time system: progressive overload, controlled tempo (~2s down / 1s up / 1s pause), and sustainability. Hardcore Template I (representative, paid manual) pairs Legs & Biceps; Chest, Shoulders & Triceps; then a back-focused day — run across the week so parts hit ~2×. Exact exercise lists are representative; principles come from Coach Greg Inc.",
  splitOverview: [
    { day: 'Day 1', focus: 'Legs & Biceps' },
    { day: 'Day 2', focus: 'Chest, Shoulders & Triceps' },
    { day: 'Day 3', focus: 'Back (width & thickness)' },
    { day: 'Repeat', focus: 'Run the 3-day Hardcore template across 5–7 days (~2×/week)' },
    { day: 'Daily', focus: '~150 min/week incline-walk cardio' },
  ],
  sources: [
    {
      title: 'Harder Than Last Time Training Programs — Coach Greg Inc. (official)',
      url: 'https://www.gregdoucette.com/products/htlt-training-programs',
    },
    {
      title: 'HTLT programs page — Coach Greg Inc.',
      url: 'https://www.gregdoucette.com/pages/htlt-training-programs',
    },
    {
      title: 'Coach Greg YouTube (HTLT principles)',
      url: 'https://www.youtube.com/@gregdoucette',
    },
  ],
});

{
  const d1 = routine('doucette-legs');
  d1.name = 'HTLT Hardcore - Legs & Biceps';
  d1.focus = ['quads', 'hamstrings', 'glutes', 'calves', 'biceps'];
  d1.description =
    'Representative HTLT Hardcore Day 1 (Legs & Biceps): controlled tempo, target rep ranges, warm-ups stop 3–5 RIR, last set of each movement can go all-out. Exercise list is representative of the paid Hardcore template.';
  d1.source = {
    name: 'HTLT Training Programs — Coach Greg Inc.',
    url: 'https://www.gregdoucette.com/products/htlt-training-programs',
  };
  if (!d1.exercises.some((e) => e.exerciseId.includes('curl'))) {
    d1.exercises.push({
      exerciseId: 'barbell-curl',
      sets: 3,
      repRange: '10-12',
      notes: 'Hardcore Template I pairs biceps with legs.',
      setScheme: [
        { label: 'WU', kind: 'warmup', intensity: '12–20 reps, 3–5 RIR' },
        { label: '1', kind: 'working', intensity: 'Target range, 2-1-1 tempo' },
        { label: '2', kind: 'working', intensity: 'Target range, controlled' },
        { label: '3', kind: 'all-out', intensity: 'All-out finisher — partials/drop optional' },
      ],
    });
  }

  const d2 = routine('doucette-chest-arms');
  d2.name = 'HTLT Hardcore - Chest, Shoulders & Triceps';
  d2.focus = ['chest', 'shoulders', 'triceps'];
  d2.description =
    'Representative HTLT Hardcore Day 2 (Chest, Shoulders & Triceps). Exercise list is representative — not a free public canon spreadsheet.';
  d2.source = d1.source;
  // Ensure a shoulder press is present; keep laterals; drop pure biceps if present as primary
  d2.exercises = d2.exercises.filter((e) => !['barbell-curl', 'cable-biceps-curl'].includes(e.exerciseId));
  if (
    !d2.exercises.some(
      (e) =>
        e.exerciseId === 'military-press' ||
        e.exerciseId === 'smith-machine-shoulder-press' ||
        e.exerciseId === 'machine-shoulder-press',
    )
  ) {
    d2.exercises.splice(2, 0, {
      exerciseId: 'military-press',
      sets: 3,
      repRange: '8-12',
      notes: 'Shoulders with the push day in Hardcore Template I.',
      setScheme: [
        { label: 'WU', kind: 'warmup', intensity: '12–20 reps, 3–5 RIR' },
        { label: '1', kind: 'working', intensity: 'Target range, 2-1-1 tempo' },
        { label: '2', kind: 'working', intensity: 'Target range, controlled' },
        { label: '3', kind: 'all-out', intensity: 'All-out finisher' },
      ],
    });
  }

  const d3 = routine('doucette-back-shoulders');
  d3.name = 'HTLT Hardcore - Back';
  d3.focus = ['back', 'lats', 'rear-delts', 'traps'];
  d3.description =
    'Representative HTLT Hardcore Day 3 — back-focused (width and thickness). Shoulders already hit on Day 2 in Template I; rear-delt / upper-back work can still appear here.';
  d3.source = d1.source;
}

// ——— Heath / FST-7 ———
patch('heath-fst7', {
  creator: 'Hany Rambod / Phil Heath',
  tags: ['FST-7', 'Fascia stretch', 'Body-part split', 'Pump'],
  summary:
    "FST-7 (Fascia Stretch Training) was created by coach Hany Rambod and popularized with Phil Heath (and Jay Cutler): 3–4 straight working sets on most lifts, then a seven-set isolation/machine/cable finisher (8–12 reps, 30–45s rest) for the pump. Splits vary — Rambod samples and Heath’s own weeks differ — so the days here are a common body-part template, not the only Olympia calendar. Large muscles are often 1×/week under FST-7; arms and calves can be 2×.",
  principles: [
    'Finish a body part with FST-7 on an isolation, machine, or cable move — not heavy free-weight compounds like squat/deadlift.',
    'Sevens: same load when possible, stay ~8–12, 30–45s rest; flex/stretch between sets. Not a drop-set protocol.',
    'Most other exercises: 3–4 working sets in the 8–12 zone with normal rest.',
    'Train 5–6 days; large parts often once weekly; arms/calves may appear twice.',
    'Abs first on days they are trained (per Rambod).',
    'Control every rep; the pump stretches fascia from the inside out.',
  ],
  intensityTechniques: ['iso-hold', 'static-stretch', 'partials'],
  guidelines: {
    frequencyPerMuscle:
      'Large muscles often once per week with FST-7; arms and calves can be twice (Rambod).',
    workingSetProtocol:
      '3–4 working sets on most lifts, then one FST-7 isolation finisher (7×8–12, 30–45s). Do not use sevens on heavy free-weight compounds.',
  },
  splitOverview: [
    { day: 'Day 1', focus: 'Legs (example template)' },
    { day: 'Day 2', focus: 'Chest & Triceps (example)' },
    { day: 'Day 3', focus: 'Rest' },
    { day: 'Day 4', focus: 'Back & Biceps (example)' },
    { day: 'Day 5', focus: 'Shoulders & Traps (example)' },
    { day: 'Day 6', focus: 'Arms optional / 2× week' },
    { day: 'Day 7', focus: 'Rest' },
  ],
});

// ——— Arnold: clarify phases ———
patch('arnold-golden-era', {
  name: 'Golden Era Volume',
  tags: ['High volume', '6-day split', 'Supersets', 'Golden Six (early)'],
  summary:
    "Two phases: (1) Golden Six — early full-body, 3×/week, six basic lifts; (2) competitive Encyclopedia / Golden Era volume — six-day Chest & Back, Shoulders & Arms, Legs (each twice), often with supersets and far higher set counts. Do not treat Golden Six as what Arnold used to win Olympias.",
  principles: [
    'Competitive era: each major part twice per week on Chest/Back → Shoulders/Arms → Legs.',
    'Pair antagonists (chest with back) for supersets and density.',
    'Give shoulders and arms their own day so arms are fresh.',
    'Competitive volume is high — often many sets per part across multiple angles (not Golden Six’s 3–4×10).',
    'Golden Six is the early-career full-body foundation only (3×/week).',
    'Progressive overload with controlled form; chase the pump.',
  ],
  guidelines: {
    trainingDaysPerWeek: 'Competitive: 6; Golden Six (early): 3 non-consecutive',
    frequencyPerMuscle: 'Competitive: 2×/week; Golden Six: 3×/week full body',
    workingSetProtocol:
      'Competitive: typically 4–5+ working sets per exercise and high total volume per part, often supersetted. Golden Six only: squat 4×10, bench 3×10, chins 3×AMRAP, BTN press 4×10, curl 3×10, sit-ups 3–4×AMRAP.',
  },
  sources: [
    {
      title: 'The New Encyclopedia of Modern Bodybuilding — Arnold Schwarzenegger & Bill Dobbins',
      url: 'https://www.penguinrandomhouse.com/books/322959/the-new-encyclopedia-of-modern-bodybuilding-by-arnold-schwarzenegger/',
    },
    {
      title: "Arnold's Double-Split Workout — Muscle & Fitness",
      url: 'https://www.muscleandfitness.com/routine/workouts/workout-routines/arnold-schwarzeneggers-double-split-routine/',
    },
    {
      title: "Arnold's Golden Six Routine - Fitness Volt (early phase)",
      url: 'https://fitnessvolt.com/arnolds-golden-six-routine/',
    },
    {
      title: 'Arnold Split overview - StrengthLog (Encyclopedia-based)',
      url: 'https://www.strengthlog.com/arnold-split/',
    },
  ],
});

{
  const g6 = routine('arnold-golden-six');
  g6.description =
    'Early-career Golden Six only — not the competitive Olympia program. Six lifts, 3×/week on non-consecutive days. Add weight when you exceed rep targets.';
  g6.labels = ['Golden Six (early career)'];
}

// ——— Haney ———
patch('haney-stimulate', {
  intensityTechniques: [],
  guidelines: {
    workingSetProtocol:
      '3–4 exercises per body part; compounds often 4–5 working sets (6–10) after a pyramid warm-up. Calves & abs every session. Stimulate — do not chase failure every set.',
  },
  sources: [
    {
      title: 'Lee Haney Official Site',
      url: 'https://leehaney.com/',
    },
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

// ——— Bannout ———
patch('bannout-lion', {
  name: 'Lion of Lebanon (1983-era)',
  tags: ['Old school', '3-on-1-off', 'Nickname era', 'Reconstructed'],
  summary:
    "Samir Bannout — nicknamed the Lion of Lebanon — won the 1983 Mr. Olympia. There is no official branded “Lion” training system. Public 1983-prep reconstructions usually use a 3-on/1-off cycle with shoulders & arms, legs & abs, and chest & back (day order conflicts across secondary sources). Treat the workouts here as reconstructed high-volume era templates and scale to recovery.",
  principles: [
    'Three days on, one off is the commonly cited cycle — fully recover before repeating.',
    'Train hard with heavy compounds and high set counts typical of the era.',
    'Listen to the body — adjust exercises and reps by feel.',
    'Build back density with rows, pulldowns, and Olympic-lifting roots.',
    'Day order and exact rest intervals vary by secondary source — not primary gospel.',
    'Art and aesthetics matter as much as the weight on the bar.',
  ],
  guidelines: {
    warmupProtocol: 'One high-rep warm-up on the first compound, then pyramid up.',
    workingSetProtocol:
      'Secondary reconstructions often show 4–6 sets per exercise, 6–15 reps by feel. Short rests and AM/PM weak-point sessions appear in blogs but are not verified from a primary 1983 magazine feature here — treat as optional, not required.',
  },
});

// ——— Jackson ———
patch('jackson-blade', {
  name: 'The Blade',
  tags: ['Consistency', '5-day split', 'Supersets', 'Conditioning'],
  summary:
    "Dexter Jackson — nicknamed The Blade for conditioning, not a branded system. Iron Man Magazine (~2004) documents his move from three days/week (~10 working sets per body part across 2–3 exercises) to a five-day split: Mon chest & abs, Tue back & calves, Wed/Thu off, Fri quads, Sat shoulders & arms, Sun hamstrings. On the five-day plan: 3–4 sets on most lifts (5 on squats), mostly 6–10 reps, high-rep extensions/curls for detail, supersets often.",
  principles: [
    'Train smart for longevity — heal injuries fully; ego does not own the session.',
    'Compounds first (squats, bench, rows, chins) — the bread and butter.',
    'On the five-day Iron Man split: typically 3–4 working sets per exercise (5 on squats). The “~10 sets per body part” figure was for his earlier three-day routine.',
    'Supersets often; forced reps only occasionally.',
    'Separate quads and hamstrings when legs take too much out of one session.',
    'Conditioning is identity — The Blade never missed peak sharpness.',
  ],
  guidelines: {
    workingSetProtocol:
      'Iron Man five-day era: 3–4 working sets × 6–10 on most lifts (5 on squats). Leg extensions/curls can go very high-rep (up to ~30) for detail. Supersets common. (~10 working sets/body part applied to his prior 3-day schedule, not this five-day template.)',
  },
});

// ——— Gaspari: drop fake Annihilation brand ———
patch('gaspari-annihilation', {
  name: 'Old-School Intensity',
  tags: ['Pre-exhaust', 'Failure training', 'Gaspari Nutrition', 'Old school'],
  summary:
    "Rich Gaspari’s coaching emphasis (Gaspari Nutrition): pre-exhaust isolation before compounds, train hard to failure on intense weeks, then moderate pump work the next week for recovery. “Total annihilation” is his intensity mindset — not an official program or DVD name. Contest-era 1980s Gaspari often used higher frequency (including double-split); the days here reflect Nutrition-era 4–5 day / once-weekly body-part coaching, plus his published pre-exhaust shoulder template.",
  principles: [
    'Pre-exhaust isolation before compounds so the target muscle fails first.',
    'Intense failure weeks alternate with moderate pump weeks for the same muscles.',
    'Prefer enough recovery days — grinding six days can stall growth (Nutrition-era advice).',
    'Warm up thoroughly and stretch after; longevity depends on joint care.',
    'Total focus in the gym — war mindset on working sets.',
    'Do not confuse the “annihilation” catchphrase with a branded split system.',
  ],
  guidelines: {
    trainingDaysPerWeek: '4–5 (Nutrition-era coaching); 1980s contest prep was often higher frequency',
    frequencyPerMuscle: 'Once per week on this Nutrition-era template; intense week then moderate week',
  },
});

for (const id of ['gaspari-chest-triceps', 'gaspari-back-biceps', 'gaspari-shoulders-traps', 'gaspari-legs']) {
  const r = routine(id);
  r.name = r.name.replace('Annihilation', 'Old-School Intensity');
  r.labels = ['Gaspari Nutrition era'];
}

write('src/data/styles.json', styles);
write('src/data/routines.json', routines);
console.log('Audit follow-up fixes applied.');
