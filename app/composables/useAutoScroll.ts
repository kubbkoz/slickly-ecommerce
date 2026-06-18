import type { Ref } from 'vue'

interface AutoScrollOptions {
  /** Milliseconds between auto-advances. Default 4000. */
  interval?: number
}

/**
 * Auto-advances a horizontally scrollable container one item at a time and
 * loops back to the start at the end. Designed for product/testimonial/blog
 * carousels.
 *
 * Pause behaviour:
 * - Desktop (mouse): pauses while hovered, resumes on mouse leave.
 * - Keyboard: pauses while focus is inside, resumes on focus out.
 * - Touch / mobile: the first tap, click or focus stops autoscroll for good —
 *   we never fight a user who has taken manual control.
 * - Only runs while the container is in the viewport (IntersectionObserver).
 * - Disabled entirely under prefers-reduced-motion.
 */
export function useAutoScroll(el: Ref<HTMLElement | null>, options: AutoScrollOptions = {}) {
  const interval = options.interval ?? 4000

  let timer: ReturnType<typeof setInterval> | null = null
  let visible = false
  let hovering = false
  let focused = false
  let stoppedByUser = false
  let cachedScrollAmount = 0

  function measureScrollAmount(node: HTMLElement) {
    const child = node.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(node).columnGap || '0') || 0
    cachedScrollAmount = child ? child.getBoundingClientRect().width + gap : node.clientWidth * 0.8
  }

  function tick() {
    const node = el.value
    if (!node || hovering || focused || stoppedByUser || !visible) return
    const max = node.scrollWidth - node.clientWidth
    if (node.scrollLeft >= max - 4) {
      node.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    if (!cachedScrollAmount) measureScrollAmount(node)
    node.scrollBy({ left: cachedScrollAmount, behavior: 'smooth' })
  }

  function start() {
    if (timer || stoppedByUser) return
    timer = setInterval(tick, interval)
  }
  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
  /** Permanent stop — used once a mobile user takes manual control. */
  function stopForGood() {
    stoppedByUser = true
    stop()
  }

  const onMouseEnter = () => (hovering = true)
  const onMouseLeave = () => (hovering = false)
  const onFocusIn = () => (focused = true)
  const onFocusOut = () => (focused = false)
  const onTouchStart = () => stopForGood()
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') stopForGood()
  }

  onMounted(() => {
    if (!import.meta.client) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const node = el.value
    if (!node) return

    node.addEventListener('mouseenter', onMouseEnter)
    node.addEventListener('mouseleave', onMouseLeave)
    node.addEventListener('focusin', onFocusIn)
    node.addEventListener('focusout', onFocusOut)
    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('pointerdown', onPointerDown, { passive: true })

    const ro = new ResizeObserver(() => { cachedScrollAmount = 0 })
    ro.observe(node)

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
      io.disconnect()
      ro.disconnect()
      node.removeEventListener('mouseenter', onMouseEnter)
      node.removeEventListener('mouseleave', onMouseLeave)
      node.removeEventListener('focusin', onFocusIn)
      node.removeEventListener('focusout', onFocusOut)
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('pointerdown', onPointerDown)
    })
  })
}
