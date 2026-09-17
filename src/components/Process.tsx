import { useReveal } from '../hooks/useReveal'
import './Process.css'

const steps = [
  {
    n: '1',
    title: 'Discover',
    body: 'We map your routine workflows and find where time and risk concentrate.',
  },
  {
    n: '2',
    title: 'Design',
    body: 'Architect the software, agents and data flows around your operating reality.',
  },
  {
    n: '3',
    title: 'Build',
    body: 'Ship in tight increments — production-grade software and agents, not prototypes.',
  },
  {
    n: '4',
    title: 'Orchestrate',
    body: 'Connect everything into observable, resilient end-to-end workflows.',
  },
  {
    n: '5',
    title: 'Optimize',
    body: 'Measure, monitor and improve — the system compounds over time.',
  },
]

export default function Process() {
  const gridRef = useReveal<HTMLOListElement>({ stagger: 70 })
  return (
    <section className="process section" id="process">
      <div className="shell">
        <span className="eyebrow">02 · How we work</span>
        <h2 className="section-title">
          From routine bottleneck to running system.
        </h2>
        <p className="section-lead">
          A disciplined path from first conversation to a system that quietly
          runs in production.
        </p>
        <ol className="process-grid" ref={gridRef}>
          {steps.map((s) => (
            <li key={s.n} className="proc" data-reveal>
              <span className="proc-n">{s.n}</span>
              <h3 className="proc-title">{s.title}</h3>
              <p className="proc-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
