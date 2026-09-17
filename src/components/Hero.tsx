import logo from '../assets/imr-logo.png'
import { useReveal } from '../hooks/useReveal'
import './Hero.css'

export default function Hero() {
  const copyRef = useReveal<HTMLDivElement>({ immediate: true, stagger: 110, delay: 150 })

  return (
    <section className="hero" id="top">
      <div className="shell hero-inner">
        <div className="hero-copy" ref={copyRef}>
          <img
            className="hero-logo"
            src={logo}
            alt="IMR Consultants"
            data-reveal
          />
          <h1 className="hero-title" data-reveal>
            Intelligent systems for investment, management &amp; research.
          </h1>
          <p className="hero-sub" data-reveal>
            IMR Consultants designs custom software, autonomous AI agents and
            orchestration that automate the routine — so your team compounds on
            the work that matters.
          </p>
          <p className="hero-note" data-reveal>
            Follow the workstation as you scroll — it walks through everything we
            build.
          </p>
        </div>
      </div>
    </section>
  )
}
