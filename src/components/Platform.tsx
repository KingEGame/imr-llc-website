import { useEffect, useRef, useState } from 'react'
import './Platform.css'

const stages = [
  {
    n: '01',
    key: 'Ingest',
    head: 'Connect every source.',
    body: 'We pull data from your systems, files and APIs into one structured place — no manual exports.',
  },
  {
    n: '02',
    key: 'Reason',
    head: 'Agents do the routine.',
    body: 'Autonomous agents read, reconcile and draft — escalating only the exceptions that need a human.',
  },
  {
    n: '03',
    key: 'Orchestrate',
    head: 'Coordinate the workflow.',
    body: 'Every step runs in a resilient, observable pipeline that scales with your volume.',
  },
  {
    n: '04',
    key: 'Compound',
    head: 'Improve over time.',
    body: 'Each run sharpens the system, so your team spends its hours on judgment, not busywork.',
  },
]

const counters = [
  { to: 120, suffix: '+', lbl: 'Automations shipped' },
  { to: 41, suffix: '%', lbl: 'Routine work reduced' },
  { to: 99, suffix: '%', lbl: 'Pipeline uptime' },
  { to: 8, suffix: ' yrs', lbl: 'Building systems' },
]

function useCountUp(to: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, active])
  return val
}

export default function Platform() {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="platform section">
      <div className="shell">
        <span className="eyebrow">The platform · live</span>
        <h2 className="section-title">Watch the routine run itself.</h2>
        <p className="section-lead">
          From raw inputs to compounding output — the same system, end to end.
          Follow each stage.
        </p>

        <div className="platform-body">
          <div className="platform-tabs" role="tablist" aria-label="Pipeline stages">
            {stages.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={active === i}
                className={`platform-tab ${active === i ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="platform-tab-n">{s.n}</span>
                <span className="platform-tab-key">{s.key}</span>
              </button>
            ))}
          </div>

          <div className="platform-panel" role="tabpanel">
            <span className="platform-step">
              Step {stages[active].n} / 04
            </span>
            <h3 className="platform-head">{stages[active].head}</h3>
            <p className="platform-panel-body">{stages[active].body}</p>
            <div className="platform-flow">
              {stages.map((s, i) => (
                <span
                  key={s.key}
                  className={`platform-node ${i <= active ? 'is-lit' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="platform-stats" ref={statsRef}>
          {counters.map((c) => (
            <Stat key={c.lbl} {...c} active={seen} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Stat({
  to,
  suffix,
  lbl,
  active,
}: {
  to: number
  suffix: string
  lbl: string
  active: boolean
}) {
  const val = useCountUp(to, active)
  return (
    <div className="platform-stat">
      <span className="platform-stat-num">
        {val}
        {suffix}
      </span>
      <span className="platform-stat-lbl">{lbl}</span>
    </div>
  )
}
