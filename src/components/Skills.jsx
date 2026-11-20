import { useEffect, useRef } from 'react'
import { skills, sphereWords } from '../data'
import { Reveal, SectionHeading } from './ui'

function SkillSphere({ words }) {
  const stage = useRef(null)
  const items = useRef([])

  useEffect(() => {
    const el = stage.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = words.length
    // Distribute words evenly on a sphere
    const pts = words.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = i * 2.399963229728653
      return [Math.cos(t) * r, y, Math.sin(t) * r]
    })

    let vx = reduced ? 0 : 0.004
    let vy = reduced ? 0 : 0.006
    let rotX = 0
    let rotY = 0
    let dragging = false
    let last = [0, 0]
    let raf = 0
    let visible = true

    const render = () => {
      const R = el.clientWidth * 0.4
      const cx = Math.cos(rotX)
      const sx = Math.sin(rotX)
      const cy = Math.cos(rotY)
      const sy = Math.sin(rotY)
      pts.forEach(([x, y, z], i) => {
        // rotate around Y then X
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y1 = y * cx - z1 * sx
        const z2 = y * sx + z1 * cx
        const depth = (z2 + 1) / 2 // 0 back → 1 front
        const node = items.current[i]
        if (!node) return
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y1 * R}px, 0) scale(${0.6 + depth * 0.6})`
        node.style.opacity = String(0.2 + depth * 0.8)
        node.style.zIndex = String(Math.round(depth * 100))
        node.style.filter = depth < 0.35 ? 'blur(1px)' : 'none'
      })
    }

    const loop = () => {
      if (visible) {
        if (!dragging) {
          rotX += vx
          rotY += vy
          // ease back toward a gentle idle spin
          vx += ((reduced ? 0 : 0.002) - vx) * 0.02
          vy += ((reduced ? 0 : 0.004) - vy) * 0.02
        }
        render()
      }
      raf = requestAnimationFrame(loop)
    }

    const down = (e) => {
      dragging = true
      last = [e.clientX, e.clientY]
      el.setPointerCapture(e.pointerId)
    }
    const move = (e) => {
      if (!dragging) return
      const dx = e.clientX - last[0]
      const dy = e.clientY - last[1]
      last = [e.clientX, e.clientY]
      vy = dx * 0.005
      vx = -dy * 0.005
      rotY += vy
      rotX += vx
    }
    const up = () => {
      dragging = false
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    render()
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [words])

  return (
    <div className="sphere" ref={stage} aria-hidden="true">
      <div className="sphere-core" />
      {words.map((w, i) => (
        <span key={w} className="sphere-word mono" ref={(n) => (items.current[i] = n)}>
          {w}
        </span>
      ))}
      <span className="sphere-hint mono">drag to spin</span>
    </div>
  )
}

export default function Skills() {
  const all = Object.values(skills).flat()
  return (
    <section className="section" id="skills">
      <SectionHeading
        index="04"
        label="Skills"
        title="The toolkit"
        sub="What I reach for when going from raw data to a deployed model."
      />
      <div className="skills-grid">
        <div className="skill-groups">
          {Object.entries(skills).map(([group, list], gi) => (
            <Reveal key={group} delay={gi * 0.08} className="skill-group glass">
              <h3 className="skill-group-title">
                <span className="mono">{String(gi + 1).padStart(2, '0')}</span> {group}
              </h3>
              <div className="tags">
                {list.map((s) => (
                  <span className="tag tag--lg" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <SkillSphere words={sphereWords} />
        </Reveal>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="marquee-item">
              {s} <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
