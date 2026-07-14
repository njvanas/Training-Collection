import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) =>
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const WU = (intensity) => ({ label: 'W1', kind: 'warmup', intensity });
const WU2 = (intensity) => ({ label: 'W2', kind: 'warmup', intensity });
const WS = (n) => ({
  label: String(n),
  kind: 'working',
  intensity: 'Heavy & controlled — straight set, stop shy of failure',
});
const FST7 = {
  label: 'F7',
  kind: 'all-out',
  intensity: 'FST-7 finisher — 7×10-12 with 30-45s rest; stretch/flex between sets',
};

function volScheme(workingSets = 3, withWarmups = true) {
  const scheme = withWarmups
    ? [WU('~30% of working weight'), WU2('~60% of working weight')]
    : [];
  for (let i = 1; i <= workingSets; i++) scheme.push(WS(i));
  return scheme;
}

function haneyScheme(workingSets = 4) {
  return [
    { label: 'W1', kind: 'warmup', intensity: 'Light — ~15 reps, never near failure' },
    { label: 'W2', kind: 'warmup', intensity: 'Moderate — ~10 reps' },
    { label: 'W3', kind: 'warmup', intensity: 'Heavier — ~8 reps' },
    ...Array.from({ length: workingSets }, (_, i) => ({
      label: String(i + 1),
      kind: i === workingSets - 1 ? 'working' : 'working',
      intensity:
        i === workingSets - 1
          ? 'Top set — stimulate, do not annihilate; 6-8 reps'
          : 'Pyramid up — 8-10 reps',
    })),
  ];
}

function slot(exerciseId, sets, repRange, extra = {}) {
  return {
    exerciseId,
    sets,
    repRange,
    setScheme: extra.setScheme ?? volScheme(Math.max(sets - 2, 1)),
    ...extra,
  };
}

const newExercises = [
  {
    id: 'hammer-curl',
    name: 'Hammer Curl (Dumbbell)',
    hevyName: 'Hammer Curl (Dumbbell)',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    category: 'isolation',
    cues: [
      'Neutral grip throughout.',
      'Curl without swinging the torso.',
      'Squeeze the brachialis at the top.',
    ],
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    hevyName: 'Pullover (Dumbbell)',
    primaryMuscle: 'lats',
    secondaryMuscles: ['chest'],
    equipment: 'dumbbell',
    category: 'isolation',
    cues: [
      'Lie across a flat bench, hips low.',
      'Deep stretch overhead, pull the weight over the chest.',
      'Keep elbows slightly bent and fixed.',
    ],
  },
];

const styles = read('src/data/styles.json');
const exercises = read('src/data/exercises.json');
const routines = read('src/data/routines.json');

for (const ex of newExercises) {
  if (!exercises.find((e) => e.id === ex.id)) exercises.push(ex);
}

