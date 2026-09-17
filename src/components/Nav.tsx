import logo from '../assets/imr-logo.png'
import './Nav.css'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Results', href: '#results' },
  { label: 'Work', href: '#work' },
  { label: 'History', href: '#history' },
  { label: 'About', href: '#about' },
]

export default function Nav() {
  return (
    <header className="nav">
      <div className="shell nav-inner">
        <a className="nav-brand" href="#top">
          <img
            className="nav-logo"
            src={logo}
            alt="IMR Consultants — Investment, Management & Research LLC"
          />
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary nav-cta" href="#contact">
          Book a call
        </a>
      </div>
    </header>
  )
}
