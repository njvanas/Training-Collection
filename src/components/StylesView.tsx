import { useState } from 'react';
import { getRoutinesByStyle, styles } from '../lib/db';
import { intensityTechniqueLabel } from '../lib/format';
import { curatorGradient, curatorInitials } from '../lib/curator';
import type { TrainingStyle } from '../schema';
import { AccordionItem } from './Accordion';

function StylePickerCard({
  style,
  selected,
  onSelect,
}: {
  style: TrainingStyle;
  selected: boolean;
  onSelect: () => void;
}) {
  const routineCount = getRoutinesByStyle(style.id).length;

  return (
    <button
      type="button"
      className={`style-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="method-head compact">
        <span
          className="avatar"
          style={{ background: curatorGradient(style.id) }}
          aria-hidden
        >
          {curatorInitials(style.creator)}
        </span>
        <div className="who">
          <h3>{style.name}</h3>
          <span className="style-card-creator">{style.creator}</span>
        </div>
      </div>
      <div className="chips">
        {style.tags.map((tag) => (
          <span className="chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <p className="style-card-meta">
        {routineCount} plan{routineCount === 1 ? '' : 's'} ·{' '}
        {style.guidelines.trainingDaysPerWeek}
      </p>
    </button>
  );
}

function StyleDetail({ style }: { style: TrainingStyle }) {
  const routineCount = getRoutinesByStyle(style.id).length;

  return (
    <div className="style-detail" id={`methodology-${style.id}`}>
      <div className="style-detail-header">
        <div className="method-head">
          <span
            className="avatar lg"
            style={{ background: curatorGradient(style.id) }}
            aria-hidden
          >
            {curatorInitials(style.creator)}
          </span>
          <div className="who">
            <h2>{style.name}</h2>
            <p className="sub">{style.creator}</p>
          </div>
        </div>
        <div className="chips">
          {style.tags.map((tag) => (
            <span className="chip accent" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="style-summary">{style.summary}</p>

      <nav className="section-index" aria-label="Curator sections">
        <span className="filter-label">On this page</span>
        <div className="index-links">
          <a className="index-link" href={`#${style.id}-principles`}>
            <span className="index-link-focus">Principles</span>
          </a>
          <a className="index-link" href={`#${style.id}-guidelines`}>
            <span className="index-link-focus">Guidelines</span>
          </a>
          {style.intensityTechniques.length > 0 ? (
            <a className="index-link" href={`#${style.id}-intensity`}>
              <span className="index-link-focus">Intensity</span>
            </a>
          ) : null}
          <a className="index-link" href={`#${style.id}-split`}>
            <span className="index-link-focus">Weekly split</span>
          </a>
          {style.sources.length > 0 ? (
            <a className="index-link" href={`#${style.id}-sources`}>
              <span className="index-link-focus">Sources</span>
            </a>
          ) : null}
        </div>
      </nav>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">Training days</span>
          <span className="stat-value">{style.guidelines.trainingDaysPerWeek}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Muscle frequency</span>
          <span className="stat-value">{style.guidelines.frequencyPerMuscle}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Reference plans</span>
          <span className="stat-value">{routineCount}</span>
        </div>
      </div>

      <div className="accordion">
        <AccordionItem
          title="Core principles"
          summary={`${style.principles.length} principles`}
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
          summary="Warm-ups, working sets, rep ranges"
          anchorId={`${style.id}-guidelines`}
        >
          <div className="grid">
            <div className="card">
              <h3>Frequency</h3>
              <p className="sub">Training days: {style.guidelines.trainingDaysPerWeek}</p>
              <p className="sub">Per muscle: {style.guidelines.frequencyPerMuscle}</p>
            </div>
            <div className="card">
              <h3>Warm-ups</h3>
              <p className="sub">{style.guidelines.warmupProtocol}</p>
            </div>
            <div className="card">
              <h3>Working sets</h3>
              <p className="sub">{style.guidelines.workingSetProtocol}</p>
            </div>
            <div className="card">
              <h3>Rep ranges</h3>
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
            summary={style.intensityTechniques
              .map(intensityTechniqueLabel)
              .join(', ')}
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
            summary={`${style.sources.length} links`}
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

export function StylesView() {
  const [selectedId, setSelectedId] = useState(styles[0]?.id ?? '');
  const selected = styles.find((s) => s.id === selectedId) ?? styles[0];

  if (!selected) {
    return <div className="empty">No methodologies loaded.</div>;
  }

  return (
    <div className="styles-layout">
      <div className="section styles-intro">
        <h2 className="section-heading">Training methodologies</h2>
        <p className="sub">
          How the legends actually trained — philosophy, warm-up and working-set
          rules, intensity techniques, weekly splits, and sources. Pick a
          methodology to read through, then open the matching training plans for
          every exercise, set, and rep range.
        </p>
      </div>

      <div className="style-picker">
        {styles.map((style) => (
          <StylePickerCard
            key={style.id}
            style={style}
            selected={style.id === selected.id}
            onSelect={() => setSelectedId(style.id)}
          />
        ))}
      </div>

      <StyleDetail key={selected.id} style={selected} />
    </div>
  );
}
