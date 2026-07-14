import { useMemo, useState } from 'react';
import {
  getExercise,
  getSortedRoutines,
  getStyle,
  routines,
  styles,
} from '../lib/db';
import { equipmentLabel, muscleLabel } from '../lib/format';
import type { Routine } from '../schema';

type FilterId = 'all' | 'hevy' | string;

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

function RoutineGroup({
  title,
  subtitle,
  routines: groupRoutines,
}: {
  title: string;
  subtitle?: string;
  routines: Routine[];
}) {
  return (
    <section className="routine-group">
      <div className="routine-group-head">
        <h2>{title}</h2>
        {subtitle ? <p className="sub">{subtitle}</p> : null}
      </div>
      {groupRoutines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </section>
  );
}

export function RoutinesView() {
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return getSortedRoutines();
    if (filter === 'hevy') {
      return getSortedRoutines(
        routines.filter((r) => r.source?.url.includes('hevy.com')),
      );
    }
    return getSortedRoutines(routines.filter((r) => r.styleId === filter));
  }, [filter]);

  const grouped = useMemo(() => {
    if (filter !== 'all') return null;

    const groups: { styleId: string; routines: Routine[] }[] = [];
    for (const style of styles) {
      const owned = filtered.filter((r) => r.styleId === style.id);
      if (owned.length > 0) {
        groups.push({ styleId: style.id, routines: owned });
      }
    }
    return groups;
  }, [filter, filtered]);

  const hevyCount = routines.filter((r) => r.source?.url.includes('hevy.com')).length;

  return (
    <div>
      <div className="filter-bar">
        <span className="filter-label">Show</span>
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({routines.length})
          </button>
          <button
            type="button"
            className={`filter-chip${filter === 'hevy' ? ' active' : ''}`}
            onClick={() => setFilter('hevy')}
          >
            My Hevy ({hevyCount})
          </button>
          {styles.map((s) => {
            const count = routines.filter((r) => r.styleId === s.id).length;
            return (
              <button
                key={s.id}
                type="button"
                className={`filter-chip${filter === s.id ? ' active' : ''}`}
                onClick={() => setFilter(s.id)}
              >
                {s.creator} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No routines found.</div>
      ) : grouped ? (
        grouped.map((group) => {
          const style = getStyle(group.styleId);
          if (!style) return null;
          return (
            <RoutineGroup
              key={group.styleId}
              title={style.name}
              subtitle={`${style.creator} · ${style.tags.join(' · ')}`}
              routines={group.routines}
            />
          );
        })
      ) : (
        filtered.map((routine) => <RoutineCard key={routine.id} routine={routine} />)
      )}
    </div>
  );
}
