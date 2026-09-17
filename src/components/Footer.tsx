import logo from '../assets/imr-logo.png'
import './Footer.css'

const cols = [
  {
    title: 'Services',
    links: ['Custom Software', 'AI Agents', 'Automation', 'Orchestration'],
  },
  {
    title: 'Company',
    links: ['About', 'Results', 'Work', 'History', 'Process'],
  },
  {
    title: 'Contact',
    links: ['hello@imr.llc', '+1 (555) 014-5320', 'Book a call'],
  },
]

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell foot-grid">
        <div className="foot-brand">
          <a className="foot-logo-link" href="#top">
            <img
              className="foot-logo"
              src={logo}
              alt="IMR Consultants — Investment, Management & Research LLC"
            />
          </a>
          <p>
            Custom software, AI agents and orchestration that automate routine
            work for investment and research teams.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="foot-col">
            <h4>{c.title}</h4>
            <ul>
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#top">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shell foot-bot">
        <span>© 2026 IMR Consultants. All rights reserved.</span>
        <span>Built for teams that automate.</span>
      </div>
    </footer>
  )
}
