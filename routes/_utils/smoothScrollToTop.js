// via https://github.com/tootsuite/mastodon/blob/f59ed3a4fafab776b4eeb92f805dfe1fecc17ee3/app/javascript/mastodon/scroll.js
const easingOutQuint = (x, t, b, c, d) =>
  c * ((t = t / d - 1) * t * t * t * t + 1) + b

const scroll = (node, key, target) => {
  const startTime = Date.now()
  const offset = node[key]
  const gap = target - offset
  const duration = 1000
  let interrupt = false

  const step = () => {
    const elapsed = Date.now() - startTime
    const percentage = elapsed / duration

    if (interrupt) {
      return
    }

    if (percentage > 1) {
      cleanup()
      return
    }

    node[key] = easingOutQuint(0, elapsed, offset, gap, duration)
    requestAnimationFrame(step)
  }

  const cancel = () => {
    interrupt = true
    cleanup()
  }

  const cleanup = () => {
    node.removeEventListener('wheel', cancel)
    node.removeEventListener('touchstart', cancel)
  }

  node.addEventListener('wheel', cancel, { passive: true })
  node.addEventListener('touchstart', cancel, { passive: true })

  step()

  return cancel
}

export const smoothScrollToTop = node => scroll(node, 'scrollTop', 0)
