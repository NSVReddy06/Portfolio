import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* Fade + rise into view */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/* Text that decodes from random glyphs when scrolled into view */
const GLYPHS = '01<>/{}[]#$%&*+=ABCDEFΣλΔΩ'
export function Scramble({ text, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (!inView || reduced) return
    let frame = 0
    const total = 26
    const id = setInterval(() => {
      frame++
      const revealed = Math.floor((frame / total) * text.length)
      setOut(
        text
          .split('')
          .map((ch, i) =>
            i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      )
      if (frame >= total) {
        setOut(text)
        clearInterval(id)
      }
    }, 32)
    return () => clearInterval(id)
  }, [inView, reduced, text])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

export function SectionHeading({ index, label, title, sub }) {
  return (
    <header className="section-head">
      <Reveal>
        <p className="eyebrow">
          <span className="eyebrow-index">{index}</span>
          <span className="eyebrow-line" />
          {label}
        </p>
      </Reveal>
      <h2 className="section-title">
        <Scramble text={title} />
      </h2>
      {sub && (
        <Reveal delay={0.1}>
          <p className="section-sub">{sub}</p>
        </Reveal>
      )}
    </header>
  )
}

/* 3D tilt with a cursor-following spotlight */
export function TiltCard({ children, className = '', max = 10, style, ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    if (!finePointer()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={style}
      {...rest}
    >
      <div className="tilt-spot" />
      {children}
    </div>
  )
}

/* Buttons that lean toward the cursor */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (!finePointer()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }
  const onLeave = () => {
    ref.current.style.transform = ''
  }
  return (
    <span ref={ref} className="magnetic" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </span>
  )
}

/* Number that counts up when visible */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => c.stop()
  }, [inView, value])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

/* Inline icons (no icon library needed) */
const paths = {
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 6-7" />
      <circle cx="20" cy="7" r="1.2" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>
  ),
  check: <path d="M5 12l5 5 9-10" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M17 6h3a3 3 0 0 1-3 4M7 6H4a3 3 0 0 0 3 4" />
    </>
  ),
  cap: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3 2 9 2 12 0v-5" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14l-2 7 5-3 5 3-2-7" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.4 0C6.1 1.6 5 1.9 5 1.9a4.7 4.7 0 0 0-.1 3.6A5 5 0 0 0 3.5 9c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21" />
  ),
}

export function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
