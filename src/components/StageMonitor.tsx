import { useEffect, useRef, useState } from 'react'
import Monitor from './Monitor'
import './StageMonitor.css'

// Section order inside .page-main (must match App.tsx).
const SERVICES = 1

type Config = { label: string; kind: 'hero' | 'services' | 'work' | 'cta' | 'generic'; title?: string; sub?: string }

const CONFIG: Config[] = [
  { label: 'orchestration.live', kind: 'hero' },
  { label: 'what-we-build', kind: 'services' },
  { label: 'how-we-work', kind: 'generic', title: 'How we work', sub: 'discover → design → build → operate' },
  { label: 'the-platform', kind: 'generic', title: 'The platform', sub: 'ingest · reason · orchestrate · compound' },
  { label: 'results', kind: 'generic', title: 'Results', sub: '41% of routine work removed' },
  { label: 'selected-work', kind: 'work' },
  { label: 'history', kind: 'generic', title: 'Since 2018', sub: 'compounding every single year' },
  { label: 'who-we-are', kind: 'generic', title: 'Who we are', sub: 'engineers · researchers · operators' },
  { label: 'contact', kind: 'cta', title: "Let's build", sub: 'Automate the routine. Compound on the rest.' },
]

const feed = [
  { dot: 'cyan', text: 'Research agent active' },
  { dot: 'blue', text: 'Data pipeline running' },
  { dot: 'cyan', text: 'Reconciliation done' },
]
const heroStats = [
  { num: '120+', lbl: 'Automations shipped' },
  { num: '41%', lbl: 'Routine work cut' },
  { num: '24/7', lbl: 'Agents online' },
]

const disciplines = [
  { title: 'Custom Software', body: 'Platforms and tools shaped around how your firm operates.', detail: 'Typed end to end, tested, and handed over with docs your team can extend.' },
  { title: 'AI Agents', body: 'Autonomous research, monitoring and decision support.', detail: 'Bounded by guardrails, audit trails and human approval on consequential steps.' },
  { title: 'Automation', body: 'Reconciliation, reporting and data entry, handled.', detail: 'Idempotent, observable pipelines that surface only the exceptions.' },
  { title: 'Orchestration', body: 'Agents, services and APIs as resilient workflows.', detail: 'Durable execution and clean retries across dozens of services.' },
  { title: 'Investment Research', body: 'Raw market data turned into decisions.', detail: 'Reproducible datasets, versioned models and morning-ready dashboards.' },
  { title: 'Managed Operations', body: 'We run and improve the systems we build.', detail: 'On-call, patched and measured against SLAs as your needs evolve.' },
]

