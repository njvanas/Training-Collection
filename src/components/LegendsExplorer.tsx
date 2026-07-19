import { useMemo, useState } from 'react';
import {
  getLegendRoutineGroupsByStyle,
  getRoutine,
  getRoutinesByStyle,
  styles,
  type LegendRoutineGroup,
} from '../lib/db';
import { intensityTechniqueLabel, muscleLabel } from '../lib/format';
import { curatorGradient, curatorInitials } from '../lib/curator';
import type { Routine, TrainingStyle } from '../schema';
import { AccordionItem } from './Accordion';
import { ExerciseTable } from './ExerciseTable';

type View =
  | { kind: 'browse' }
  | { kind: 'legend'; styleId: string }
  | { kind: 'workout'; styleId: string; routineId: string };

function totalSets(routine: Routine): number {
  return routine.exercises.reduce((sum, slot) => sum + slot.sets, 0);
}

function matchesQuery(style: TrainingStyle, query: string): boolean {
  if (!query) return true;
  const hay = [
    style.name,
    style.creator,
    style.summary,
    ...style.tags,
    ...style.principles,
    ...style.splitOverview.map((d) => `${d.day} ${d.focus}`),
  ]
    .join(' ')
    .toLowerCase();

  if (hay.includes(query)) return true;

  const groups = getLegendRoutineGroupsByStyle(style.id);
  for (const group of groups) {
    if (group.label.toLowerCase().includes(query)) return true;
    for (const workout of group.workouts) {
      const workoutHay = [
        workout.name,
        workout.day ?? '',
        workout.description ?? '',
        ...workout.labels,
        ...workout.focus.map(muscleLabel),
      ]
        .join(' ')
        .toLowerCase();
      if (workoutHay.includes(query)) return true;
    }
  }

  return false;
}

function Avatar({
  name,
  styleId,
  size = '',
}: {
  name: string;
  styleId: string;
  size?: 'sm' | 'lg' | 'xl' | '';
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

function WorkoutCard({
  routine,
  onOpen,
}: {
  routine: Routine;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="legend-workout-card"
      onClick={() => onOpen(routine.id)}
    >
      <div className="legend-workout-card-top">
        {routine.day ? <span className="legend-day-badge">{routine.day}</span> : null}
        <span className="legend-workout-arrow" aria-hidden>
          →
        </span>
      </div>
      <h4 className="legend-workout-title">{routine.name}</h4>
      <div className="chips">
        {routine.focus.slice(0, 3).map((m) => (
          <span className="chip" key={m}>
            {muscleLabel(m)}
          </span>
        ))}
      </div>
      <div className="legend-workout-foot">
        {routine.exercises.length} exercises · {totalSets(routine)} sets
      </div>
    </button>
  );
}

function RoutineGroupBlock({
  group,
  style,
  onOpenWorkout,
}: {
  group: LegendRoutineGroup;
  style: TrainingStyle;
  onOpenWorkout: (id: string) => void;
}) {
  return (
    <section className="legend-routine-block" aria-labelledby={`group-${group.id}`}>
      <div className="legend-routine-block-head" id={`group-${group.id}`}>
        <h3>{group.label}</h3>
        <p className="sub">
          {style.creator} · {group.workouts.length} workout
          {group.workouts.length === 1 ? '' : 's'}
        </p>
      </div>
      <div className="legend-workout-grid">
        {group.workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            routine={workout}
            onOpen={onOpenWorkout}
          />
        ))}
      </div>
    </section>
  );
}

