import './CTA.css'

export default function CTA() {
  return (
    <section className="cta section" id="contact">
      <div className="shell">
        <div className="cta-band">
          <div className="cta-orb" aria-hidden="true" />
          <span className="eyebrow">Let&rsquo;s talk</span>
          <h2 className="cta-title">
            Automate the routine. Compound on the rest.
          </h2>
          <p className="cta-sub">
            Tell us where your team loses time. We&rsquo;ll show you what a
            system could do instead.
          </p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="mailto:hello@imr.llc">
              Book a discovery call
            </a>
            <a className="cta-mail" href="mailto:hello@imr.llc">
              hello@imr.llc
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
