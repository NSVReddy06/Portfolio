import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { profile } from '../data'

const links = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['awards', 'Awards'],
  ['contact', 'Contact'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#top" className="nav-logo" aria-label="Back to top">
          <span className="nav-logo-mark">{profile.initials}</span>
          <span className="nav-logo-text">{profile.name.split(' ').slice(0, 2).join(' ')}</span>
        </a>
        <ul className="nav-links">
          {links.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={active === id ? 'is-active' : ''}>
                {label}
                {active === id && <motion.span layoutId="nav-pill" className="nav-pill" />}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map(([id, label], i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <span className="mono">0{i + 1}</span> {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