function MethodologyPanel({ style }: { style: TrainingStyle }) {
  return (
    <div className="legend-method">
      <p className="legend-summary">{style.summary}</p>

      <div className="legend-stat-row">
        <div className="legend-stat">
          <span className="legend-stat-label">Training days</span>
          <span className="legend-stat-value">
            {style.guidelines.trainingDaysPerWeek}
          </span>
        </div>
        <div className="legend-stat">
          <span className="legend-stat-label">Muscle frequency</span>
          <span className="legend-stat-value">
            {style.guidelines.frequencyPerMuscle}
          </span>
        </div>
      </div>

      <div className="accordion legend-accordion">
        <AccordionItem
          title="Core principles"
          summary={`${style.principles.length}`}
          defaultOpen
          anchorId={`${style.id}-principles`}
        >
          <ul className="principles">
            {style.principles.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem
          title="Training guidelines"
          summary="Warm-ups · sets · reps"
          anchorId={`${style.id}-guidelines`}
        >
          <div className="legend-guide-grid">
            <div className="legend-guide">
              <h4>Warm-ups</h4>
              <p className="sub">{style.guidelines.warmupProtocol}</p>
            </div>
            <div className="legend-guide">
              <h4>Working sets</h4>
              <p className="sub">{style.guidelines.workingSetProtocol}</p>
            </div>
            <div className="legend-guide">
              <h4>Rep ranges</h4>
              <div className="chips">
                {style.guidelines.repRanges.map((r, i) => (
                  <span className="chip" key={i}>
                    {r.target}: {r.range}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>

        {style.intensityTechniques.length > 0 ? (
          <AccordionItem
            title="Intensity techniques"
            summary={String(style.intensityTechniques.length)}
            anchorId={`${style.id}-intensity`}
          >
            <div className="chips">
              {style.intensityTechniques.map((t) => (
                <span className="chip accent" key={t}>
                  {intensityTechniqueLabel(t)}
                </span>
              ))}
            </div>
          </AccordionItem>
        ) : null}

        <AccordionItem
          title="Weekly split"
          summary={`${style.splitOverview.length} days`}
          defaultOpen
          anchorId={`${style.id}-split`}
        >
          <div className="split-grid">
            {style.splitOverview.map((day) => (
              <div className="split-day" key={`${day.day}-${day.focus}`}>
                <span className="split-day-label">{day.day}</span>
                <span className="split-day-focus">{day.focus}</span>
              </div>
            ))}
          </div>
        </AccordionItem>

        {style.sources.length > 0 ? (
          <AccordionItem
            title="Sources"
            summary={`${style.sources.length}`}
            anchorId={`${style.id}-sources`}
          >
            <ul className="principles source-list">
              {style.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionItem>
        ) : null}
      </div>
    </div>
  );
}

function LegendDetail({
  style,
  onBack,
  onOpenWorkout,
}: {
  style: TrainingStyle;
  onBack: () => void;
  onOpenWorkout: (routineId: string) => void;
}) {
  const groups = getLegendRoutineGroupsByStyle(style.id);
  const workoutCount = getRoutinesByStyle(style.id).length;

  return (
    <div className="legend-detail" key={style.id}>
      <button type="button" className="back" onClick={onBack}>
        ← All legends
      </button>

      <header className="legend-detail-hero">
        <Avatar name={style.creator} styleId={style.id} size="xl" />
        <div className="legend-detail-hero-copy">
          <p className="legend-eyebrow">{style.creator}</p>
          <h2 className="legend-detail-title">{style.name}</h2>
          <div className="chips">
            {style.tags.map((tag) => (
              <span className="chip accent" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className="legend-detail-meta">
            {groups.length} training routine{groups.length === 1 ? '' : 's'} ·{' '}
            {workoutCount} workout{workoutCount === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      <nav className="legend-jump" aria-label="On this page">
        <a href={`#${style.id}-method`}>Methodology</a>
        <a href={`#${style.id}-workouts`}>Workouts</a>
      </nav>

      <div className="legend-detail-layout">
        <section
          className="legend-detail-col"
          id={`${style.id}-method`}
          aria-labelledby={`${style.id}-method-heading`}
        >
          <h3 className="legend-col-title" id={`${style.id}-method-heading`}>
            Methodology
          </h3>
          <MethodologyPanel style={style} />
        </section>

        <section
          className="legend-detail-col"
          id={`${style.id}-workouts`}
          aria-labelledby={`${style.id}-workouts-heading`}
        >
          <h3 className="legend-col-title" id={`${style.id}-workouts-heading`}>
            Training routines
          </h3>
          {groups.length === 0 ? (
            <div className="empty">No workouts for this legend yet.</div>
          ) : (
            <div className="legend-routines">
              {groups.map((group) => (
                <RoutineGroupBlock
                  key={group.id}
                  group={group}
                  style={style}
                  onOpenWorkout={onOpenWorkout}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function WorkoutDetail({
  routine,
  style,
  onBack,
}: {
  routine: Routine;
  style: TrainingStyle | undefined;
  onBack: () => void;
}) {
  const creator = style?.creator ?? 'Unknown';

  return (
    <div className="legend-workout-detail">
      <button type="button" className="back" onClick={onBack}>
        ← Back to {style?.name ?? 'legend'}
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

function LegendCard({
  style,
  index,
  onSelect,
}: {
  style: TrainingStyle;
  index: number;
  onSelect: () => void;
}) {
  const groups = getLegendRoutineGroupsByStyle(style.id);
  const workouts = getRoutinesByStyle(style.id).length;

  return (
    <button
      type="button"
      className="legend-card"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      onClick={onSelect}
    >
      <div className="legend-card-glow" aria-hidden />
      <Avatar name={style.creator} styleId={style.id} size="lg" />
      <div className="legend-card-body">
        <p className="legend-card-creator">{style.creator}</p>
        <h3 className="legend-card-name">{style.name}</h3>
        <p className="legend-card-blurb">{style.summary}</p>
        <div className="chips">
          {style.tags.slice(0, 3).map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="legend-card-meta">
          {groups.length} routine{groups.length === 1 ? '' : 's'} · {workouts}{' '}
          workout{workouts === 1 ? '' : 's'}
        </div>
      </div>
      <span className="legend-card-cta">Explore →</span>
    </button>
  );
}

export function LegendsExplorer() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>({ kind: 'browse' });

  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(
    () => styles.filter((s) => matchesQuery(s, normalized)),
    [normalized],
  );

  if (view.kind === 'workout') {
    const routine = getRoutine(view.routineId);
    const style = styles.find((s) => s.id === view.styleId);
    if (!routine) {
      return (
        <div className="empty">
          Workout not found.{' '}
          <button
            type="button"
            className="back"
            onClick={() => setView({ kind: 'legend', styleId: view.styleId })}
          >
            Go back
          </button>
        </div>
      );
    }
    return (
      <WorkoutDetail
        routine={routine}
        style={style}
        onBack={() => setView({ kind: 'legend', styleId: view.styleId })}
      />
    );
  }

  if (view.kind === 'legend') {
    const style = styles.find((s) => s.id === view.styleId);
    if (!style) {
      return (
        <div className="empty">
          Legend not found.{' '}
          <button
            type="button"
            className="back"
            onClick={() => setView({ kind: 'browse' })}
          >
            Go back
          </button>
        </div>
      );
    }
    return (
      <LegendDetail
        style={style}
        onBack={() => setView({ kind: 'browse' })}
        onOpenWorkout={(routineId) =>
          setView({ kind: 'workout', styleId: style.id, routineId })
        }
      />
    );
  }

  return (
    <div className="legends-browse">
      <div className="legends-search-shell">
        <label className="legends-search-label" htmlFor="legend-search">
          Find a legend, method, or workout
        </label>
        <div className="legends-search-row">
          <span className="legends-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            id="legend-search"
            className="legends-search"
            type="search"
            placeholder="Yates, HIT, Day 1 Chest, FST-7…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="legends-search-clear"
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          ) : null}
        </div>
        <p className="legends-search-hint">
          {filtered.length} of {styles.length} legends
          {normalized ? ` matching “${query.trim()}”` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="empty legends-empty">
          No legends match that search. Try a name, tag, or workout focus.
        </div>
      ) : (
        <div className="legend-grid">
          {filtered.map((style, index) => (
            <LegendCard
              key={style.id}
              style={style}
              index={index}
              onSelect={() => setView({ kind: 'legend', styleId: style.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
