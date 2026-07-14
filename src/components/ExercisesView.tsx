import { useMemo, useState } from 'react';
import { exercises } from '../lib/db';
import { categoryLabel, equipmentLabel, muscleLabel } from '../lib/format';
import type { MuscleGroup } from '../schema';

export function ExercisesView() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');

  const muscleOptions = useMemo(() => {
    const set = new Set<MuscleGroup>();
    for (const ex of exercises) set.add(ex.primaryMuscle);
    return [...set].sort((a, b) => muscleLabel(a).localeCompare(muscleLabel(b)));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((ex) => {
      if (muscle !== 'all' && ex.primaryMuscle !== muscle) return false;
      if (!q) return true;
      const haystack = [ex.name, ex.hevyName ?? '', ...ex.aliases]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, muscle]);

  return (
    <div>
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value as MuscleGroup | 'all')}
        >
          <option value="all">All muscles</option>
          {muscleOptions.map((m) => (
            <option key={m} value={m}>
              {muscleLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No exercises match your filters.</div>
      ) : (
        <div className="grid">
          {filtered.map((ex) => (
            <div className="card" key={ex.id}>
              <h3>{ex.name}</h3>
              {ex.hevyName && ex.hevyName !== ex.name ? (
                <p className="sub">Hevy: {ex.hevyName}</p>
              ) : null}
              <div className="chips">
                <span className="chip accent">{muscleLabel(ex.primaryMuscle)}</span>
                <span className="chip">{equipmentLabel(ex.equipment)}</span>
                <span className="chip">{categoryLabel(ex.category)}</span>
                {ex.secondaryMuscles.map((m) => (
                  <span className="chip" key={m}>
                    {muscleLabel(m)}
                  </span>
                ))}
              </div>
              {ex.cues.length > 0 ? (
                <ul className="cues">
                  {ex.cues.map((cue, i) => (
                    <li key={i}>{cue}</li>
                  ))}
                </ul>
              ) : null}
              {ex.bloodAndGutsNote ? (
                <div className="note">{ex.bloodAndGutsNote}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
