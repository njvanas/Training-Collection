import { z } from 'zod';

/** Muscle groups used to classify exercises and routine focus. */
export const muscleGroupSchema = z.enum([
  'chest',
  'back',
  'lats',
  'traps',
  'shoulders',
  'rear-delts',
  'biceps',
  'triceps',
  'forearms',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
  'lower-back',
  'cardio',
]);
export type MuscleGroup = z.infer<typeof muscleGroupSchema>;

/** Equipment required to perform an exercise. */
export const equipmentSchema = z.enum([
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'smith-machine',
  'bodyweight',
  'plate-loaded',
  'other',
]);
export type Equipment = z.infer<typeof equipmentSchema>;

/** Whether an exercise trains many joints, one joint, or is conditioning. */
export const exerciseCategorySchema = z.enum(['compound', 'isolation', 'cardio']);
export type ExerciseCategory = z.infer<typeof exerciseCategorySchema>;

/** Beyond-failure intensity techniques that define the Blood & Guts style. */
export const intensityTechniqueSchema = z.enum([
  'forced-reps',
  'rest-pause',
  'negatives',
  'drop-set',
  'partials',
  'iso-hold',
  'static-stretch',
]);
export type IntensityTechnique = z.infer<typeof intensityTechniqueSchema>;

/** A single exercise in the library. */
export const exerciseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Name as it appears in the Hevy app, when it differs from `name`. */
  hevyName: z.string().min(1).optional(),
  aliases: z.array(z.string().min(1)).default([]),
  primaryMuscle: muscleGroupSchema,
  secondaryMuscles: z.array(muscleGroupSchema).default([]),
  equipment: equipmentSchema,
  category: exerciseCategorySchema,
  /** Short execution cues (setup, tempo, range of motion). */
  cues: z.array(z.string().min(1)).default([]),
  /** How this movement is used within Blood & Guts training. */
  bloodAndGutsNote: z.string().min(1).optional(),
});
export type Exercise = z.infer<typeof exerciseSchema>;

/** A single line of a training style's weekly split. */
export const splitDaySchema = z.object({
  day: z.string().min(1),
  focus: z.string().min(1),
});
export type SplitDay = z.infer<typeof splitDaySchema>;

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});
export type Source = z.infer<typeof sourceSchema>;

/** Short UI labels that categorize a methodology (e.g. "HIT", "6-day split"). */
export const styleTagSchema = z.string().min(1);

/** A training methodology such as Dorian Yates' Blood & Guts. */
export const trainingStyleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  creator: z.string().min(1),
  /** Lower numbers appear first in navigation and filters. */
  displayOrder: z.number().int().nonnegative(),
  /** Compact labels for filtering and at-a-glance comparison. */
  tags: z.array(styleTagSchema).min(1),
  summary: z.string().min(1),
  principles: z.array(z.string().min(1)).min(1),
  intensityTechniques: z.array(intensityTechniqueSchema).default([]),
  guidelines: z.object({
    trainingDaysPerWeek: z.string().min(1),
    frequencyPerMuscle: z.string().min(1),
    warmupProtocol: z.string().min(1),
    workingSetProtocol: z.string().min(1),
    repRanges: z
      .array(z.object({ target: z.string().min(1), range: z.string().min(1) }))
      .min(1),
  }),
  splitOverview: z.array(splitDaySchema).min(1),
  sources: z.array(sourceSchema).default([]),
});
export type TrainingStyle = z.infer<typeof trainingStyleSchema>;

/** Role of a set within an exercise's scheme. */
export const setKindSchema = z.enum([
  'warmup',
  'working',
  'failure',
  'backoff',
  'all-out',
]);
export type SetKind = z.infer<typeof setKindSchema>;

/** A weight/intensity target for one set (e.g. warm-up or working set). */
export const setTargetSchema = z.object({
  /** Short label such as W1, W2, F1 (failure set), F2. */
  label: z.string().min(1),
  /** Warm-up, working, failure, back-off, or all-out finisher. Inferred from label when omitted. */
  kind: setKindSchema.optional(),
  /** Guidance for the load, e.g. "30-40%" of the working weight. */
  intensity: z.string().min(1),
});
export type SetTarget = z.infer<typeof setTargetSchema>;

/** One exercise slot inside a routine. */
export const routineExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.number().int().positive(),
  repRange: z.string().min(1),
  /** Exercises sharing a superset group id are performed back-to-back. */
  supersetGroup: z.string().min(1).optional(),
  setScheme: z.array(setTargetSchema).default([]),
  notes: z.string().min(1).optional(),
});
export type RoutineExercise = z.infer<typeof routineExerciseSchema>;

/** Whether a routine belongs to a legend's reference split or the owner's personal Hevy collection. */
export const routineCollectionSchema = z.enum(['personal', 'legend']);
export type RoutineCollection = z.infer<typeof routineCollectionSchema>;

/** Owner profile and index for personal Hevy routines. */
export const personalCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  hevyFolders: z
    .array(
      z.object({
        id: z.string().min(1),
        /** Numeric Hevy folder id from the share URL. */
        hevyId: z.string().min(1),
        name: z.string().min(1),
        url: z.string().url(),
        displayOrder: z.number().int().nonnegative(),
        note: z.string().min(1).optional(),
        /** Routine titles as they appear inside the Hevy folder. */
        routinesInHevy: z.array(z.string().min(1)).default([]),
      }),
    )
    .min(1),
  splitOverview: z.array(
    z.object({
      day: z.string().min(1),
      focus: z.string().min(1),
      routineId: z.string().min(1),
    }),
  ).min(1),
  trainingNotes: z.array(z.string().min(1)).default([]),
});
export type PersonalCollection = z.infer<typeof personalCollectionSchema>;

/** A concrete workout — either a legend reference split or a personal Hevy day. */
export const routineSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    day: z.string().min(1).optional(),
    collection: routineCollectionSchema.default('legend'),
    /** Required for legend routines; omitted for personal Hevy routines. */
    styleId: z.string().min(1).optional(),
    /** Lower numbers appear first within the same collection. */
    sortOrder: z.number().int().nonnegative(),
    /** Required for personal routines; must match an id in my-collection.json. */
    hevyFolderId: z.string().min(1).optional(),
    /** Short UI labels (e.g. "Classic reference", "Ideal routine"). */
    labels: z.array(z.string().min(1)).default([]),
    focus: z.array(muscleGroupSchema).min(1),
    description: z.string().min(1).optional(),
    source: z
      .object({ name: z.string().min(1), url: z.string().url() })
      .optional(),
    exercises: z.array(routineExerciseSchema).min(1),
  })
  .superRefine((routine, ctx) => {
    if (routine.collection === 'legend' && !routine.styleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Legend routines must reference a styleId',
        path: ['styleId'],
      });
    }
    if (routine.collection === 'personal' && routine.styleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Personal routines must not reference a legend styleId',
        path: ['styleId'],
      });
    }
    if (routine.collection === 'personal' && !routine.hevyFolderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Personal routines must reference a hevyFolderId',
        path: ['hevyFolderId'],
      });
    }
    if (routine.collection === 'legend' && routine.hevyFolderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Legend routines must not reference a hevyFolderId',
        path: ['hevyFolderId'],
      });
    }
  });
export type Routine = z.infer<typeof routineSchema>;

export const exercisesFileSchema = z.array(exerciseSchema);
export const stylesFileSchema = z.array(trainingStyleSchema);
export const routinesFileSchema = z.array(routineSchema);
export const personalCollectionFileSchema = personalCollectionSchema;
