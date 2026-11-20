import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const PINK = new THREE.Color('#f472b6')

// Seeded RNG so the network looks the same on every visit
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildNetwork(count, radius) {
  const rand = rng(42)
  const nodes = []
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere with radial jitter for an organic, brain-like cloud
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = i * 2.399963229728653
    const rad = radius * (0.45 + rand() * 0.55)
    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * r * rad * 1.25,
        y * rad * 0.9,
        Math.sin(theta) * r * rad,
      ),
    )
  }

  const edges = []
  const adj = nodes.map(() => [])
  const seen = new Set()
  const K = 3
  for (let i = 0; i < count; i++) {
    const near = nodes
      .map((n, j) => [j, n.distanceToSquared(nodes[i])])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, K)
    for (const [j] of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([i, j])
      adj[i].push(j)
      adj[j].push(i)
    }
  }

  const colors = nodes.map((n) => {
    const t = THREE.MathUtils.clamp((n.x / (radius * 1.25) + 1) / 2, 0, 1)
    const c = CYAN.clone().lerp(VIOLET, t)
    if (rand() > 0.9) c.lerp(PINK, 0.7)
    return c
  })

  return { nodes, edges, adj, colors, rand }
}

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.65 + 0.35 * sin(uTime * 1.6 + aPhase);
    gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z) * (0.85 + 0.15 * vTwinkle);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
  }
`

const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.12, 0.0, d);
    vec3 col = vColor * glow * 1.2 + vec3(1.0) * core * 0.9;
    gl_FragColor = vec4(col, glow * vTwinkle);
  }
`

function makePointMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

function Network({ count, pulseCount, reduced, pointer, scroll }) {
  const outer = useRef()
  const inner = useRef()
  const net = useMemo(() => buildNetwork(count, 3.2), [count])

  // Node points
  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const size = new Float32Array(count)
    const phase = new Float32Array(count)
    net.nodes.forEach((n, i) => {
      n.toArray(pos, i * 3)
      net.colors[i].toArray(col, i * 3)
      size[i] = 5 + net.adj[i].length * 1.6 + net.rand() * 5
      phase[i] = net.rand() * Math.PI * 2
    })
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    return g
  }, [net, count])

  // Edges
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(net.edges.length * 6)
    const col = new Float32Array(net.edges.length * 6)
    net.edges.forEach(([a, b], i) => {
      net.nodes[a].toArray(pos, i * 6)
      net.nodes[b].toArray(pos, i * 6 + 3)
      net.colors[a].toArray(col, i * 6)
      net.colors[b].toArray(col, i * 6 + 3)
    })
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [net])

  // Signals travelling along edges
  const pulses = useMemo(() => {
    const list = []
    for (let i = 0; i < pulseCount; i++) {
      const from = Math.floor(net.rand() * count)
      const nb = net.adj[from]
      list.push({
        from,
        to: nb[Math.floor(net.rand() * nb.length)] ?? from,
        t: net.rand(),
        speed: 0.35 + net.rand() * 0.6,
      })
    }
    return list
  }, [net, pulseCount, count])

  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const col = new Float32Array(pulseCount * 3)
    const size = new Float32Array(pulseCount)
    const phase = new Float32Array(pulseCount)
    for (let i = 0; i < pulseCount; i++) {
      const c = new THREE.Color('#e0faff').lerp(PINK, i % 5 === 0 ? 0.6 : 0)
      c.toArray(col, i * 3)
      size[i] = 10 + (i % 3) * 3
      phase[i] = i
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    return g
  }, [pulseCount])

  // Ambient dust
  const dustGeo = useMemo(() => {
    const n = Math.floor(count * 2.5)
    const rand = rng(7)
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const size = new Float32Array(n)
    const phase = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 22
      pos[i * 3 + 1] = (rand() - 0.5) * 14
      pos[i * 3 + 2] = (rand() - 0.5) * 12 - 3
      CYAN.clone().lerp(VIOLET, rand()).multiplyScalar(0.6).toArray(col, i * 3)
      size[i] = 2 + rand() * 4
      phase[i] = rand() * 10
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    return g
  }, [count])

  const nodeMat = useMemo(makePointMaterial, [])
  const pulseMat = useMemo(makePointMaterial, [])
  const dustMat = useMemo(makePointMaterial, [])
  const edgeMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useEffect(
    () => () => {
      ;[nodeGeo, edgeGeo, pulseGeo, dustGeo, nodeMat, pulseMat, dustMat, edgeMat].forEach((o) =>
        o.dispose(),
      )
    },
    [nodeGeo, edgeGeo, pulseGeo, dustGeo, nodeMat, pulseMat, dustMat, edgeMat],
  )

  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    const speed = reduced ? 0.15 : 1
    nodeMat.uniforms.uTime.value = time
    pulseMat.uniforms.uTime.value = time
    dustMat.uniforms.uTime.value = time * 0.5

    // Auto-rotation
    inner.current.rotation.y += dt * 0.07 * speed
    inner.current.rotation.z = Math.sin(time * 0.1) * 0.08

    // Mouse parallax (eased)
    const p = pointer.current
    outer.current.rotation.x += (p.y * 0.35 - outer.current.rotation.x) * 0.04
    outer.current.rotation.y += (p.x * 0.5 - outer.current.rotation.y) * 0.04

    // Scroll: drift right, recede and spin as you leave the hero
    const s = scroll.current
    const isWide = state.size.width > 900
    const targetX = isWide ? 2.6 + s * 1.2 : 0
    const targetY = isWide ? -s * 0.6 : 1.2 - s * 1.5
    outer.current.position.x += (targetX - outer.current.position.x) * 0.05
    outer.current.position.y += (targetY - outer.current.position.y) * 0.05
    outer.current.position.z += (-s * 2.5 - outer.current.position.z) * 0.05
    inner.current.rotation.x = s * 0.8
    const targetScale = isWide ? 1 : 0.72
    outer.current.scale.setScalar(outer.current.scale.x + (targetScale - outer.current.scale.x) * 0.1)

    // Move signals along edges; on arrival hop to a random neighbour
    const arr = pulseGeo.attributes.position.array
    for (let i = 0; i < pulses.length; i++) {
      const pl = pulses[i]
      pl.t += dt * pl.speed * speed
      if (pl.t >= 1) {
        pl.t = 0
        pl.from = pl.to
        const nb = net.adj[pl.from]
        pl.to = nb[Math.floor(Math.random() * nb.length)] ?? pl.from
      }
      tmp.lerpVectors(net.nodes[pl.from], net.nodes[pl.to], pl.t)
      tmp.toArray(arr, i * 3)
    }
    pulseGeo.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points geometry={dustGeo} material={dustMat} />
      <group ref={outer}>
        <group ref={inner}>
          <lineSegments geometry={edgeGeo} material={edgeMat} />
          <points geometry={nodeGeo} material={nodeMat} />
          <points geometry={pulseGeo} material={pulseMat} frustumCulled={false} />
        </group>
      </group>
    </>
  )
}

export default function NeuralScene() {
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const wrap = useRef()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      const s = Math.min(window.scrollY / window.innerHeight, 1.5)
      scroll.current = s
      if (wrap.current) wrap.current.style.opacity = String(1 - Math.min(s, 1) * 0.72)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="scene" ref={wrap} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Network
          count={isMobile ? 90 : 170}
          pulseCount={isMobile ? 24 : 50}
          reduced={reduced}
          pointer={pointer}
          scroll={scroll}
        />
      </Canvas>
    </div>
  )
}
