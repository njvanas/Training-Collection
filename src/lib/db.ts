import myCollectionData from '../data/my-collection.json';
import exercisesData from '../data/exercises.json';
import stylesData from '../data/styles.json';
import routinesData from '../data/routines.json';
import {
  exercisesFileSchema,
  stylesFileSchema,
  routinesFileSchema,
  personalCollectionFileSchema,
  type Exercise,
  type PersonalCollection,
  type Routine,
  type TrainingStyle,
} from '../schema';

export const myCollection: PersonalCollection =
  personalCollectionFileSchema.parse(myCollectionData);
export const exercises: Exercise[] = exercisesFileSchema.parse(exercisesData);
export const styles: TrainingStyle[] = stylesFileSchema
  .parse(stylesData)
  .sort((a, b) => a.displayOrder - b.displayOrder);
export const routines: Routine[] = routinesFileSchema.parse(routinesData);

const styleOrder = new Map(styles.map((s) => [s.id, s.displayOrder]));

/** Routines sorted by collection/methodology order, then sort order. */
export function getSortedRoutines(list: Routine[] = routines): Routine[] {
  return [...list].sort((a, b) => {
    const collectionDiff =
      (a.collection === 'personal' ? 0 : 1) - (b.collection === 'personal' ? 0 : 1);
    if (collectionDiff !== 0) return collectionDiff;

    const styleDiff =
      (styleOrder.get(a.styleId ?? '') ?? Number.MAX_SAFE_INTEGER) -
      (styleOrder.get(b.styleId ?? '') ?? Number.MAX_SAFE_INTEGER);
    if (styleDiff !== 0) return styleDiff;
    return a.sortOrder - b.sortOrder;
  });
}

export const personalRoutines = getSortedRoutines(
  routines.filter((r) => r.collection === 'personal'),
);

export const legendRoutines = getSortedRoutines(
  routines.filter((r) => r.collection === 'legend'),
);

const exercisesById = new Map(exercises.map((e) => [e.id, e]));
const stylesById = new Map(styles.map((s) => [s.id, s]));
const routinesById = new Map(routines.map((r) => [r.id, r]));

export function getExercise(id: string): Exercise | undefined {
  return exercisesById.get(id);
}

export function getStyle(id: string): TrainingStyle | undefined {
  return stylesById.get(id);
}

export function getRoutine(id: string): Routine | undefined {
  return routinesById.get(id);
}

export function getPersonalRoutines(): Routine[] {
  return personalRoutines;
}

export function getLegendRoutines(): Routine[] {
  return legendRoutines;
}

export function getRoutinesByStyle(styleId: string): Routine[] {
  return getSortedRoutines(
    routines.filter((r) => r.collection === 'legend' && r.styleId === styleId),
  );
}

/** Every routine that programs a given exercise. */
export function getRoutinesForExercise(exerciseId: string): Routine[] {
  return routines.filter((r) =>
    r.exercises.some((slot) => slot.exerciseId === exerciseId),
  );
}

/**
 * Validates cross-file references (routine -> exercise, routine -> style) and
 * uniqueness of ids. Returns the list of problems; empty means the DB is sound.
 */
export function validateReferentialIntegrity(): string[] {
  const problems: string[] = [];

  const checkUnique = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problems.push(`Duplicate ${label} id: "${id}"`);
      seen.add(id);
    }
  };

  checkUnique('exercise', exercises.map((e) => e.id));
  checkUnique('style', styles.map((s) => s.id));
  checkUnique('routine', routines.map((r) => r.id));

  const personalIds = new Set(
    myCollection.splitOverview.map((entry) => entry.routineId),
  );
  for (const routine of routines.filter((r) => r.collection === 'personal')) {
    if (!personalIds.has(routine.id)) {
      problems.push(
        `Personal routine "${routine.id}" is missing from my-collection.json splitOverview`,
      );
    }
  }
  for (const entry of myCollection.splitOverview) {
    const routine = routinesById.get(entry.routineId);
    if (!routine) {
      problems.push(
        `my-collection.json references unknown routine "${entry.routineId}"`,
      );
    } else if (routine.collection !== 'personal') {
      problems.push(
        `my-collection.json routine "${entry.routineId}" is not marked personal`,
      );
    }
  }

  for (const routine of routines) {
    if (routine.collection === 'legend') {
      if (!routine.styleId || !stylesById.has(routine.styleId)) {
        problems.push(
          `Legend routine "${routine.id}" references unknown style "${routine.styleId ?? 'none'}"`,
        );
      }
    }
    for (const slot of routine.exercises) {
      if (!exercisesById.has(slot.exerciseId)) {
        problems.push(
          `Routine "${routine.id}" references unknown exercise "${slot.exerciseId}"`,
        );
      }
    }
  }

  return problems;
}
