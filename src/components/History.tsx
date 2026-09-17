import { useReveal } from '../hooks/useReveal'
import './History.css'

const milestones = [
  { year: '2018', title: 'Founded', body: 'IMR begins as a two-person research and engineering studio.' },
  { year: '2020', title: 'First platform', body: 'Shipped our first production investment-research platform.' },
  { year: '2022', title: 'Automation at scale', body: 'Routine workflows automated across multiple client teams.' },
  { year: '2024', title: 'Agents go live', body: 'Autonomous research and ops agents deployed in production.' },
  { year: '2026', title: 'Orchestration', body: 'An end-to-end orchestration layer now connects every system.' },
]

export default function History() {
  const lineRef = useReveal<HTMLOListElement>({ stagger: 80 })
  return (
    <section className="history section" id="history">
      <div className="shell">
        <span className="eyebrow">05 · Our history</span>
        <h2 className="section-title">Eight years building systems.</h2>
        <p className="section-lead">
          From a two-person studio to an end-to-end automation partner for
          investment and research teams.
        </p>
        <ol className="history-line" ref={lineRef}>
          {milestones.map((m) => (
            <li key={m.year} className="history-item" data-reveal>
              <span className="history-dot" />
              <span className="history-year">{m.year}</span>
              <h3 className="history-title">{m.title}</h3>
              <p className="history-body">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
