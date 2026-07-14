import { describe, expect, it } from 'vitest';
import {
  exercises,
  getLegendRoutines,
  getPersonalRoutines,
  getSortedRoutines,
  hevyFolders,
  myCollection,
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
    expect(myCollection.splitOverview.length).toBeGreaterThan(0);
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

  it('every style has tags and legend routines are sorted within style', () => {
    for (const style of styles) {
      expect(style.tags.length, style.id).toBeGreaterThan(0);
      const owned = getSortedRoutines().filter(
        (r) => r.collection === 'legend' && r.styleId === style.id,
      );
      for (let i = 1; i < owned.length; i++) {
        expect(owned[i].sortOrder).toBeGreaterThanOrEqual(owned[i - 1].sortOrder);
      }
    }
  });

  it('every legend style has at least one reference routine', () => {
    for (const style of styles) {
      const owned = getLegendRoutines().filter((r) => r.styleId === style.id);
      expect(owned.length, style.id).toBeGreaterThan(0);
    }
  });

  it('keeps personal Hevy routines separate from legend methodologies', () => {
    const personal = getPersonalRoutines();
    expect(personal.length).toBeGreaterThanOrEqual(6);
    for (const routine of personal) {
      expect(routine.collection).toBe('personal');
      expect(routine.styleId).toBeUndefined();
    }
    expect(
      getLegendRoutines().some((r) => r.id.startsWith('hevy-')),
    ).toBe(false);
  });

  it('indexes every personal routine in my-collection.json', () => {
    const indexed = new Set(myCollection.splitOverview.map((e) => e.routineId));
    const folderIds = new Set(myCollection.hevyFolders.map((f) => f.id));
    for (const routine of getPersonalRoutines()) {
      expect(indexed.has(routine.id), routine.id).toBe(true);
      expect(routine.hevyFolderId && folderIds.has(routine.hevyFolderId)).toBe(true);
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
