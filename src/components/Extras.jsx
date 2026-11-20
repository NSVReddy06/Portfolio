import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { awards, certifications, education, interests, profile } from '../data'
import { Icon, Magnetic, Reveal, SectionHeading, TiltCard } from './ui'

/* ───────────────────────── Awards ───────────────────────── */
export function Awards() {
  return (
    <section className="section" id="awards">
      <SectionHeading
        index="05"
        label="Recognition"
        title="Awards & certifications"
        sub="Recognition for production work and hackathon builds."
      />
      <div className="awards-grid">
        {awards.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.1}>
            <TiltCard className={`award glass award--${a.tier}`} max={12}>
              <span className="award-shine" />
              <div className="award-top">
                <span className="award-icon">
                  <Icon name="trophy" size={26} />
                </span>
                <span className="award-year mono">{a.year}</span>
              </div>
              <p className="award-place">{a.place}</p>
              <h3 className="award-title">{a.title}</h3>
              <p className="award-org mono">{a.org}</p>
              <p className="award-text">{a.text}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="certs glass">
        <h3 className="certs-title">
          <Icon name="badge" size={20} /> Certifications
        </h3>
        <ul className="certs-list">
          {certifications.map((c) => (
            <li key={c.name}>
              <span>{c.name}</span>
              <span className="mono certs-issuer">{c.issuer}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/* ───────────────────────── Education ───────────────────────── */
export function Education() {
  return (
    <section className="section" id="education">
      <SectionHeading index="06" label="Education" title="Foundations" />
      <div className="edu-grid">
        {education.map((e, i) => (
          <Reveal key={e.degree} delay={i * 0.1}>
            <TiltCard className="edu glass" max={8}>
              <div className="edu-top">
                <span className="edu-icon">
                  <Icon name="cap" size={22} />
                </span>
                <span className="mono edu-period">{e.period}</span>
              </div>
              <h3 className="edu-degree">{e.degree}</h3>
              <p className="edu-school">{e.school}</p>
              <div className="edu-foot">
                <span className="mono">{e.board}</span>
                <span className="edu-score gradient-text">{e.score}</span>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Reveal className="interests">
        <span className="mono">When I’m not training models:</span>
        {interests.map((x) => (
          <span key={x} className="tag">
            {x}
          </span>
        ))}
      </Reveal>
    </section>
  )
}

/* ───────────────────────── Contact ───────────────────────── */
export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const socials = [
    ['linkedin', 'LinkedIn', profile.linkedin],
    ['github', 'GitHub', profile.github],
  ].filter(([, , url]) => url)

  return (
    <section className="section contact" id="contact">
      <div className="contact-orb" aria-hidden="true" />
      <Reveal>
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow-index">07</span>
          <span className="eyebrow-line" />
          Contact
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="contact-title">
          Let’s build something <span className="gradient-text">intelligent</span>.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="contact-sub">
          Open to conversations about ML engineering, LLM and agentic systems, or forecasting
          problems. My inbox is open.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="contact-actions">
        <Magnetic>
          <a href={`mailto:${profile.email}`} className="btn btn-primary btn-lg">
            <Icon name="mail" size={18} /> Say hello
          </a>
        </Magnetic>
        <button className="email-chip glass mono" onClick={copy} aria-label="Copy email address">
          <span>{profile.email}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'ok' : 'copy'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`email-chip-icon ${copied ? 'is-ok' : ''}`}
            >
              <Icon name={copied ? 'check' : 'copy'} size={16} />
            </motion.span>
          </AnimatePresence>
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email copied to clipboard' : ''}
        </span>
      </Reveal>

      <Reveal delay={0.2} className="contact-meta">
        <span className="mono">
          <Icon name="pin" size={15} /> {profile.location}
        </span>
        {socials.map(([icon, label, url]) => (
          <a key={icon} href={url} target="_blank" rel="noreferrer" className="social">
            <Icon name={icon} size={18} /> {label}
          </a>
        ))}
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer mono">
      <span>
        © {new Date().getFullYear()} {profile.fullName}
      </span>
      <a href="#top">Back to top ↑</a>
    </footer>
  )
}
