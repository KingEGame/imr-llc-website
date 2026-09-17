import { useEffect, useRef } from 'react'
import './Cursor.css'

// A custom blended cursor: a precise dot plus a lerped trailing ring that
// swells over interactive elements — the creative-dev signature (à la
// guillaumegouessan.com). Desktop pointers only; hidden for touch / reduced-motion.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-custom-cursor')

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { x: mouse.x, y: mouse.y }
    let hovering = false
    let visible = false

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      const interactive = (e.target as HTMLElement)?.closest(
        'a, button, [role="tab"]',
      )
      hovering = Boolean(interactive)
      ring.classList.toggle('is-hover', hovering)
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', () => ring.classList.add('is-down'))
    window.addEventListener('pointerup', () => ring.classList.remove('is-down'))
    document.addEventListener('pointerleave', onLeave)

    let raf = 0
    const render = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16
      ringPos.y += (mouse.y - ringPos.y) * 0.16
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
