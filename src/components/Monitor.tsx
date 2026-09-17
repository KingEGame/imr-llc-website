import type { ReactNode } from 'react'
import './Monitor.css'

type MonitorProps = {
  children: ReactNode
  /** Extra classes for variants, e.g. "monitor--flat" or a section modifier. */
  className?: string
  /** Optional label shown in the screen's top status bar. */
  label?: string
  screenClassName?: string
}

export default function Monitor({ children, className, label, screenClassName }: MonitorProps) {
  return (
    <div className={`monitor ${className ?? ''}`}>
      <div className="monitor-glow" aria-hidden="true" />
      <div className="monitor-frame">
        <div className="monitor-bar">
          <span className="monitor-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="monitor-label">{label ?? 'imr.systems'}</span>
        </div>
        <div className={`monitor-screen ${screenClassName ?? ''}`}>{children}</div>
      </div>
      <div className="monitor-neck" aria-hidden="true" />
      <div className="monitor-base" aria-hidden="true" />
    </div>
  )
}