const work = [
  { kind: 'AI Agents', title: 'Autonomous Research Desk' },
  { kind: 'Operations', title: 'Ops Control Platform' },
  { kind: 'Automation', title: 'Close Automation' },
  { kind: 'Orchestration', title: 'Agent Orchestration Layer' },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function StageMonitor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const cur = { my: 0, rot: 0, mx: 0 }
    const target = { my: 0, rot: 0, mx: 0 }

    const loop = () => {
      const main = document.querySelector('.page-main')
      const sections = main ? (Array.from(main.children) as HTMLElement[]) : []
      const vh = window.innerHeight
      const centerY = vh / 2

      // Which section owns the viewport centre, and how far through it we are.
      let idx = 0
      let local = 0
      let servicesRect: DOMRect | null = null
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect()
        if (i === SERVICES) servicesRect = r
        if (centerY >= r.top && centerY < r.bottom) {
          idx = i
          local = Math.min(Math.max((centerY - r.top) / r.height, 0), 1)
          break
        }
        if (centerY < r.top) {
          idx = i
          local = 0
          break
        }
        idx = sections.length - 1
        local = 1
      }
      idx = Math.min(idx, CONFIG.length - 1)

      // Drift the whole device with scroll so it visibly travels.
      target.my = (local - 0.5) * 90
      target.rot = (local - 0.5) * 5
      target.mx = idx % 2 === 0 ? 0 : 18
      if (reduce) {
        target.my = 0
        target.rot = 0
        target.mx = 0
      }
      cur.my = lerp(cur.my, target.my, 0.08)
      cur.rot = lerp(cur.rot, target.rot, 0.08)
      cur.mx = lerp(cur.mx, target.mx, 0.08)
      wrap.style.setProperty('--my', `${cur.my}px`)
      wrap.style.setProperty('--rot', `${cur.rot}deg`)
      wrap.style.setProperty('--mx', `${cur.mx}px`)

      // Services: zoom the card grid one card at a time, driven by its track.
      const grid = gridRef.current
      if (idx === SERVICES && grid && servicesRect) {
        const N = disciplines.length
        const total = servicesRect.height - vh
        const scrolled = Math.min(Math.max(-servicesRect.top, 0), Math.max(total, 1))
        const p = total > 0 ? scrolled / total : 0
        const f = Math.min(p * N, N - 0.0001)
        const ci = Math.max(0, Math.min(N - 1, Math.floor(f)))
        const lp = f - ci
        const g = reduce ? 1 : 1 - Math.abs(lp - 0.5) * 2
        const cards = Array.from(grid.children) as HTMLElement[]
        const sw = grid.clientWidth
        const sh = grid.clientHeight
        const card = cards[ci]
        if (card) {
          const cx = card.offsetLeft + card.offsetWidth / 2
          const cy = card.offsetTop + card.offsetHeight / 2
          const fs = Math.min(sw / card.offsetWidth, sh / card.offsetHeight) * 0.82
          const s = 1 + (fs - 1) * g
          grid.style.setProperty('--s', String(s))
          grid.style.setProperty('--tx', `${(sw / 2 - fs * cx) * g}px`)
          grid.style.setProperty('--ty', `${(sh / 2 - fs * cy) * g}px`)
          cards.forEach((c, k) => c.classList.toggle('is-focus', k === ci && g > 0.55))
        }
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActive(idx)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  const cfg = CONFIG[active]

  return (
    <div className="stage-monitor" ref={wrapRef} aria-hidden="true">
      <Monitor label={cfg.label} screenClassName="stage-screen">
        <div className="stage-panel" key={active}>
          {cfg.kind === 'hero' && (
            <div className="stage-hero">
              <ul className="stage-feed">
                {feed.map((f) => (
                  <li key={f.text}>
                    <span className={`feed-dot feed-dot--${f.dot}`} />
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="stage-metrics">
                <div>
                  <strong>−41%</strong>
                  <span>routine work</span>
                </div>
                <div>
                  <strong>24 / 7</strong>
                  <span>agents online</span>
                </div>
              </div>
              <div className="stage-cta">
                <a className="btn btn-primary" href="#contact">
                  Start a project
                </a>
                <a className="btn btn-ghost" href="#services">
                  Explore services
                </a>
              </div>
              <div className="stage-stats">
                {heroStats.map((s) => (
                  <div key={s.lbl} className="stage-stat">
                    <span className="stage-stat-num">{s.num}</span>
                    <span className="stage-stat-lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cfg.kind === 'services' && (
            <div className="stage-grid" ref={gridRef}>
              {disciplines.map((d, i) => (
                <article key={d.title} className="scard">
                  <span className="scard-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="scard-title">{d.title}</h3>
                  <p className="scard-body">{d.body}</p>
                  <p className="scard-detail">{d.detail}</p>
                </article>
              ))}
            </div>
          )}

          {cfg.kind === 'work' && (
            <div className="stage-work">
              <span className="stage-eyebrow">Selected work</span>
              <ul>
                {work.map((w) => (
                  <li key={w.title}>
                    <span className="stage-work-dot" />
                    <span className="stage-work-name">{w.title}</span>
                    <span className="stage-work-kind">{w.kind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cfg.kind === 'cta' && (
            <div className="stage-generic stage-generic--cta">
              <span className="stage-eyebrow">Ready when you are</span>
              <h3 className="stage-title">{cfg.title}</h3>
              <p className="stage-sub">{cfg.sub}</p>
              <a className="btn btn-primary" href="#contact">
                Book a call
              </a>
            </div>
          )}

          {cfg.kind === 'generic' && (
            <div className="stage-generic">
              <span className="stage-eyebrow">{cfg.label}</span>
              <h3 className="stage-title">{cfg.title}</h3>
              <p className="stage-sub">{cfg.sub}</p>
            </div>
          )}
        </div>
      </Monitor>
    </div>
  )
}
