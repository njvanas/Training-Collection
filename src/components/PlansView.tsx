import { useMemo, useState } from 'react';
import {
  getLegendRoutineGroups,
  getStyle,
  legendRoutines,
  styles,
  type LegendRoutineGroup,
} from '../lib/db';
import { muscleLabel } from '../lib/format';
import { curatorGradient, curatorInitials } from '../lib/curator';
import type { Routine } from '../schema';
import { ExerciseTable } from './ExerciseTable';

function Avatar({
  name,
  styleId,
  size = '',
}: {
  name: string;
  styleId: string;
  size?: 'sm' | 'lg' | '';
}) {
  return (
    <span
      className={`avatar${size ? ` ${size}` : ''}`}
      style={{ background: curatorGradient(styleId) }}
      aria-hidden
    >
      {curatorInitials(name)}
    </span>
  );
}

function totalSets(routine: Routine): number {
  return routine.exercises.reduce((sum, slot) => sum + slot.sets, 0);
}

function WorkoutDetail({
  routine,
  onBack,
}: {
  routine: Routine;
  onBack: () => void;
}) {
  const style = routine.styleId ? getStyle(routine.styleId) : undefined;
  const creator = style?.creator ?? 'Unknown';

  return (
    <div>
      <button type="button" className="back" onClick={onBack}>
        ← All training routines
      </button>
      <div className="detail">
        <div className="detail-head">
          <div className="who">
            {routine.styleId ? (
              <Avatar name={creator} styleId={routine.styleId} size="lg" />
            ) : null}
            <div>
              <div className="k">Curated by</div>
              <div className="v">{creator}</div>
              {style ? <div className="ex-meta">{style.name}</div> : null}
            </div>
          </div>
          {routine.source ? (
            <a href={routine.source.url} target="_blank" rel="noreferrer">
              {routine.source.name}
            </a>
          ) : null}
        </div>

        <h2>{routine.name}</h2>
        {routine.day ? <div className="plan-day">{routine.day}</div> : null}

        <div className="chips" style={{ marginTop: 12 }}>
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

        {routine.description ? (
          <p className="routine-desc">{routine.description}</p>
        ) : null}

        <ExerciseTable routine={routine} />
      </div>
    </div>
  );
}

function WorkoutCard({
  routine,
  onOpen,
}: {
  routine: Routine;
  onOpen: (id: string) => void;
}) {
  return (
    <button type="button" className="plan-card" onClick={() => onOpen(routine.id)}>
      <h3 className="plan-title">{routine.name}</h3>
      {routine.day ? <div className="plan-day">{routine.day}</div> : null}
      <div className="chips">
        {routine.focus.slice(0, 3).map((m) => (
          <span className="chip" key={m}>
            {muscleLabel(m)}
          </span>
        ))}
      </div>
      <div className="plan-foot">
        <span className="count">
          {routine.exercises.length} exercises · {totalSets(routine)} sets
        </span>
        <span className="view-pill">View workout</span>
      </div>
    </button>
  );
}

function RoutineGroupSection({
  group,
  onOpenWorkout,
}: {
  group: LegendRoutineGroup;
  onOpenWorkout: (id: string) => void;
}) {
  const style = getStyle(group.styleId);
  const creator = style?.creator ?? 'Unknown';

  return (
    <section className="routine-group" aria-labelledby={`routine-group-${group.id}`}>
      <div className="routine-group-header" id={`routine-group-${group.id}`}>
        <Avatar name={creator} styleId={group.styleId} />
        <div className="routine-group-meta">
          <h3 className="routine-group-title">
            {style?.name ?? 'Training routine'}
          </h3>
          <p className="sub routine-group-sub">
            {creator} · {group.label} · {group.workouts.length} workout
            {group.workouts.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      <div className="plan-grid">
        {group.workouts.map((workout) => (
          <WorkoutCard key={workout.id} routine={workout} onOpen={onOpenWorkout} />
        ))}
      </div>
    </section>
  );
}

export function PlansView() {
  const [query, setQuery] = useState('');
  const [curator, setCurator] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId
    ? legendRoutines.find((r) => r.id === selectedId)
    : null;

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getLegendRoutineGroups().flatMap((group) => {
      if (curator !== 'all' && group.styleId !== curator) return [];

      const style = getStyle(group.styleId);
      const workouts = group.workouts.filter((workout) => {
        if (!q) return true;
        const haystack = [
          workout.name,
          workout.day ?? '',
          style?.name ?? '',
          style?.creator ?? '',
          group.label,
          ...workout.labels,
          ...workout.focus,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });

      if (workouts.length === 0) return [];
      return [{ ...group, workouts }];
    });
  }, [query, curator]);

  const workoutCount = filteredGroups.reduce(
    (sum, group) => sum + group.workouts.length,
    0,
  );

  if (selected) {
    return (
      <WorkoutDetail routine={selected} onBack={() => setSelectedId(null)} />
    );
  }

  return (
    <div>
      <div className="section legend-intro">
        <h2 className="section-heading">Training routines</h2>
        <p className="sub">
          Each training routine is a full legend split — a collection of
          workout days with every exercise, warm-up, and working set spelled
          out. Read the Methodologies tab first for context, then open a workout
          to study or run.
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search routines, workouts, muscles, or curator..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="section-title">Filter by legend</div>
      <div className="curators">
        <button
          type="button"
          className={`curator${curator === 'all' ? ' active' : ''}`}
          onClick={() => setCurator('all')}
        >
          <span
            className="avatar"
            style={{ background: 'linear-gradient(135deg, #171a26, #3a3f52)' }}
            aria-hidden
          >
            ALL
          </span>
          <span className="cname">All</span>
        </button>
        {styles.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`curator${curator === s.id ? ' active' : ''}`}
            onClick={() => setCurator(s.id)}
          >
            <Avatar name={s.creator} styleId={s.id} />
            <span className="cname">{s.creator}</span>
          </button>
        ))}
      </div>

      <div className="section-title">
        Training routines ({filteredGroups.length}) · {workoutCount} workout
        {workoutCount === 1 ? '' : 's'}
      </div>
      {filteredGroups.length === 0 ? (
        <div className="empty">No routines match your search.</div>
      ) : (
        <div className="routine-groups">
          {filteredGroups.map((group) => (
            <RoutineGroupSection
              key={group.id}
              group={group}
              onOpenWorkout={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
