// via https://github.com/tootsuite/mastodon/blob/f59ed3a4fafab776b4eeb92f805dfe1fecc17ee3/app/javascript/mastodon/scroll.js
const easingOutQuint = (x, t, b, c, d) =>
  c * ((t = t / d - 1) * t * t * t * t + 1) + b

function smoothScrollPolyfill (node, key, target) {
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

function testSupportsSmoothScroll () {
  let supports = false
  try {
    let div = document.createElement('div')
    div.scrollTo({
      top: 0,
      get behavior () {
        supports = true
        return 'smooth'
      }
    })
  } catch (err) {} // Edge throws an error
  return supports
}

const smoothScrollSupported = process.browser && testSupportsSmoothScroll()

export function smoothScrollToTop (node) {
  if (smoothScrollSupported) {
    console.log('using native smooth scroll')
    return node.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    console.log('using polyfilled smooth scroll')
    return smoothScrollPolyfill(node, 'scrollTop', 0)
  }
}
