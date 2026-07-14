import { useMemo, useState } from 'react';
import {
  getExercise,
  getLegendRoutines,
  getStyle,
  legendRoutines,
  styles,
} from '../lib/db';
import { equipmentLabel, muscleLabel } from '../lib/format';
import { curatorGradient, curatorInitials } from '../lib/curator';
import type { Routine } from '../schema';

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

function RoutineDetail({
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
        ← All legend plans
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
                    {slot.notes ? (
                      <div className="set-notes">{slot.notes}</div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlanCard({
  routine,
  onOpen,
}: {
  routine: Routine;
  onOpen: (id: string) => void;
}) {
  const style = routine.styleId ? getStyle(routine.styleId) : undefined;
  const creator = style?.creator ?? 'Unknown';

  return (
    <button type="button" className="plan-card" onClick={() => onOpen(routine.id)}>
      <div className="plan-curator">
        {routine.styleId ? (
          <Avatar name={creator} styleId={routine.styleId} />
        ) : null}
        <div className="meta">
          <div className="k">{style?.name ?? 'Routine'}</div>
          <div className="v">{creator}</div>
        </div>
      </div>
      <h3 className="plan-title">{routine.name}</h3>
      {routine.day ? <div className="plan-day">{routine.day}</div> : null}
      <div className="chips">
        {routine.labels.slice(0, 2).map((label) => (
          <span className="chip label-chip" key={label}>
            {label}
          </span>
        ))}
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
        <span className="view-pill">View plan</span>
      </div>
    </button>
  );
}

export function PlansView() {
  const [query, setQuery] = useState('');
  const [curator, setCurator] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId
    ? legendRoutines.find((r) => r.id === selectedId)
    : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getLegendRoutines().filter((r) => {
      if (curator !== 'all' && r.styleId !== curator) return false;
      if (!q) return true;
      const style = r.styleId ? getStyle(r.styleId) : undefined;
      const haystack = [
        r.name,
        r.day ?? '',
        style?.name ?? '',
        style?.creator ?? '',
        ...r.labels,
        ...r.focus,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, curator]);

  if (selected) {
    return (
      <RoutineDetail routine={selected} onBack={() => setSelectedId(null)} />
    );
  }

  return (
    <div>
      <div className="section legend-intro">
        <h2 className="section-heading">Legend reference plans</h2>
        <p className="sub">
          Documented splits from the curators — for study and comparison. Your
          personal Hevy days are on the My Hevy tab.
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search plans by name, muscle, or curator..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="section-title">Curators</div>
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
        Training plans ({filtered.length})
      </div>
      {filtered.length === 0 ? (
        <div className="empty">No plans match your search.</div>
      ) : (
        <div className="plan-grid">
          {filtered.map((routine) => (
            <PlanCard key={routine.id} routine={routine} onOpen={setSelectedId} />
          ))}
        </div>
      )}
    </div>
  );
}
