import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data'
import { Icon, Magnetic } from './ui'

function Typewriter({ words }) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [text, setText] = useState(reduced ? words[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return
    const word = words[i % words.length]
    let t
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), 1800)
    else if (deleting && text === '') {
      setDeleting(false)
      setI((v) => v + 1)
    } else
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 35 : 70,
      )
    return () => clearTimeout(t)
  }, [text, deleting, i, words, reduced])

  return (
    <span className="typewriter">
      <span className="gradient-text">{text}</span>
      <span className="caret" />
    </span>
  )
}

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const [first, ...rest] = profile.name.split(' ')
  const lines = [first, rest.join(' ')]

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-hello mono">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {'>'} hello_world(), I’m
          </motion.span>
        </p>

        <h1 className="hero-name" aria-label={profile.name}>
          {lines.map((line, li) => (
            <span className="hero-line" key={li} aria-hidden="true">
              {line.split('').map((ch, ci) => (
                <motion.span
                  key={ci}
                  className="hero-char"
                  initial={{ y: '110%', rotateX: -80, opacity: 0 }}
                  animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.45 + li * 0.15 + ci * 0.035, duration: 0.9, ease }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.div
          className="hero-role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
        >
          <Typewriter words={profile.roles} />
        </motion.div>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7, ease }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease }}
        >
          <Magnetic>
            <a href="#projects" className="btn btn-primary">
              See my work <Icon name="arrow" size={16} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          className="hero-meta mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span>
            <Icon name="pin" size={14} /> {profile.location}
          </span>
          <span className="hero-meta-sep" />
          <span>3+ yrs · Wipro</span>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="scroll-cue"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="scroll-cue-mouse">
          <span className="scroll-cue-wheel" />
        </span>
        <span className="mono">scroll</span>
      </motion.a>
    </section>
  )
}
