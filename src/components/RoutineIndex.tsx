import { getRoutine } from '../lib/db';
import { routineAnchorId } from '../lib/format';

type IndexEntry = {
  routineId: string;
  day: string;
  focus: string;
};

type RoutineIndexProps = {
  entries: IndexEntry[];
  activeId?: string;
};

export function RoutineIndex({ entries, activeId }: RoutineIndexProps) {
  return (
    <nav className="routine-index" aria-label="Routine index">
      <span className="filter-label">Jump to</span>
      <div className="index-links">
        {entries.map((entry) => {
          const routine = getRoutine(entry.routineId);
          if (!routine) return null;
          const anchor = routineAnchorId(routine.id);
          const isActive = activeId === entry.routineId;
          return (
            <a
              key={entry.routineId}
              className={`index-link${isActive ? ' active' : ''}`}
              href={`#${anchor}`}
            >
              <span className="index-link-day">{entry.day}</span>
              <span className="index-link-focus">{entry.focus}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
