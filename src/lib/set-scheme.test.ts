import { describe, expect, it } from 'vitest';
import {
  inferSetKind,
  resolveSetScheme,
  getSetProtocolGuide,
} from './set-scheme';

describe('set-scheme', () => {
  it('infers warm-up and failure kinds from labels', () => {
    expect(inferSetKind('W1', '30-40%')).toBe('warmup');
    expect(inferSetKind('F1', '100% to failure')).toBe('failure');
    expect(inferSetKind('F2', '90%')).toBe('backoff');
  });

  it('resolves personal HIT scheme when setScheme is empty', () => {
    const { sets, inferred } = resolveSetScheme(
      {
        exerciseId: 'barbell-row',
        sets: 4,
        repRange: '6-12',
        setScheme: [],
      },
      undefined,
      'personal',
    );
    expect(inferred).toBe(true);
    expect(sets.map((s) => s.kind)).toEqual(['warmup', 'warmup', 'failure', 'backoff']);
  });

  it('resolves coleman working sets without failure', () => {
    const { sets } = resolveSetScheme(
      {
        exerciseId: 'barbell-row',
        sets: 4,
        repRange: '8-12',
        setScheme: [],
      },
      {
        id: 'coleman-powerbuilding',
        name: 'Test',
        creator: 'Test',
        displayOrder: 1,
        tags: ['test'],
        summary: 'x',
        principles: ['x'],
        intensityTechniques: [],
        guidelines: {
          trainingDaysPerWeek: '6',
          frequencyPerMuscle: '2x',
          warmupProtocol: 'x',
          workingSetProtocol: 'x',
          repRanges: [{ target: 'x', range: '8-12' }],
        },
        splitOverview: [{ day: 'Mon', focus: 'Back' }],
        sources: [],
      },
      'legend',
    );
    expect(sets.filter((s) => s.kind === 'working').length).toBe(4);
    expect(sets.some((s) => s.kind === 'failure')).toBe(false);
  });

  it('provides protocol guides per methodology', () => {
    expect(getSetProtocolGuide(undefined, 'personal').title).toContain('My Hevy');
    expect(getSetProtocolGuide({ id: 'heavy-duty' } as never, 'legend').title).toContain(
      'Heavy Duty',
    );
  });
});
