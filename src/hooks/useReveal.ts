import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

type RevealOptions = {
  /** ms between each child's start — the Anime.js stagger feel. */
  stagger?: number
  /** distance in px the elements rise from. */
  y?: number
  /** delay before the whole group starts. */
  delay?: number
  /** run as soon as mounted instead of on scroll-in. */
  immediate?: boolean
}

/**
 * Staggered entrance reveal for any container's `[data-reveal]` children,
 * powered by Anime.js. Elements fade + rise in sequence when the container
 * scrolls into view (or immediately, for the hero). Honors reduced-motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  stagger: step = 90,
  y = 26,
  delay = 0,
  immediate = false,
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]'),
    )
    if (targets.length === 0) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      targets.forEach((el) => (el.style.opacity = '1'))
      return
    }

    // Hide before the reveal fires to avoid a flash of final state.
    targets.forEach((el) => {
      el.style.opacity = '0'
      el.style.willChange = 'transform, opacity'
    })

    const play = () => {
      animate(targets, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 850,
        delay: stagger(step, { start: delay }),
        ease: 'out(3)',
      })
    }

    if (immediate) {
      play()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [step, y, delay, immediate])

  return ref
}
