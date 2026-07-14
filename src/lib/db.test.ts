import { describe, expect, it } from 'vitest';
import {
  exercises,
  getLegendRoutines,
  getSortedRoutines,
  hevyCatalog,
  hevyFolders,
  legendRoutines,
  styles,
  getExercise,
  getRoutinesForExercise,
  validateReferentialIntegrity,
} from './db';

describe('training database', () => {
  it('loads and validates all data files', () => {
    expect(exercises.length).toBeGreaterThan(0);
    expect(styles.length).toBeGreaterThan(0);
    expect(legendRoutines.length).toBeGreaterThan(0);
    expect(hevyFolders.length).toBeGreaterThan(0);
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

  it('every style has tags and legend plans are sorted within style', () => {
    for (const style of styles) {
      expect(style.tags.length, style.id).toBeGreaterThan(0);
      const owned = getSortedRoutines(
        legendRoutines.filter((r) => r.styleId === style.id),
      );
      for (let i = 1; i < owned.length; i++) {
        expect(owned[i].sortOrder).toBeGreaterThanOrEqual(owned[i - 1].sortOrder);
      }
    }
  });

  it('every legend style has at least one training plan', () => {
    for (const style of styles) {
      const owned = getLegendRoutines().filter((r) => r.styleId === style.id);
      expect(owned.length, style.id).toBeGreaterThan(0);
    }
  });

  it('every legend exercise has an explicit set scheme', () => {
    for (const routine of getLegendRoutines()) {
      for (const slot of routine.exercises) {
        expect(slot.setScheme.length, `${routine.id}/${slot.exerciseId}`).toBeGreaterThan(0);
      }
    }
  });

  it('lists every Hevy folder with a label and url', () => {
    expect(hevyFolders.length).toBe(10);
    for (const folder of hevyFolders) {
      expect(folder.name.length).toBeGreaterThan(0);
      expect(folder.url).toMatch(/^https:\/\/hevy\.com\/folder\/\d+$/);
      expect(folder.url.endsWith(folder.hevyId)).toBe(true);
      expect(folder.routinesInHevy.length).toBeGreaterThan(0);
    }
  });

  it('hevy catalog has public-facing copy', () => {
    expect(hevyCatalog.summary).toMatch(/Hevy/i);
    expect(hevyCatalog.name.length).toBeGreaterThan(0);
  });

  it('every legend plan exercise resolves to a real exercise', () => {
    for (const routine of getLegendRoutines()) {
      for (const slot of routine.exercises) {
        expect(getExercise(slot.exerciseId), slot.exerciseId).toBeDefined();
      }
    }
  });

  it('finds legend plans that use a given exercise', () => {
    const used = getRoutinesForExercise('triceps-pushdown');
    expect(used.length).toBeGreaterThan(0);
    expect(used.every((r) => r.collection === 'legend')).toBe(true);
  });

  it('has positive set counts and non-empty rep ranges', () => {
    for (const routine of getLegendRoutines()) {
      for (const slot of routine.exercises) {
        expect(slot.sets).toBeGreaterThan(0);
        expect(slot.repRange.length).toBeGreaterThan(0);
      }
    }
  });
});
