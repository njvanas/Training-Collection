import { getExercise, getStyle } from '../lib/db';
import { equipmentLabel, muscleLabel, routineAnchorId } from '../lib/format';
import type { Routine } from '../schema';

type RoutineCardProps = {
  routine: Routine;
  /** Anchor id used for jump navigation. */
  anchorId?: string;
  /** Start collapsed to improve scanability in long lists. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Hide legend methodology line (personal collection). */
  showStyle?: boolean;
};

export function RoutineCard({
  routine,
  anchorId,
  collapsible = false,
  defaultOpen = true,
  showStyle = true,
}: RoutineCardProps) {
  const id = anchorId ?? routineAnchorId(routine.id);
  const style = routine.styleId ? getStyle(routine.styleId) : undefined;

  const head = (
    <div className="routine-head">
      <div>
        <h3>
          {routine.day ? `${routine.day} · ` : ''}
          {routine.name}
        </h3>
        {showStyle && style ? (
          <div className="ex-meta routine-style-line">
            {style.name} · {style.creator}
          </div>
        ) : null}
        <div className="chips routine-chips">
          {routine.labels.map((label) => (
            <span className="chip label-chip" key={label}>
              {label}
            </span>
          ))}
          {routine.focus.map((m) => (
            <span className="chip accent" key={m}>
              {muscleLabel(m)}
            </span>
          ))}
        </div>
      </div>
      {routine.source ? (
        <a
          href={routine.source.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          {routine.source.name}
        </a>
      ) : null}
    </div>
  );

  const body = (
    <>
      {routine.description ? (
        <p className="routine-desc">{routine.description}</p>
      ) : null}

      <table className="ex">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Scheme &amp; notes</th>
          </tr>
        </thead>
        <tbody>
          {routine.exercises.map((slot, idx) => {
            const ex = getExercise(slot.exerciseId);
            return (
              <tr key={`${slot.exerciseId}-${idx}`}>
                <td>
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
                <td>{slot.sets}</td>
                <td>{slot.repRange}</td>
                <td>
                  {slot.setScheme.length > 0 ? (
                    <div className="scheme">
                      {slot.setScheme.map((s) => (
                        <span className="seg" key={s.label}>
                          {s.label} {s.intensity}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {slot.notes ? <div className="set-notes">{slot.notes}</div> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  if (!collapsible) {
    return (
      <article className="routine" id={id}>
        {head}
        {body}
      </article>
    );
  }

  return (
    <details className="routine routine-collapsible" id={id} open={defaultOpen}>
      <summary className="routine-summary">{head}</summary>
      <div className="routine-body">{body}</div>
    </details>
  );
}
