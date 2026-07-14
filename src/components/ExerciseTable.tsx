import { getExercise, getStyle } from '../lib/db';
import { equipmentLabel, muscleLabel } from '../lib/format';
import {
  getSetProtocolGuide,
  resolveSetScheme,
  setKindLabel,
} from '../lib/set-scheme';
import type { Routine, RoutineExercise } from '../schema';

function SetProtocolBanner({ routine }: { routine: Routine }) {
  const style = routine.styleId ? getStyle(routine.styleId) : undefined;
  const guide = getSetProtocolGuide(style, routine.collection);

  return (
    <div className="set-protocol-banner">
      <div className="set-protocol-title">{guide.title}</div>
      <dl className="set-protocol-grid">
        <div>
          <dt>Warm-ups</dt>
          <dd>{guide.warmup}</dd>
        </div>
        <div>
          <dt>Working sets</dt>
          <dd>{guide.working}</dd>
        </div>
        <div>
          <dt>Failure / all-out</dt>
          <dd>{guide.failure}</dd>
        </div>
      </dl>
      <div className="set-legend">
        {(['warmup', 'working', 'failure', 'backoff', 'all-out'] as const).map((kind) => (
          <span className={`set-legend-item kind-${kind}`} key={kind}>
            {setKindLabel(kind)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExerciseSetRows({
  slot,
  routine,
}: {
  slot: RoutineExercise;
  routine: Routine;
}) {
  const style = routine.styleId ? getStyle(routine.styleId) : undefined;
  const { sets, inferred } = resolveSetScheme(slot, style, routine.collection);

  return (
    <div className="set-breakdown">
      {inferred && routine.collection === 'personal' ? (
        <div className="set-inferred-note">Typical scheme for this methodology</div>
      ) : null}
      <div className="set-rows">
        {sets.map((set) => (
          <div className={`set-row kind-${set.kind}`} key={`${set.label}-${set.kind}`}>
            <span className="set-row-label">{set.label}</span>
            <span className="set-row-kind">{setKindLabel(set.kind)}</span>
            <span className="set-row-intensity">{set.intensity}</span>
          </div>
        ))}
      </div>
      {slot.notes ? <div className="set-notes">{slot.notes}</div> : null}
    </div>
  );
}

export function ExerciseTable({ routine }: { routine: Routine }) {
  return (
    <>
      <SetProtocolBanner routine={routine} />
      <div className="ex-table-wrap">
        <table className="ex">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Warm-up → working → failure</th>
            </tr>
          </thead>
          <tbody>
            {routine.exercises.map((slot, idx) => {
              const ex = getExercise(slot.exerciseId);
              return (
                <tr key={`${slot.exerciseId}-${idx}`}>
                  <td data-label="Exercise">
                    <div className="ex-name">
                      {ex ? ex.name : slot.exerciseId}
                      {slot.supersetGroup ? (
                        <span className="superset">SS {slot.supersetGroup}</span>
                      ) : null}
                    </div>
                    {ex ? (
                      <div className="ex-meta">
                        {muscleLabel(ex.primaryMuscle)} · {equipmentLabel(ex.equipment)}
                      </div>
                    ) : null}
                  </td>
                  <td data-label="Sets">{slot.sets}</td>
                  <td data-label="Reps">{slot.repRange}</td>
                  <td data-label="Set scheme">
                    <ExerciseSetRows slot={slot} routine={routine} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
