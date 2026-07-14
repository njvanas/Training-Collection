import exercisesData from '../data/exercises.json';
import stylesData from '../data/styles.json';
import routinesData from '../data/routines.json';
import {
  exercisesFileSchema,
  stylesFileSchema,
  routinesFileSchema,
  type Exercise,
  type Routine,
  type TrainingStyle,
} from '../schema';

export const exercises: Exercise[] = exercisesFileSchema.parse(exercisesData);
export const styles: TrainingStyle[] = stylesFileSchema.parse(stylesData);
export const routines: Routine[] = routinesFileSchema.parse(routinesData);

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

export function getRoutinesByStyle(styleId: string): Routine[] {
  return routines.filter((r) => r.styleId === styleId);
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

  for (const routine of routines) {
    if (!stylesById.has(routine.styleId)) {
      problems.push(
        `Routine "${routine.id}" references unknown style "${routine.styleId}"`,
      );
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
