import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience, profile, projects, stats } from '../data'
import { Counter, Icon, Reveal, SectionHeading, TiltCard } from './ui'

/* ───────────────────────── About ───────────────────────── */
// Each line is a list of [className, text] tokens
const CODE = [
  [['k', 'class '], ['c', 'SaiVikas'], ['', '('], ['c', 'MLEngineer'], ['', '):']],
  [['', '    role     = '], ['s', '"AI & ML Engineer"']],
  [['', '    based_in = '], ['s', '"Bengaluru, IN"']],
  [['', '    focus    = ['], ['s', '"Deep Learning"'], ['', ', '], ['s', '"LLMs"'], ['', ',']],
  [['', '                '], ['s', '"Forecasting"'], ['', ', '], ['s', '"Agents"'], ['', ']']],
  [],
  [['', '    '], ['k', 'def '], ['f', 'solve'], ['', '(self, problem):']],
  [['', '        signals = '], ['f', 'engineer_features'], ['', '(problem)']],
  [['', '        model   = '], ['c', 'LSTM'], ['', '().'], ['f', 'fit'], ['', '(signals)']],
  [['', '        '], ['k', 'return '], ['f', 'deploy'], ['', '(model)  '], ['m', '# → production']],
]

function CodeCard() {
  return (
    <TiltCard className="code-card glass" max={8}>
      <div className="code-bar">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
        <span className="code-file mono">sai_vikas.py</span>
      </div>
      <pre className="code mono">
        <code>
          {CODE.map((line, i) => (
            <span className="code-line" key={i}>
              <span className="code-ln">{i + 1}</span>
              {line.map(([c, t], j) => (
                <span key={j} className={c ? `c-${c}` : undefined}>
                  {t}
                </span>
              ))}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </TiltCard>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <SectionHeading index="01" label="About" title="Turning signals into decisions" />
      <div className="about-grid">
        <div className="about-text">
          {profile.summary.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{p}</p>
            </Reveal>
          ))}
          <div className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08} className="stat glass">
                <span className="stat-value gradient-text">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="stat-label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15}>
          <CodeCard />
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Experience ───────────────────────── */
export function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section className="section" id="experience">
      <SectionHeading
        index="02"
        label="Experience"
        title="Where I’ve been building"
        sub="Enterprise AI at scale: from deep-learning forecasters to RAG-powered contract agents."
      />
      {experience.map((job) => (
        <div className="job" key={job.company}>
          <Reveal className="job-head glass">
            <div>
              <h3 className="job-company">{job.company}</h3>
              <p className="job-role">{job.role}</p>
            </div>
            <div className="job-meta mono">
              <span className="job-period">{job.period}</span>
              <span>{job.location}</span>
            </div>
          </Reveal>

          <div className="timeline" ref={ref}>
            <div className="timeline-track">
              <motion.div className="timeline-fill" style={{ scaleY: fill }} />
            </div>
            {job.points.map((pt, i) => (
              <motion.div
                key={pt.title}
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="timeline-node">
                  <span />
                </span>
                <div className="timeline-card glass">
                  <span className="timeline-num mono">0{i + 1}</span>
                  <h4>{pt.title}</h4>
                  <p>{pt.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

/* ───────────────────────── Projects ───────────────────────── */
export function Projects() {
  return (
    <section className="section" id="projects">
      <SectionHeading
        index="03"
        label="Projects"
        title="Selected work"
        sub="Systems I’ve designed and shipped at Wipro."
      />
      <div className="projects-grid">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.1}>
            <TiltCard className="project glass" style={{ '--accent': p.accent }}>
              <div className="project-top">
                <span className="project-icon">
                  <Icon name={p.icon} size={24} />
                </span>
                <span className="project-kicker mono">{p.kicker}</span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <ul className="project-list">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="tags">
                {p.tags.map((t) => (
                  <span className="tag mono" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <span className="project-glow" />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