const newStyles = [
  {
    id: 'heath-fst7',
    name: 'FST-7',
    creator: 'Phil Heath',
    displayOrder: 5,
    tags: ['High volume', 'FST-7', '5-day split', 'Mind-muscle'],
    summary:
      'Phil Heath\'s Olympia-era training with coach Hany Rambod: a five-day body-part split built on the pump, strict form, and FST-7 finishers — seven sets of 10-12 reps on an isolation movement with only 30-45 seconds rest to stretch the fascia. Three to five exercises per session, abs trained first when included, and every muscle hit once per week with brutal focus.',
    principles: [
      'Chase the pump and roundness — the muscle should feel full and stretched.',
      'Finish each body part with FST-7: 7 sets, 10-12 reps, 30-45s rest; flex and stretch between sets.',
      'Control every rep; use weight as a tool for the target muscle, not ego lifting.',
      'Train five to six days per week on a traditional body-part split.',
      'Time under tension matters — static holds and ladder sets when plateaus hit.',
      'Log sessions and progress load or reps over time.',
    ],
    intensityTechniques: ['partials', 'iso-hold', 'drop-set', 'static-stretch'],
    guidelines: {
      trainingDaysPerWeek: '5-6 (one muscle group per day)',
      frequencyPerMuscle: 'Once per week.',
      warmupProtocol: '1-2 progressive warm-up sets per exercise; abs first when trained.',
      workingSetProtocol:
        '3-5 exercises per body part with 3-4 straight working sets, then one FST-7 isolation finisher (7×10-12, 30-45s rest). Sessions run 70-90 minutes.',
      repRanges: [
        { target: 'Compounds', range: '8-12 reps' },
        { target: 'FST-7 finishers', range: '10-12 reps × 7 sets' },
        { target: 'Calves & abs', range: '12-20 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Legs' },
      { day: 'Day 2', focus: 'Chest & Triceps' },
      { day: 'Day 3', focus: 'Rest' },
      { day: 'Day 4', focus: 'Back & Biceps' },
      { day: 'Day 5', focus: 'Shoulders & Traps' },
      { day: 'Day 6', focus: 'Arms (optional)' },
      { day: 'Day 7', focus: 'Rest' },
    ],
    sources: [
      {
        title: '8 Tips to Train Like Phil Heath - Muscle & Fitness',
        url: 'https://www.muscleandfitness.com/athletes-celebrities/pro-tips/8-tips-train-phil-heath/',
      },
      {
        title: 'Training with THE GIFT - Mr Olympia Phil Heath - Muscle & Fitness',
        url: 'https://www.muscleandfitness.com/flexonline/flex-news/training-gift-mr-olympia-phil-heath/',
      },
      {
        title: 'Phil Heath Workout Routine - SET FOR SET',
        url: 'https://www.setforset.com/blogs/news/phil-heath-workout-routine',
      },
    ],
  },
  {
    id: 'arnold-golden-era',
    name: 'Golden Era Volume',
    creator: 'Arnold Schwarzenegger',
    displayOrder: 6,
    tags: ['High volume', '6-day split', 'Supersets', 'Classic'],
    summary:
      'Arnold Schwarzenegger\'s competitive-era approach: enormous volume (15-20 sets for large parts), twice-weekly body-part hits on a six-day split, and frequent supersets and giant sets. Before the split days he famously ran the simple Golden Six full-body routine three days per week — six basic lifts, 3-4 sets of 10, progressive overload when reps exceed target.',
    principles: [
      'Shock the muscle — change exercises, angles, and techniques so the body never adapts.',
      'Use supersets and giant sets to extend intensity when straight sets stall.',
      'Pyramid up in weight across warm-up and working sets.',
      'Train six days per week in peak years; hit each muscle twice weekly.',
      'The pump is the goal — chase blood volume and a full stretch on every rep.',
      'Start beginners on full-body fundamentals (Golden Six) before high-volume splits.',
    ],
    intensityTechniques: ['drop-set', 'partials', 'forced-reps'],
    guidelines: {
      trainingDaysPerWeek: '6 (Golden Six: 3 full-body days, non-consecutive)',
      frequencyPerMuscle: 'Twice per week on the competitive split; 3×/week full-body on Golden Six.',
      warmupProtocol: 'Progressive warm-ups on the first compound; light sets to groove form.',
      workingSetProtocol:
        'Golden Six: 3-4 sets × 10 reps (AMRAP on chin-ups and sit-ups). Competitive split: 10-20 sets per body part with supersets on arms and chest/back pairings.',
      repRanges: [
        { target: 'Golden Six', range: '10 reps (AMRAP on chin-ups & sit-ups)' },
        { target: 'Competitive split', range: '8-12 reps' },
        { target: 'Calves & abs', range: '15-25 reps' },
      ],
    },
    splitOverview: [
      { day: 'Mon & Thu', focus: 'Chest & Back' },
      { day: 'Tue & Fri', focus: 'Legs' },
      { day: 'Wed & Sat', focus: 'Shoulders & Arms' },
      { day: 'Sun', focus: 'Rest' },
      { day: 'Golden Six alt.', focus: 'Full body — Mon / Wed / Fri' },
    ],
    sources: [
      {
        title: 'Arnold\'s Golden Six Routine - Fitness Volt',
        url: 'https://fitnessvolt.com/arnolds-golden-six-routine/',
      },
      {
        title: 'Tip: Train With Arnold\'s Golden Six - T Nation',
        url: 'https://archive.t-nation.com/training/tip-train-with-arnolds-golden-six/',
      },
      {
        title: 'Golden Six - Boostcamp (Arnold Schwarzenegger)',
        url: 'https://www.boostcamp.app/coaches/arnold-schwarzenegger/golden-six',
      },
    ],
  },
  {
    id: 'haney-stimulate',
    name: 'Stimulate, Don\'t Annihilate',
    creator: 'Lee Haney',
    displayOrder: 7,
    tags: ['Moderate volume', '3-on-1-off', 'Push-pull', 'Longevity'],
    summary:
      'Lee Haney\'s eight-Olympia philosophy: stimulate the muscle without annihilating it. A three-days-on, one-day-off split gives each body part three full recovery days. Pyramid the weight, pair push and pull movements to spare the joints, pre-exhaust when needed, and train calves and abs every session. Four working sets max on heavy compounds — never grind to failure every week.',
    principles: [
      'Stimulate, don\'t annihilate — hard work without reckless failure every set.',
      'Three days on, one day off; each muscle gets three days to recover.',
      'Pair push with pull (e.g. chest with biceps) to reduce joint stress.',
      'Pyramid weight set to set — never jump straight to your heaviest load.',
      'Pre-exhaust isolation before compounds when you need more intensity safely.',
      'Calves and abs every training day; legs in the middle of the rotation.',
    ],
    intensityTechniques: ['forced-reps'],
    guidelines: {
      trainingDaysPerWeek: '3 on, 1 off (repeating cycle)',
      frequencyPerMuscle: 'Once every four days in the cycle (~ twice per 8 days).',
      warmupProtocol: 'Pyramid warm-ups — light 15 reps, then 10, then 8 before top work.',
      workingSetProtocol:
        '3-4 exercises per body part, pyramiding to 4 working sets on compounds (6-10 reps top set). Avoid training to failure every session.',
      repRanges: [
        { target: 'Warm-up pyramid', range: '15 → 10 → 8' },
        { target: 'Working sets', range: '6-10 reps' },
        { target: 'Calves & abs', range: '15-25 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Chest & Arms' },
      { day: 'Day 2', focus: 'Legs' },
      { day: 'Day 3', focus: 'Back & Shoulders' },
      { day: 'Day 4', focus: 'Rest' },
    ],
    sources: [
      {
        title: 'Lee Haney Workout: His Top 10 Training Tips - The Barbell',
        url: 'https://thebarbell.com/lee-haney-workout/',
      },
      {
        title: 'Lee Haney Training Split - Fitness Volt',
        url: 'https://fitnessvolt.com/lee-haney-training-split-protein-sources/',
      },
      {
        title: 'Workout Systems: Lee Haney\'s 4-Day Training Split - Poliquin Group',
        url: 'https://poliquingroup.com/ArticlesMultimedia/Articles/Article/2690/Workout_Systems_Lee_Haneys_4-Day_Training_Split.aspx',
      },
    ],
  },
  {
    id: 'zane-aesthetics',
    name: 'Growth Program',
    creator: 'Frank Zane',
    displayOrder: 8,
    tags: ['Aesthetics', '3-day split', 'Mind-muscle', 'Stretching'],
    summary:
      'Frank Zane\'s three-way split prioritized symmetry over sheer mass: pull (back, biceps, forearms), legs, push (chest, shoulders, triceps), then rest — three training days in a row followed by one off. Moderate weight, perfect form, stretches held 10-15 seconds between sets, and daily abs plus short cardio. The mind-muscle connection and constant tension beat moving heavy weight sloppily.',
    principles: [
      'Aesthetics and proportion over maximum size — every rep should improve the silhouette.',
      'Three-way split: pull, legs, push, rest — more recovery per section than upper/lower.',
      'Stretch the target muscle 10-15 seconds between sets to enhance pump and detail.',
      'Control the negative; avoid locking out to keep tension on the muscle.',
      'Pyramid weight up while keeping reps in the 8-12 range for most work.',
      'Daily ab work and ~12 minutes of cardio after training.',
    ],
    intensityTechniques: ['static-stretch', 'iso-hold', 'partials'],
    guidelines: {
      trainingDaysPerWeek: '3 on, 1 off (4-day micro-cycle)',
      frequencyPerMuscle: 'Once every four days.',
      warmupProtocol: 'One light warm-up set per exercise; never rush into heavy weight.',
      workingSetProtocol:
        '3-4 sets × 8-12 reps with moderate loads and strict form; inter-set stretching on key movements.',
      repRanges: [
        { target: 'Most exercises', range: '8-12 reps' },
        { target: 'Calves', range: '12-15 reps' },
        { target: 'Abs', range: '15-25 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Back, Biceps & Forearms' },
      { day: 'Day 2', focus: 'Legs & Calves' },
      { day: 'Day 3', focus: 'Chest, Shoulders & Triceps' },
      { day: 'Day 4', focus: 'Rest' },
    ],
    sources: [
      {
        title: 'The Growth Program, Then and Now - Frank Zane',
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
  },
  {
    id: 'cutler-volume',
    name: 'High-Volume Split',
    creator: 'Jay Cutler',
    displayOrder: 9,
    tags: ['High volume', '5-day split', 'Short rest', 'Mind-muscle'],
    summary:
      'Jay Cutler\'s Olympia-era training: a three-on, one-off, two-on, one-off five-day split with legendary session volume — often 20-30 sets per body part built up over years. Short 30-60 second rest periods, relentless mind-muscle connection, and working for the pump over pure strength. Back and leg days are brutal enough to always follow with a rest day.',
    principles: [
      'Volume drives growth — add sets gradually over years, not all at once.',
      'Rest 30-60 seconds between most sets to keep metabolic stress high.',
      'Control the rep; feel the muscle through the full range — no ego lifting.',
      'Train each body part once per week on a dedicated day; calves twice.',
      'Place rest days after back and legs — the hardest sessions in the rotation.',
      'Consistency beats novelty — same split for decades with progressive volume.',
    ],
    intensityTechniques: ['drop-set', 'forced-reps', 'partials'],
    guidelines: {
      trainingDaysPerWeek: '5 (3 on, 1 off, 2 on, 1 off)',
      frequencyPerMuscle: 'Once per week; calves twice.',
      warmupProtocol: '2 warm-up sets on the first compound; quick warm-ups thereafter.',
      workingSetProtocol:
        '15-25+ sets per large body part for advanced lifters; 3-4 working sets per exercise with short rest. Scale volume down to 12-16 sets when adapting the split.',
      repRanges: [
        { target: 'Compounds', range: '6-12 reps' },
        { target: 'Isolation', range: '10-15 reps' },
        { target: 'Calves', range: '12-20 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Chest & Calves' },
      { day: 'Day 2', focus: 'Triceps & Biceps' },
      { day: 'Day 3', focus: 'Back' },
      { day: 'Day 4', focus: 'Rest' },
      { day: 'Day 5', focus: 'Shoulders & Traps' },
      { day: 'Day 6', focus: 'Quads, Hamstrings & Calves' },
      { day: 'Day 7', focus: 'Rest' },
    ],
    sources: [
      {
        title: 'Jay Cutler Workout: The Mr. Olympia Routine - Hunt Fitness',
        url: 'https://kylehuntfitness.com/jay-cutler-workout-the-mr-olympia-routine-that-built-a-legend/',
      },
      {
        title: 'How Strong Was Jay Cutler? - BarBend',
        url: 'https://barbend.com/news/how-strong-was-jay-cutler/',
      },
      {
        title: 'Jay Cutler Bodybuilder Workout Routine - SET FOR SET',
        url: 'https://www.setforset.com/blogs/news/jay-cutler-bodybuilder',
      },
    ],
  },
  {
    id: 'bannout-lion',
    name: 'Lion of Lebanon',
    creator: 'Samir Bannout',
    displayOrder: 10,
    tags: ['Old school', '3-on-1-off', 'High intensity', 'Dense physique'],
    summary:
      'Samir Bannout\'s 1983 Mr. Olympia prep: a three-days-on, one-day-off cycle with old-school heavy compounds, short 35-second rest periods, and training by feel rather than rigid rep counts. Olympic lifting roots built the dense back ("Christmas tree") that defined his silhouette. Shoulders and arms, legs and abs, then chest and back — repeated with maximum intensity when fresh.',
    principles: [
      'Train hard when you train — short rests (~35 seconds) and heavy compounds.',
      'Three days on, one off; fully recovered before repeating the cycle.',
      'Listen to the body — adjust exercises and reps by feel, not only by numbers.',
      'Build the back with rows, pulldowns, and Olympic-lifting roots for density.',
      'Morning and afternoon sessions in peak prep to hit weak points twice.',
      'Art and aesthetics matter as much as the weight on the bar.',
    ],
    intensityTechniques: ['forced-reps', 'drop-set', 'partials'],
    guidelines: {
      trainingDaysPerWeek: '3 on, 1 off (repeating)',
      frequencyPerMuscle: 'Once every four days in the cycle.',
      warmupProtocol: 'One high-rep warm-up on the first compound (20-25 reps), then pyramid up.',
      workingSetProtocol:
        '4-6 sets per exercise, 6-15 reps by feel; 35-second rest between sets in competition prep.',
      repRanges: [
        { target: 'Heavy compounds', range: '4-10 reps' },
        { target: 'Isolation', range: '8-15 reps' },
        { target: 'Calves & abs', range: '15-25+ reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Shoulders, Biceps & Triceps' },
      { day: 'Day 2', focus: 'Legs, Calves & Abs' },
      { day: 'Day 3', focus: 'Chest & Back' },
      { day: 'Day 4', focus: 'Rest' },
    ],
    sources: [
      {
        title: 'Samir Bannout\'s Workout and Diet - Iron and Grit Fitness',
        url: 'https://ironandgrit.com/2021/05/02/samir-bannout-workout/',
      },
      {
        title: 'Samir Bannout - The Lion of Lebanon - Fitness Volt',
        url: 'https://fitnessvolt.com/1725/samir-bannout-the-lion-of-lebanon/',
      },
      {
        title: 'Old School Bodybuilder: Samir Bannout Workout - Nutribody',
        url: 'https://nutribody.com/old-school-bodybuilder-samir-bannout-workout/',
      },
    ],
  },
  {
    id: 'jackson-blade',
    name: 'The Blade',
    creator: 'Dexter Jackson',
    displayOrder: 11,
    tags: ['Consistency', '5-day split', 'Supersets', 'Conditioning'],
    summary:
      'Dexter Jackson\'s decades-long approach — nicknamed The Blade for never coming in off-condition: a five-day split emphasizing compounds first, moderate volume (3-4 sets per exercise), and relentless consistency. Evolved from three days weekly to five as career demands grew; supersets common, forced reps occasional, and rep tempo typically one second up, one second down.',
    principles: [
      'Consistency beats extremes — show up prepared, year after year.',
      'Compounds first for strength and shape; machines and isolation to refine.',
      'Moderate volume — about 10 working sets per body part across 2-3 exercises.',
      'Use supersets to save time and increase density; forced reps sparingly.',
      'Train abs in prep; high-rep leg extensions and curls for quad/ham detail.',
      'Conditioning is non-negotiable — The Blade never missed peak sharpness.',
    ],
    intensityTechniques: ['forced-reps'],
    guidelines: {
      trainingDaysPerWeek: '5',
      frequencyPerMuscle: 'Once per week.',
      warmupProtocol: '2-3 warm-up sets on the first compound of each session.',
      workingSetProtocol:
        '3-4 sets × 8-15 reps per exercise; supersets on arms and some upper-body pairings. Sessions 60-90 minutes.',
      repRanges: [
        { target: 'Compounds', range: '6-12 reps' },
        { target: 'Isolation & detail work', range: '10-20 reps' },
        { target: 'Calves', range: '12-15 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Chest & Biceps' },
      { day: 'Day 2', focus: 'Quads & Calves' },
      { day: 'Day 3', focus: 'Rest' },
      { day: 'Day 4', focus: 'Shoulders, Triceps & Calves' },
      { day: 'Day 5', focus: 'Back & Hamstrings' },
      { day: 'Day 6', focus: 'Rest' },
      { day: 'Day 7', focus: 'Rest / light cardio' },
    ],
    sources: [
      {
        title: 'The Blade - Iron Man Magazine (Dexter Jackson interview)',
        url: 'https://www.ironmanmagazine.com/the-blade/',
      },
      {
        title: 'Dexter Jackson Diet and Workout Program - Fitness Volt',
        url: 'https://fitnessvolt.com/dexter-jackson-diet-training-program/',
      },
      {
        title: 'Dynamite Full Body Workout With Dexter Jackson - Generation Iron',
        url: 'https://generationiron.com/dexter-jackson-workout/',
      },
    ],
  },
  {
    id: 'gaspari-annihilation',
    name: 'Annihilation Training',
    creator: 'Rich Gaspari',
    displayOrder: 12,
    tags: ['Pre-exhaust', 'Failure training', '4-5 day split', 'Old school'],
    summary:
      'Rich Gaspari\'s old-school intensity: pre-exhaust supersets, training to complete failure with drop sets and forced reps, then moderating the following week so muscles recover and grow. Four to five training days per week, each muscle once weekly, warm-up and cool-down rituals mandatory, and total focus in the gym — no phone, no distractions, war mindset on every set.',
    principles: [
      'Pre-exhaust isolation before compounds so the target muscle fails first.',
      'Train to complete failure on intense weeks; follow with a moderate pump week.',
      'Four training days minimum for recovery — six-day grinding stalls growth.',
      'Warm up thoroughly and stretch after; longevity depends on joint care.',
      'No distractions — total focus and intensity every working set.',
      'Alternate annihilation weeks with moderate pump sessions for the same muscle.',
    ],
    intensityTechniques: ['forced-reps', 'drop-set', 'negatives', 'partials'],
    guidelines: {
      trainingDaysPerWeek: '4-5 (3 on, 1 off in off-season)',
      frequencyPerMuscle: 'Once per week; intense week then moderate week.',
      warmupProtocol: 'Extended warm-ups and mobility before heavy work; cool-down stretches after.',
      workingSetProtocol:
        'Pre-exhaust: isolation to failure, then compound. Intense weeks use drop sets, forced reps, and supersets; next week moderate sets for blood flow and recovery.',
      repRanges: [
        { target: 'Pre-exhaust isolation', range: '12-20 reps' },
        { target: 'Compound work', range: '6-12 reps' },
        { target: 'Moderate pump week', range: '12-15 reps' },
      ],
    },
    splitOverview: [
      { day: 'Day 1', focus: 'Chest & Triceps' },
      { day: 'Day 2', focus: 'Back & Biceps' },
      { day: 'Day 3', focus: 'Rest' },
      { day: 'Day 4', focus: 'Shoulders & Traps' },
      { day: 'Day 5', focus: 'Legs' },
      { day: 'Day 6', focus: 'Rest' },
      { day: 'Day 7', focus: 'Rest' },
    ],
    sources: [
      {
        title: 'Pre-Exhaustion Shoulder Training - Gaspari Nutrition',
        url: 'https://gasparinutrition.com/blogs/old-school-training-tips/pre-exhaustion-in-a-shoulder-workout',
      },
      {
        title: 'Rich Gaspari on Training to Complete Failure - Fitness Volt',
        url: 'https://fitnessvolt.com/rich-gaspari-best-method-building-muscle/',
      },
      {
        title: 'Rich Gaspari Training Intensity for Hypertrophy - Fitness Volt',
        url: 'https://fitnessvolt.com/rich-gaspari-abs-training-intensity-hypertrophy/',
      },
    ],
  },
];

for (const style of newStyles) {
  if (!styles.find((s) => s.id === style.id)) styles.push(style);
}

const legendWorkouts = [
  // Phil Heath FST-7
  {
    id: 'heath-legs',
    name: 'FST-7 - Legs',
    day: 'Day 1',
    styleId: 'heath-fst7',
    sortOrder: 1,
    labels: ['FST-7 reference'],
    focus: ['quads', 'hamstrings', 'calves'],
    description: 'Phil Heath leg day with FST-7 finisher — compounds for 3-4 sets then 7×10-12 lying leg curls with 30-45s rest.',
    source: { name: 'Phil Heath Workout - SET FOR SET', url: 'https://www.setforset.com/blogs/news/phil-heath-workout-routine' },
    exercises: [
      slot('leg-extension', 5, '10-12'),
      slot('leg-press', 5, '10-12'),
      slot('barbell-squat', 5, '8-12'),
      slot('lying-leg-curl', 9, '10-12', {
        notes: 'FST-7 finisher — 7 sets after warm-ups.',
        setScheme: [...volScheme(2), FST7, FST7, FST7, FST7, FST7, FST7, FST7],
      }),
      slot('standing-calf-raise', 5, '10-12'),
    ],
  },
  {
    id: 'heath-chest-triceps',
    name: 'FST-7 - Chest & Triceps',
    day: 'Day 2',
    styleId: 'heath-fst7',
    sortOrder: 2,
    labels: ['FST-7 reference'],
    focus: ['chest', 'triceps'],
    description: 'Incline-heavy chest session ending with cable crossover FST-7.',
    source: { name: 'Training with THE GIFT - Muscle & Fitness', url: 'https://www.muscleandfitness.com/flexonline/flex-news/training-gift-mr-olympia-phil-heath/' },
    exercises: [
      slot('incline-barbell-press', 5, '8-12'),
      slot('incline-bench-press-smith', 5, '8-12'),
      slot('incline-dumbbell-flye', 5, '10-12'),
      slot('cable-crossover', 9, '10-12', {
        notes: 'FST-7 finisher.',
        setScheme: [...volScheme(2), FST7, FST7, FST7, FST7, FST7, FST7, FST7],
      }),
      slot('triceps-pushdown', 5, '8-12'),
      slot('lying-triceps-extension', 5, '8-12'),
    ],
  },
  {
    id: 'heath-back-biceps',
    name: 'FST-7 - Back & Biceps',
    day: 'Day 4',
    styleId: 'heath-fst7',
    sortOrder: 3,
    labels: ['FST-7 reference'],
    focus: ['back', 'lats', 'biceps'],
    description: 'Width and thickness work, finishing biceps with FST-7 cable curls.',
    source: { name: '8 Tips to Train Like Phil Heath - Muscle & Fitness', url: 'https://www.muscleandfitness.com/athletes-celebrities/pro-tips/8-tips-train-phil-heath/' },
    exercises: [
      slot('lat-pulldown', 5, '8-12'),
      slot('barbell-row', 5, '8-12'),
      slot('seated-cable-row', 5, '8-12'),
      slot('cable-biceps-curl', 9, '10-12', {
        notes: 'FST-7 finisher for biceps.',
        setScheme: [...volScheme(2), FST7, FST7, FST7, FST7, FST7, FST7, FST7],
      }),
      slot('incline-dumbbell-curl', 5, '8-12'),
    ],
  },
  {
    id: 'heath-shoulders',
    name: 'FST-7 - Shoulders & Traps',
    day: 'Day 5',
    styleId: 'heath-fst7',
    sortOrder: 4,
    labels: ['FST-7 reference'],
    focus: ['shoulders', 'traps', 'rear-delts'],
    description: 'Smith presses and laterals; FST-7 on rear-delt or lateral machine.',
    source: { name: 'Phil Heath Workout - SET FOR SET', url: 'https://www.setforset.com/blogs/news/phil-heath-workout-routine' },
    exercises: [
      slot('smith-machine-shoulder-press', 5, '8-12'),
      slot('dumbbell-lateral-raise', 5, '10-12'),
      slot('dumbbell-shrug', 5, '10-12'),
      slot('rear-delt-fly-machine', 9, '10-12', {
        notes: 'FST-7 finisher.',
        setScheme: [...volScheme(2), FST7, FST7, FST7, FST7, FST7, FST7, FST7],
      }),
      slot('face-pull', 4, '12-15'),
    ],
  },
  // Arnold Golden Six (single full-body workout)
  {
    id: 'arnold-golden-six',
    name: 'Golden Six - Full Body',
    day: 'Workout A',
    styleId: 'arnold-golden-era',
    sortOrder: 1,
    labels: ['Golden Six'],
    focus: ['chest', 'back', 'shoulders', 'biceps', 'quads', 'abs'],
    description: 'Arnold\'s early full-body routine — six lifts, 3× per week on non-consecutive days. Add weight when you exceed rep targets.',
    source: { name: 'Arnold\'s Golden Six - Fitness Volt', url: 'https://fitnessvolt.com/arnolds-golden-six-routine/' },
    exercises: [
      slot('barbell-squat', 4, '10', {
        setScheme: [
          WU('Empty bar or 50%'),
          { label: '1', kind: 'working', intensity: 'Working weight × 10' },
          { label: '2', kind: 'working', intensity: 'Working weight × 10' },
          { label: '3', kind: 'working', intensity: 'Working weight × 10 — add weight if 4th set would exceed 13 reps' },
          { label: '4', kind: 'working', intensity: 'Top set × 10' },
        ],
      }),
      slot('barbell-bench-press', 3, '10'),
      slot('pull-up', 3, 'AMRAP', {
        notes: 'Wide grip; add weight when bodyweight is easy.',
        setScheme: [
          { label: '1', kind: 'working', intensity: 'To failure or near failure' },
          { label: '2', kind: 'working', intensity: 'To failure or near failure' },
          { label: '3', kind: 'working', intensity: 'To failure or near failure' },
        ],
      }),
      slot('military-press', 4, '10', { notes: 'Behind-the-neck or standard overhead press.' }),
      slot('barbell-curl', 3, '10'),
      slot('decline-crunch', 3, 'AMRAP', {
        notes: 'Bent-knee sit-ups in the original program.',
        setScheme: [
          { label: '1', kind: 'working', intensity: 'To failure' },
          { label: '2', kind: 'working', intensity: 'To failure' },
          { label: '3', kind: 'working', intensity: 'To failure' },
        ],
      }),
    ],
  },
  {
    id: 'arnold-chest-back',
    name: 'Competitive Split - Chest & Back',
    day: 'Mon & Thu',
    styleId: 'arnold-golden-era',
    sortOrder: 2,
    labels: ['Competitive split'],
    focus: ['chest', 'back', 'lats'],
    description: 'Golden-era volume: supersets and high set counts for the two largest upper-body groups.',
    source: { name: 'Golden Six - T Nation', url: 'https://archive.t-nation.com/training/tip-train-with-arnolds-golden-six/' },
    exercises: [
      slot('barbell-bench-press', 5, '8-12'),
      slot('incline-barbell-press', 5, '8-12'),
      slot('cable-crossover', 4, '10-12'),
      slot('pull-up', 5, '8-12'),
      slot('barbell-row', 5, '8-12'),
      slot('seated-cable-row', 4, '8-12'),
    ],
  },
  {
    id: 'arnold-legs',
    name: 'Competitive Split - Legs',
    day: 'Tue & Fri',
    styleId: 'arnold-golden-era',
    sortOrder: 3,
    labels: ['Competitive split'],
    focus: ['quads', 'hamstrings', 'calves'],
    description: 'Heavy squats and leg work twice weekly — high volume golden-era leg day.',
    source: { name: 'Golden Six - Boostcamp', url: 'https://www.boostcamp.app/coaches/arnold-schwarzenegger/golden-six' },
    exercises: [
      slot('barbell-squat', 5, '8-12'),
      slot('leg-press', 5, '10-15'),
      slot('leg-extension', 4, '10-15'),
      slot('lying-leg-curl', 4, '10-12'),
      slot('standing-calf-raise', 5, '15-20'),
    ],
  },
  {
    id: 'arnold-shoulders-arms',
    name: 'Competitive Split - Shoulders & Arms',
    day: 'Wed & Sat',
    styleId: 'arnold-golden-era',
    sortOrder: 4,
    labels: ['Competitive split'],
    focus: ['shoulders', 'biceps', 'triceps'],
    description: 'Dedicated arm and delt volume with supersets — the classic Arnold pairing day.',
    source: { name: 'Arnold\'s Golden Six - Fitness Volt', url: 'https://fitnessvolt.com/arnolds-golden-six-routine/' },
    exercises: [
      slot('military-press', 5, '8-12'),
      slot('dumbbell-lateral-raise', 4, '10-12'),
      slot('barbell-curl', 4, '8-12', { supersetGroup: 'A' }),
      slot('lying-triceps-extension', 4, '8-12', { supersetGroup: 'A' }),
      slot('alternating-dumbbell-curl', 4, '8-12', { supersetGroup: 'B' }),
      slot('triceps-pushdown', 4, '10-12', { supersetGroup: 'B' }),
    ],
  },
  // Lee Haney
  {
    id: 'haney-chest-arms',
    name: 'Classic - Chest & Arms',
    day: 'Day 1',
    styleId: 'haney-stimulate',
    sortOrder: 1,
    labels: ['Classic reference'],
    focus: ['chest', 'biceps', 'triceps'],
    description: 'Haney day one — chest with arms; pyramid up, stimulate without annihilating.',
    source: { name: 'Lee Haney Workout - The Barbell', url: 'https://thebarbell.com/lee-haney-workout/' },
    exercises: [
      slot('barbell-bench-press', 6, '6-10', { setScheme: haneyScheme(4) }),
      slot('incline-dumbbell-flye', 5, '8-12', { setScheme: haneyScheme(3) }),
      slot('barbell-curl', 5, '8-10', { setScheme: haneyScheme(3) }),
      slot('triceps-pushdown', 5, '8-12', { setScheme: haneyScheme(3) }),
      slot('decline-crunch', 4, '15-25'),
    ],
  },
  {
    id: 'haney-legs',
    name: 'Classic - Legs',
    day: 'Day 2',
    styleId: 'haney-stimulate',
    sortOrder: 2,
    labels: ['Classic reference'],
    focus: ['quads', 'hamstrings', 'calves', 'abs'],
    description: 'Legs in the middle of the rotation — pre-exhaust extensions before squats when needed.',
    source: { name: 'Lee Haney Training Split - Fitness Volt', url: 'https://fitnessvolt.com/lee-haney-training-split-protein-sources/' },
    exercises: [
      slot('leg-extension', 5, '10-15', { notes: 'Optional pre-exhaust before squats.' }),
      slot('barbell-squat', 6, '6-10', { setScheme: haneyScheme(4) }),
      slot('leg-press', 5, '10-12', { setScheme: haneyScheme(3) }),
      slot('lying-leg-curl', 5, '8-12', { setScheme: haneyScheme(3) }),
      slot('standing-calf-raise', 5, '12-15'),
      slot('decline-crunch', 4, '15-25'),
    ],
  },
  {
    id: 'haney-back-shoulders',
    name: 'Classic - Back & Shoulders',
    day: 'Day 3',
    styleId: 'haney-stimulate',
    sortOrder: 3,
    labels: ['Classic reference'],
    focus: ['back', 'lats', 'shoulders', 'traps'],
    description: 'Pulling and pressing paired — push-pull logic to spare the joints.',
    source: { name: 'Lee Haney\'s 4-Day Training Split - Poliquin Group', url: 'https://poliquingroup.com/ArticlesMultimedia/Articles/Article/2690/Workout_Systems_Lee_Haneys_4-Day_Training_Split.aspx' },
    exercises: [
      slot('lat-pulldown', 5, '8-12', { setScheme: haneyScheme(3) }),
      slot('barbell-row', 6, '6-10', { setScheme: haneyScheme(4) }),
      slot('machine-shoulder-press', 5, '8-10', { setScheme: haneyScheme(3) }),
      slot('dumbbell-lateral-raise', 4, '10-12'),
      slot('dumbbell-shrug', 4, '10-12'),
      slot('decline-crunch', 4, '15-25'),
    ],
  },
  // Frank Zane
  {
    id: 'zane-pull',
    name: 'Growth Program - Pull',
    day: 'Day 1',
    styleId: 'zane-aesthetics',
    sortOrder: 1,
    labels: ['Growth Program'],
    focus: ['back', 'lats', 'biceps', 'forearms'],
    description: 'Pull day — stretch between sets, moderate loads, mind-muscle connection.',
    source: { name: 'The Growth Program - Frank Zane', url: 'https://frankzane.com/the-growth-program-then-and-now-frank-zane/' },
    exercises: [
      slot('lat-pulldown', 4, '8-12'),
      slot('barbell-row', 4, '8-12'),
      slot('seated-cable-row', 4, '8-12'),
      slot('barbell-curl', 4, '8-12'),
      slot('alternating-dumbbell-curl', 3, '10-12'),
      slot('decline-crunch', 3, '15-20'),
    ],
  },
  {
    id: 'zane-legs',
    name: 'Growth Program - Legs',
    day: 'Day 2',
    styleId: 'zane-aesthetics',
    sortOrder: 2,
    labels: ['Growth Program'],
    focus: ['quads', 'hamstrings', 'calves'],
    description: 'Extensions, curls, squats, leg press — Zane\'s leg template with daily abs.',
    source: { name: 'Frank Zane Training Split - Fitness Volt', url: 'https://fitnessvolt.com/frank-zane-training-split/' },
    exercises: [
      slot('leg-extension', 4, '10-12'),
      slot('lying-leg-curl', 4, '10-12'),
      slot('barbell-squat', 4, '8-12'),
      slot('leg-press', 4, '10-12'),
      slot('standing-calf-raise', 4, '12-15'),
      slot('decline-crunch', 3, '15-20'),
    ],
  },
  {
    id: 'zane-push',
    name: 'Growth Program - Push',
    day: 'Day 3',
    styleId: 'zane-aesthetics',
    sortOrder: 3,
    labels: ['Growth Program'],
    focus: ['chest', 'shoulders', 'triceps'],
    description: 'Push day — chest, delts, triceps with controlled negatives and inter-set stretching.',
    source: { name: 'Frank Zane - SimplyShredded interview', url: 'https://simplyshredded.com/the-legend-of-zane-an-interview.html' },
    exercises: [
      slot('incline-dumbbell-flye', 4, '10-12'),
      slot('incline-barbell-press', 4, '8-12'),
      slot('dumbbell-lateral-raise', 4, '10-12'),
      slot('machine-shoulder-press', 3, '8-12'),
      slot('triceps-pushdown', 4, '10-12'),
      slot('decline-crunch', 3, '15-20'),
    ],
  },
  // Jay Cutler
  {
    id: 'cutler-chest-calves',
    name: 'Olympia Split - Chest & Calves',
    day: 'Day 1',
    styleId: 'cutler-volume',
    sortOrder: 1,
    labels: ['Olympia-era split'],
    focus: ['chest', 'calves'],
    description: 'High-volume chest with short rest; calves hit twice weekly in this split.',
    source: { name: 'Jay Cutler Workout - Hunt Fitness', url: 'https://kylehuntfitness.com/jay-cutler-workout-the-mr-olympia-routine-that-built-a-legend/' },
    exercises: [
      slot('incline-barbell-press', 5, '8-12'),
      slot('barbell-bench-press', 5, '8-12'),
      slot('incline-dumbbell-flye', 4, '10-12'),
      slot('cable-crossover', 4, '12-15'),
      slot('standing-calf-raise', 5, '12-15'),
    ],
  },
  {
    id: 'cutler-arms',
    name: 'Olympia Split - Arms',
    day: 'Day 2',
    styleId: 'cutler-volume',
    sortOrder: 2,
    labels: ['Olympia-era split'],
    focus: ['biceps', 'triceps'],
    description: 'Dedicated arm day — alternating bis and tris with high set counts.',
    source: { name: 'Jay Cutler - SET FOR SET', url: 'https://www.setforset.com/blogs/news/jay-cutler-bodybuilder' },
    exercises: [
      slot('triceps-pushdown', 5, '10-12'),
      slot('barbell-curl', 5, '8-12'),
      slot('lying-triceps-extension', 4, '8-12'),
      slot('hammer-curl', 4, '10-12'),
      slot('one-arm-triceps-pushdown', 4, '10-12'),
      slot('preacher-curl-barbell', 4, '8-12'),
    ],
  },
  {
    id: 'cutler-back',
    name: 'Olympia Split - Back',
    day: 'Day 3',
    styleId: 'cutler-volume',
    sortOrder: 3,
    labels: ['Olympia-era split'],
    focus: ['back', 'lats', 'lower-back'],
    description: 'Brutal back volume — always followed by a rest day in Cutler\'s rotation.',
    source: { name: 'Jay Cutler - BarBend', url: 'https://barbend.com/news/how-strong-was-jay-cutler/' },
    exercises: [
      slot('lat-pulldown', 5, '8-12'),
      slot('barbell-row', 5, '8-12'),
      slot('t-bar-row', 5, '8-12'),
      slot('seated-cable-row', 4, '10-12'),
      slot('deadlift', 4, '6-8'),
    ],
  },
  {
    id: 'cutler-shoulders-traps',
    name: 'Olympia Split - Shoulders & Traps',
    day: 'Day 5',
    styleId: 'cutler-volume',
    sortOrder: 4,
    labels: ['Olympia-era split'],
    focus: ['shoulders', 'traps', 'rear-delts'],
    description: 'Delts and traps with high volume and short rest.',
    source: { name: 'Jay Cutler Workout - Hunt Fitness', url: 'https://kylehuntfitness.com/jay-cutler-workout-the-mr-olympia-routine-that-built-a-legend/' },
    exercises: [
      slot('smith-machine-shoulder-press', 5, '8-12'),
      slot('dumbbell-lateral-raise', 5, '10-12'),
      slot('rear-delt-fly-machine', 4, '12-15'),
      slot('barbell-shrug', 5, '10-12'),
      slot('upright-row', 4, '10-12'),
    ],
  },
  {
    id: 'cutler-legs',
    name: 'Olympia Split - Legs',
    day: 'Day 6',
    styleId: 'cutler-volume',
    sortOrder: 5,
    labels: ['Olympia-era split'],
    focus: ['quads', 'hamstrings', 'calves'],
    description: 'Quad-dominant leg day — extensions, press, squats, then hamstrings and calves.',
    source: { name: 'Jay Cutler - SET FOR SET', url: 'https://www.setforset.com/blogs/news/jay-cutler-bodybuilder' },
    exercises: [
      slot('leg-extension', 5, '12-20'),
      slot('leg-press', 5, '10-12'),
      slot('barbell-squat', 5, '6-10'),
      slot('walking-lunge', 4, '8-10'),
      slot('lying-leg-curl', 4, '10-12'),
      slot('standing-calf-raise', 5, '12-15'),
    ],
  },
  // Samir Bannout
  {
    id: 'bannout-shoulders-arms',
    name: '1983 Prep - Shoulders & Arms',
    day: 'Day 1',
    styleId: 'bannout-lion',
    sortOrder: 1,
    labels: ['1983 Olympia prep'],
    focus: ['shoulders', 'biceps', 'triceps'],
    description: 'Old-school shoulder and arm assault — ~35s rest between sets in peak prep.',
    source: { name: 'Samir Bannout Workout - Iron and Grit', url: 'https://ironandgrit.com/2021/05/02/samir-bannout-workout/' },
    exercises: [
      slot('front-raise', 4, '8-15'),
      slot('dumbbell-lateral-raise', 4, '8-20'),
      slot('military-press', 4, '6-15', { notes: 'Behind-the-neck press in original program.' }),
      slot('upright-row', 4, '6-15'),
      slot('alternating-dumbbell-curl', 4, '6-12'),
      slot('preacher-curl-barbell', 4, '6-12'),
      slot('triceps-pushdown', 4, '8-15'),
      slot('weighted-triceps-dip', 4, '8-15'),
    ],
  },
  {
    id: 'bannout-legs-abs',
    name: '1983 Prep - Legs & Abs',
    day: 'Day 2',
    styleId: 'bannout-lion',
    sortOrder: 2,
    labels: ['1983 Olympia prep'],
    focus: ['quads', 'hamstrings', 'calves', 'abs'],
    description: 'Heavy squats and high-rep calf work — dense leg development.',
    source: { name: 'Samir Bannout - MuscleNet', url: 'https://www.musclenet.com/samir-bannout-workout.html' },
    exercises: [
      slot('leg-extension', 8, '10-15'),
      slot('lying-leg-curl', 5, '10-12'),
      slot('romanian-deadlift', 4, '8-12', { notes: 'Light stiff-leg style.' }),
      slot('hack-squat', 4, '8-12'),
      slot('barbell-squat', 6, '6-15'),
      slot('standing-calf-raise', 8, '15+'),
      slot('seated-calf-raise', 4, '15+'),
      slot('decline-crunch', 4, '25+'),
      slot('leg-raise-parallel-bars', 4, '25+'),
    ],
  },
  {
    id: 'bannout-chest-back',
    name: '1983 Prep - Chest & Back',
    day: 'Day 3',
    styleId: 'bannout-lion',
    sortOrder: 3,
    labels: ['1983 Olympia prep'],
    focus: ['chest', 'back', 'lats'],
    description: 'Dense back and chest — the Christmas-tree back built from rows, chins, and heavy pressing.',
    source: { name: 'Samir Bannout - Fitness Volt', url: 'https://fitnessvolt.com/1725/samir-bannout-the-lion-of-lebanon/' },
    exercises: [
      slot('barbell-bench-press', 6, '4-10'),
      slot('incline-barbell-press', 6, '6-12'),
      slot('incline-dumbbell-flye', 4, '8-15'),
      slot('dumbbell-pullover', 4, '8-15'),
      slot('weighted-triceps-dip', 4, '8-15', { notes: 'Weighted chest dips.' }),
      slot('pull-up', 6, '8-12'),
      slot('barbell-row', 5, '8-12'),
      slot('t-bar-row', 5, '8-12'),
      slot('seated-cable-row', 4, '8-12'),
    ],
  },
  // Dexter Jackson
  {
    id: 'jackson-chest-biceps',
    name: 'The Blade - Chest & Biceps',
    day: 'Day 1',
    styleId: 'jackson-blade',
    sortOrder: 1,
    labels: ['Reference split'],
    focus: ['chest', 'biceps'],
    description: 'Dexter\'s chest and biceps pairing — compounds first, moderate consistent volume.',
    source: { name: 'Dexter Jackson - Generation Iron', url: 'https://generationiron.com/dexter-jackson-workout/' },
    exercises: [
      slot('incline-bench-press-smith', 4, '8-10'),
      slot('barbell-bench-press', 4, '8-10'),
      slot('incline-dumbbell-flye', 3, '10-12'),
      slot('preacher-curl-barbell', 4, '8-10'),
      slot('cable-biceps-curl', 3, '10-12'),
    ],
  },
  {
    id: 'jackson-quads-calves',
    name: 'The Blade - Quads & Calves',
    day: 'Day 2',
    styleId: 'jackson-blade',
    sortOrder: 2,
    labels: ['Reference split'],
    focus: ['quads', 'calves'],
    description: 'High-rep extensions and heavy leg press — quad detail for stage conditioning.',
    source: { name: 'The Blade - Iron Man Magazine', url: 'https://www.ironmanmagazine.com/the-blade/' },
    exercises: [
      slot('leg-extension', 4, '15-20'),
      slot('leg-press', 5, '10-12'),
      slot('barbell-squat', 4, '8-12'),
      slot('walking-lunge', 3, '12-15'),
      slot('standing-calf-raise', 4, '12-15'),
      slot('seated-calf-raise', 3, '12-15'),
    ],
  },
  {
    id: 'jackson-shoulders-triceps',
    name: 'The Blade - Shoulders, Triceps & Calves',
    day: 'Day 4',
    styleId: 'jackson-blade',
    sortOrder: 3,
    labels: ['Reference split'],
    focus: ['shoulders', 'triceps', 'calves'],
    description: 'Machine pressing and high-rep arm work — supersets common in Dexter\'s prep.',
    source: { name: 'Dexter Jackson Workout - SPC Fitz', url: 'https://www.spcfitz.com/dexter-jackson-workout-routine/' },
    exercises: [
      slot('machine-shoulder-press', 4, '10-12'),
      slot('dumbbell-lateral-raise', 3, '12-15'),
      slot('rear-delt-fly-machine', 3, '12-15'),
      slot('triceps-pushdown', 5, '10-15'),
      slot('lying-triceps-extension', 4, '10-12'),
      slot('weighted-triceps-dip', 3, '10-15'),
      slot('standing-calf-raise', 3, '12-15'),
    ],
  },
  {
    id: 'jackson-back-hams',
    name: 'The Blade - Back & Hamstrings',
    day: 'Day 5',
    styleId: 'jackson-blade',
    sortOrder: 4,
    labels: ['Reference split'],
    focus: ['back', 'lats', 'hamstrings', 'lower-back'],
    description: 'Back thickness and ham detail — deadlifts, rows, and high-rep leg curls.',
    source: { name: 'Dexter Jackson - Fitness Volt', url: 'https://fitnessvolt.com/dexter-jackson-diet-training-program/' },
    exercises: [
      slot('lat-pulldown', 4, '8-12'),
      slot('deadlift', 4, '6-8'),
      slot('t-bar-row', 4, '8-12'),
      slot('lying-leg-curl', 4, '10-15'),
      slot('standing-leg-curl', 3, '10-12'),
      slot('romanian-deadlift', 3, '10-12'),
    ],
  },
  // Rich Gaspari
  {
    id: 'gaspari-chest-triceps',
    name: 'Annihilation - Chest & Triceps',
    day: 'Day 1',
    styleId: 'gaspari-annihilation',
    sortOrder: 1,
    labels: ['Annihilation reference'],
    focus: ['chest', 'triceps'],
    description: 'Pre-exhaust flyes into pressing — intense week; moderate pump session the following week.',
    source: { name: 'Rich Gaspari on Failure Training - Fitness Volt', url: 'https://fitnessvolt.com/rich-gaspari-best-method-building-muscle/' },
    exercises: [
      slot('incline-dumbbell-flye', 4, '12-15', { notes: 'Pre-exhaust before presses on intense weeks.' }),
      slot('barbell-bench-press', 4, '6-10'),
      slot('incline-barbell-press', 4, '8-12'),
      slot('cable-crossover', 3, '12-15'),
      slot('triceps-pushdown', 4, '8-12'),
      slot('lying-triceps-extension', 4, '8-12'),
    ],
  },
  {
    id: 'gaspari-back-biceps',
    name: 'Annihilation - Back & Biceps',
    day: 'Day 2',
    styleId: 'gaspari-annihilation',
    sortOrder: 2,
    labels: ['Annihilation reference'],
    focus: ['back', 'lats', 'biceps'],
    description: 'Heavy rows and pulldowns to failure on intense weeks; stretch thoroughly after.',
    source: { name: 'Rich Gaspari Profile - Fitness Volt', url: 'https://fitnessvolt.com/15742/rich-gaspari/' },
    exercises: [
      slot('lat-pulldown', 4, '8-12'),
      slot('barbell-row', 4, '6-10'),
      slot('seated-cable-row', 4, '8-12'),
      slot('barbell-curl', 4, '8-12'),
      slot('preacher-curl-barbell', 4, '8-12'),
      slot('hammer-curl', 3, '10-12'),
    ],
  },
  {
    id: 'gaspari-shoulders-traps',
    name: 'Annihilation - Shoulders & Traps',
    day: 'Day 4',
    styleId: 'gaspari-annihilation',
    sortOrder: 3,
    labels: ['Annihilation reference'],
    focus: ['shoulders', 'traps', 'rear-delts'],
    description: 'Gaspari pre-exhaust shoulder template — laterals and front raises before pressing.',
    source: { name: 'Pre-Exhaust Shoulder Training - Gaspari Nutrition', url: 'https://gasparinutrition.com/blogs/old-school-training-tips/pre-exhaustion-in-a-shoulder-workout' },
    exercises: [
      slot('dumbbell-lateral-raise', 4, '15-20', { notes: 'Phase 1 pre-exhaust.' }),
      slot('front-raise', 3, '12-15', { notes: 'Phase 1 pre-exhaust.' }),
      slot('military-press', 4, '8-10', { notes: 'Phase 2 compound — moderate weight after pre-exhaust.' }),
      slot('rear-delt-fly-machine', 3, '15-20'),
      slot('barbell-shrug', 4, '10-12'),
    ],
  },
  {
    id: 'gaspari-legs',
    name: 'Annihilation - Legs',
    day: 'Day 5',
    styleId: 'gaspari-annihilation',
    sortOrder: 4,
    labels: ['Annihilation reference'],
    focus: ['quads', 'hamstrings', 'calves'],
    description: 'Leg extensions pre-exhaust into presses and squats — total focus, no distractions.',
    source: { name: 'Rich Gaspari Intensity Tips - Fitness Volt', url: 'https://fitnessvolt.com/rich-gaspari-abs-training-intensity-hypertrophy/' },
    exercises: [
      slot('leg-extension', 4, '12-15', { notes: 'Pre-exhaust quads.' }),
      slot('leg-press', 4, '10-12'),
      slot('hack-squat', 4, '8-12'),
      slot('lying-leg-curl', 4, '10-12'),
      slot('romanian-deadlift', 3, '10-12'),
      slot('standing-calf-raise', 4, '12-15'),
    ],
  },
];

for (const workout of legendWorkouts) {
  if (!routines.find((r) => r.id === workout.id)) {
    routines.push({ ...workout, collection: 'legend' });
  }
}

styles.sort((a, b) => a.displayOrder - b.displayOrder);

write('src/data/styles.json', styles);
write('src/data/exercises.json', exercises);
write('src/data/routines.json', routines);

console.log(`Styles: ${styles.length}, Exercises: ${exercises.length}, Routines: ${routines.length}`);
