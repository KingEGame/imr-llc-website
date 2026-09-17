import { useReveal } from '../hooks/useReveal'
import './Results.css'

const results = [
  {
    tag: 'Asset Manager',
    metric: '−63%',
    head: 'Reporting cycle time',
    body: 'Agent-driven reconciliation and report generation replaced a four-day manual close.',
  },
  {
    tag: 'Research Firm',
    metric: '12×',
    head: 'Coverage expanded',
    body: 'An autonomous research pipeline now monitors 12× more sources with the same team.',
  },
  {
    tag: 'Operations',
    metric: '24/7',
    head: 'Always-on monitoring',
    body: 'Orchestrated agents watch data integrity around the clock and escalate only exceptions.',
  },
]

export default function Results() {
  const gridRef = useReveal<HTMLDivElement>({ stagger: 90 })
  return (
    <section className="results section" id="results">
      <div className="shell">
        <span className="eyebrow">03 · Results</span>
        <h2 className="section-title">Routine work, quietly automated.</h2>
        <p className="section-lead">
          A look at what changes when the manual layer disappears.
        </p>
        <div className="results-grid" ref={gridRef}>
          {results.map((r) => (
            <article key={r.tag} className="result-card" data-reveal>
              <span className="result-tag">{r.tag}</span>
              <span className="result-metric">{r.metric}</span>
              <h3 className="result-head">{r.head}</h3>
              <p className="result-body">{r.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
