import { describe, expect, it } from 'vitest';
import {
  exercises,
  getSortedRoutines,
  routines,
  styles,
  getExercise,
  getRoutinesForExercise,
  validateReferentialIntegrity,
} from './db';

describe('training database', () => {
  it('loads and validates all data files', () => {
    expect(exercises.length).toBeGreaterThan(0);
    expect(styles.length).toBeGreaterThan(0);
    expect(routines.length).toBeGreaterThan(0);
  });

  it('has no referential-integrity problems', () => {
    expect(validateReferentialIntegrity()).toEqual([]);
  });

  it('includes all expected methodologies', () => {
    const ids = new Set(styles.map((s) => s.id));
    for (const id of ['blood-and-guts', 'heavy-duty', 'coleman-powerbuilding', 'htlt']) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it('orders methodologies by displayOrder', () => {
    for (let i = 1; i < styles.length; i++) {
      expect(styles[i].displayOrder).toBeGreaterThanOrEqual(styles[i - 1].displayOrder);
    }
  });

  it('every style has tags and routines are sorted within style', () => {
    for (const style of styles) {
      expect(style.tags.length, style.id).toBeGreaterThan(0);
      const owned = getSortedRoutines().filter((r) => r.styleId === style.id);
      for (let i = 1; i < owned.length; i++) {
        expect(owned[i].sortOrder).toBeGreaterThanOrEqual(owned[i - 1].sortOrder);
      }
    }
  });

  it('every style has at least one routine', () => {
    for (const style of styles) {
      const owned = routines.filter((r) => r.styleId === style.id);
      expect(owned.length, style.id).toBeGreaterThan(0);
    }
  });

  it('includes the personal Hevy routines', () => {
    const hevy = routines.filter((r) => r.source?.url.includes('hevy.com'));
    expect(hevy.length).toBeGreaterThanOrEqual(6);
  });

  it('every routine exercise resolves to a real exercise', () => {
    for (const routine of routines) {
      for (const slot of routine.exercises) {
        expect(getExercise(slot.exerciseId), slot.exerciseId).toBeDefined();
      }
    }
  });

  it('finds routines that use a given exercise', () => {
    const used = getRoutinesForExercise('triceps-pushdown');
    expect(used.length).toBeGreaterThan(0);
  });

  it('has positive set counts and non-empty rep ranges', () => {
    for (const routine of routines) {
      for (const slot of routine.exercises) {
        expect(slot.sets).toBeGreaterThan(0);
        expect(slot.repRange.length).toBeGreaterThan(0);
      }
    }
  });
});
