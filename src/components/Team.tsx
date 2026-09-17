import { useReveal } from '../hooks/useReveal'
import './Team.css'

const team = [
  {
    initials: 'AR',
    name: 'Adrian Reyes',
    role: 'Managing Partner',
    body: '15 years across quantitative research and systematic investment platforms.',
  },
  {
    initials: 'MK',
    name: 'Mira Kapoor',
    role: 'Head of AI',
    body: 'Builds production agent systems and the orchestration layer behind them.',
  },
  {
    initials: 'TN',
    name: 'Theo Novak',
    role: 'Principal Engineer',
    body: 'Designs the data pipelines and platforms our automations run on.',
  },
  {
    initials: 'SL',
    name: 'Sofia Lind',
    role: 'Head of Research',
    body: 'Turns market and operational data into signals teams actually use.',
  },
]

export default function Team() {
  const gridRef = useReveal<HTMLDivElement>({ stagger: 80 })
  return (
    <section className="team section" id="about">
      <div className="shell">
        <span className="eyebrow">06 · Who we are</span>
        <h2 className="section-title">Engineers, researchers &amp; operators.</h2>
        <p className="section-lead">
          A small senior team spanning investment research, software engineering
          and applied AI.
        </p>
        <div className="team-grid" ref={gridRef}>
          {team.map((m) => (
            <article key={m.name} className="member" data-reveal>
              <span className="member-avatar">{m.initials}</span>
              <h3 className="member-name">{m.name}</h3>
              <span className="member-role">{m.role}</span>
              <p className="member-body">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
