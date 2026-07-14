import { useId, useState, type ReactNode } from 'react';

type AccordionItemProps = {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function AccordionItem({
  title,
  summary,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`accordion-item${open ? ' open' : ''}`}>
      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="accordion-title">{title}</span>
        {summary && !open ? (
          <span className="accordion-summary">{summary}</span>
        ) : null}
        <span className="accordion-chevron" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? (
        <div className="accordion-panel" id={panelId}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
