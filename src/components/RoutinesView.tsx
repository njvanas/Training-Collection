import { useMemo, useState } from 'react';
import { getExercise, getStyle, routines, styles } from '../lib/db';
import { equipmentLabel, muscleLabel } from '../lib/format';
import type { Routine } from '../schema';

function RoutineCard({ routine }: { routine: Routine }) {
  const style = getStyle(routine.styleId);
  return (
    <div className="routine">
      <div className="routine-head">
        <div>
          <h3>
            {routine.day ? `${routine.day} · ` : ''}
            {routine.name}
          </h3>
          {style ? (
            <div className="ex-meta" style={{ marginTop: 4 }}>
              {style.name} · {style.creator}
            </div>
          ) : null}
          <div className="chips" style={{ marginTop: 8 }}>
            {routine.focus.map((m) => (
              <span className="chip accent" key={m}>
                {muscleLabel(m)}
              </span>
            ))}
          </div>
        </div>
        {routine.source ? (
          <a href={routine.source.url} target="_blank" rel="noreferrer">
            {routine.source.name}
          </a>
        ) : null}
      </div>

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
    </div>
  );
}

export function RoutinesView() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return routines;
    if (filter === 'hevy') {
      return routines.filter((r) => r.source?.url.includes('hevy.com'));
    }
    return routines.filter((r) => r.styleId === filter);
  }, [filter]);

  return (
    <div>
      <div className="toolbar">
        <select
          className="select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All routines ({routines.length})</option>
          <option value="hevy">My Hevy routines</option>
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.creator}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No routines found.</div>
      ) : (
        filtered.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))
      )}
    </div>
  );
}
