import type { Ref } from 'vue'

interface AutoScrollOptions {
  /** Milliseconds between auto-advances. Default 4000. */
  interval?: number
  /** How long to stay paused after a user interaction (ms). Default 6000. */
  resumeDelay?: number
}

/**
 * Auto-advances a horizontally scrollable container one item at a time and
 * loops back to the start at the end. Designed for product/testimonial/blog
 * carousels.
 *
 * Behaviour:
 * - Pauses on hover, focus-within and touch; resumes after `resumeDelay`.
 * - Only runs while the container is in the viewport (IntersectionObserver).
 * - Disabled entirely when the user prefers reduced motion.
 */
export function useAutoScroll(el: Ref<HTMLElement | null>, options: AutoScrollOptions = {}) {
  const interval = options.interval ?? 4000
  const resumeDelay = options.resumeDelay ?? 6000

  let timer: ReturnType<typeof setInterval> | null = null
  let resumeTimer: ReturnType<typeof setTimeout> | null = null
  let paused = false
  let visible = false

  function step() {
    const node = el.value
    if (!node || paused || !visible) return
    const max = node.scrollWidth - node.clientWidth
    if (node.scrollLeft >= max - 4) {
      node.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    const child = node.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(node).columnGap || '0') || 0
    const amount = child ? child.getBoundingClientRect().width + gap : node.clientWidth * 0.8
    node.scrollBy({ left: amount, behavior: 'smooth' })
  }

  function start() {
    if (timer) return
    timer = setInterval(step, interval)
  }
  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    paused = true
    if (resumeTimer) {
      clearTimeout(resumeTimer)
      resumeTimer = null
    }
  }
  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      paused = false
    }, resumeDelay)
  }

  onMounted(() => {
    if (!import.meta.client) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const node = el.value
    if (!node) return

    node.addEventListener('pointerenter', pause)
    node.addEventListener('pointerleave', scheduleResume)
    node.addEventListener('focusin', pause)
    node.addEventListener('focusout', scheduleResume)
    node.addEventListener('touchstart', pause, { passive: true })
    node.addEventListener('touchend', scheduleResume, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting
          if (visible) start()
          else stop()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(node)

    onBeforeUnmount(() => {
      stop()
      if (resumeTimer) clearTimeout(resumeTimer)
      io.disconnect()
      node.removeEventListener('pointerenter', pause)
      node.removeEventListener('pointerleave', scheduleResume)
      node.removeEventListener('focusin', pause)
      node.removeEventListener('focusout', scheduleResume)
      node.removeEventListener('touchstart', pause)
      node.removeEventListener('touchend', scheduleResume)
    })
  })
}
