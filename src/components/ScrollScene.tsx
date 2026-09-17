import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './ScrollScene.css'

// The site-wide "scroll engine": one persistent WebGL scene fixed behind every
// section. Scroll position scrubs a camera dolly through a deep particle field
// + node lattice, so the whole page reads as one continuous 3D experience
// (the creative-dev feel of the shared references). Scroll velocity adds twist,
// the pointer adds parallax. Reduced-motion renders a calm static frame.
export default function ScrollScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x070b1c, 0.014)
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 400)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const world = new THREE.Group()
    scene.add(world)

    const glow = makeGlowTexture()

    // Depth range the camera travels along z as you scroll top -> bottom.
    const Z_START = 30
    const Z_END = -230
    const SPREAD = 26 // xy radius of the field

    // --- Deep particle field (the tunnel you fly through) -------------------
    const COUNT = 900
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const cBlue = new THREE.Color(0x1453ff)
    const cCyan = new THREE.Color(0x19c6ff)
    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 0.7) * SPREAD
      const a = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.sin(a) * r * 0.7
      positions[i * 3 + 2] = Z_START - Math.random() * (Z_START - Z_END)
      const col = Math.random() > 0.5 ? cCyan : cBlue
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    const fieldGeo = new THREE.BufferGeometry()
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    fieldGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const fieldMat = new THREE.PointsMaterial({
      size: 1.5,
      map: glow,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    })
    world.add(new THREE.Points(fieldGeo, fieldMat))

    // --- Foreground node lattice (rich detail near the start) ---------------
    const latticeGroup = new THREE.Group()
    latticeGroup.position.z = 8
    world.add(latticeGroup)
    type LNode = { home: THREE.Vector3; sprite: THREE.Sprite; phase: number; base: number }
    const lnodes: LNode[] = []
    const COLS = 8
    const ROWS = 5
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const home = new THREE.Vector3(
          (c - (COLS - 1) / 2) * 3.6 + (Math.random() - 0.5) * 0.8,
          (r - (ROWS - 1) / 2) * 3.2 + (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 8,
        )
        const mat = new THREE.SpriteMaterial({
          map: glow,
          color: Math.random() > 0.5 ? 0x19c6ff : 0x4d7bff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const sprite = new THREE.Sprite(mat)
        sprite.position.copy(home)
        const base = 0.6 + Math.random() * 0.4
        sprite.scale.setScalar(base)
        latticeGroup.add(sprite)
        lnodes.push({ home: home.clone(), sprite, phase: (c + r) * 0.5, base })
      }
    }
    // Hairlines between near lattice neighbours.
    const linePairs: [number, number][] = []
    const linePos: number[] = []
    for (let i = 0; i < lnodes.length; i++) {
      for (let j = i + 1; j < lnodes.length; j++) {
        if (lnodes[i].home.distanceTo(lnodes[j].home) < 4.4) {
          linePairs.push([i, j])
          linePos.push(0, 0, 0, 0, 0, 0)
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    const lineAttr = new THREE.Float32BufferAttribute(linePos, 3)
    lineAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', lineAttr)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1453ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    latticeGroup.add(new THREE.LineSegments(lineGeo, lineMat))

    // --- Scroll + pointer state ---------------------------------------------
    let progress = 0 // eased 0..1
    let targetProgress = 0
    let velocity = 0
    let lastScroll = window.scrollY
    const pointer = new THREE.Vector2(0, 0)
    const smoothPointer = new THREE.Vector2(0, 0)

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      targetProgress = max > 0 ? window.scrollY / max : 0
    }
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    readScroll()
    window.addEventListener('scroll', readScroll, { passive: true })
    if (!reduceMotion) window.addEventListener('pointermove', onPointer)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h || 1
      camera.updateProjectionMatrix()
      readScroll()
    }
    resize()
    window.addEventListener('resize', resize)

    const tmp = new THREE.Vector3()
    let raf = 0
    const start = performance.now()
    const render = () => {
      const t = (performance.now() - start) / 1000

      // Ease scroll progress + track velocity.
      const sNow = window.scrollY
      velocity += ((sNow - lastScroll) - velocity) * 0.2
      lastScroll = sNow
      progress += (targetProgress - progress) * (reduceMotion ? 1 : 0.07)
      smoothPointer.lerp(pointer, 0.06)

      // Dolly the camera through the field as you scroll.
      camera.position.z = Z_START + (Z_END - Z_START + 60) * progress
      camera.position.x = smoothPointer.x * 4
      camera.position.y = smoothPointer.y * 3
      camera.lookAt(0, 0, camera.position.z - 20)

      // Scroll progress + velocity twist the world.
      world.rotation.z = progress * Math.PI * 0.5 + velocity * 0.004
      world.rotation.y = Math.sin(progress * 6) * 0.08 + smoothPointer.x * 0.05

      // Lattice breathing.
      for (const n of lnodes) {
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.5 + n.phase)
        tmp.copy(n.home)
        tmp.z += Math.sin(t * 0.8 + n.phase) * 0.4
        n.sprite.position.copy(tmp)
        n.sprite.scale.setScalar(n.base * (0.75 + breathe * 0.5))
        ;(n.sprite.material as THREE.SpriteMaterial).opacity = 0.4 + breathe * 0.5
      }
      const arr = lineAttr.array as Float32Array
      for (let k = 0; k < linePairs.length; k++) {
        const [i, j] = linePairs[k]
        const a = lnodes[i].sprite.position
        const b = lnodes[j].sprite.position
        const o = k * 6
        arr[o] = a.x; arr[o + 1] = a.y; arr[o + 2] = a.z
        arr[o + 3] = b.x; arr[o + 4] = b.y; arr[o + 5] = b.z
      }
      lineAttr.needsUpdate = true

      // Fade the near lattice out as we dolly past it.
      const latticeFade = Math.max(0, 1 - progress * 3)
      latticeGroup.visible = latticeFade > 0.01
      lineMat.opacity = 0.2 * latticeFade

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      fieldGeo.dispose()
      fieldMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      lnodes.forEach((n) => (n.sprite.material as THREE.SpriteMaterial).dispose())
      glow.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="scroll-scene" aria-hidden="true" />
}

function makeGlowTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(160,210,255,0.85)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}
