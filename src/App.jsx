import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, Experience, Projects } from './components/Sections'
import Skills from './components/Skills'
import { Awards, Contact, Education, Footer } from './components/Extras'

// The 3D scene is split into its own chunk so text paints first
const NeuralScene = lazy(() => import('./components/NeuralScene'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let x = innerWidth / 2
    let y = innerHeight / 2
    let cx = x
    let cy = y
    let raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
    }
    const loop = () => {
      cx += (x - cx) * 0.12
      cy += (y - cy) * 0.12
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}

export default function App() {
  const [webgl] = useState(hasWebGL)

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {webgl ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <NeuralScene />
          </Suspense>
        </SceneBoundary>
      ) : (
        <div className="scene scene--fallback" aria-hidden="true" />
      )}
      <CursorGlow />
      <div className="noise" aria-hidden="true" />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Awards />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
