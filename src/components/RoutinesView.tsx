import { useMemo, useState } from 'react';
import {
  getLegendRoutines,
  getSortedRoutines,
  getStyle,
  legendRoutines,
  styles,
} from '../lib/db';
import type { Routine } from '../schema';
import { RoutineCard } from './RoutineCard';
import { RoutineIndex } from './RoutineIndex';

type FilterId = 'all' | string;

function RoutineGroup({
  title,
  subtitle,
  routines: groupRoutines,
  showIndex = false,
}: {
  title: string;
  subtitle?: string;
  routines: Routine[];
  showIndex?: boolean;
}) {
  const indexEntries = groupRoutines
    .filter((r) => r.day)
    .map((r) => ({
      routineId: r.id,
      day: r.day ?? r.name,
      focus: r.labels[0] ?? r.focus.map((m) => m).join(', '),
    }));

  return (
    <section className="routine-group">
      <div className="routine-group-head">
        <h2>{title}</h2>
        {subtitle ? <p className="sub">{subtitle}</p> : null}
      </div>
      {showIndex && indexEntries.length > 1 ? (
        <RoutineIndex entries={indexEntries} />
      ) : null}
      {groupRoutines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} collapsible defaultOpen={false} />
      ))}
    </section>
  );
}

export function RoutinesView() {
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return getLegendRoutines();
    return getSortedRoutines(
      legendRoutines.filter((r) => r.styleId === filter),
    );
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

  return (
    <div>
      <div className="section legend-intro">
        <h2 className="section-heading">Legend reference routines</h2>
        <p className="sub">
          Documented splits from Yates, Mentzer, Coleman, and Doucette — for study
          and comparison, separate from your personal Hevy programming.
        </p>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Methodology</span>
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All legends ({legendRoutines.length})
          </button>
          {styles.map((s) => {
            const count = legendRoutines.filter((r) => r.styleId === s.id).length;
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
              showIndex
            />
          );
        })
      ) : (
        <>
          <RoutineIndex
            entries={filtered
              .filter((r) => r.day)
              .map((r) => ({
                routineId: r.id,
                day: r.day ?? r.name,
                focus: r.name,
              }))}
          />
          {filtered.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} collapsible defaultOpen={false} />
          ))}
        </>
      )}
    </div>
  );
}
