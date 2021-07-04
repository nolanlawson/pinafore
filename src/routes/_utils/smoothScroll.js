import { store } from '../_store/store.js'
import { isChrome } from './userAgent/isChrome.js'

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
    const div = document.createElement('div')
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

export const hasNativeSmoothScroll = process.browser && testSupportsSmoothScroll()

export function smoothScroll (node, topOrLeft, horizontal, preferFast) {
  if (store.get().reduceMotion) {
    console.log('smooth scroll: disabled')
    // Don't do smooth-scroll at all for users who prefer reduced motion.
    node[horizontal ? 'scrollLeft' : 'scrollTop'] = topOrLeft
  } else if (hasNativeSmoothScroll && !(preferFast && isChrome())) {
    // In some cases (e.g. scrolling to the top of the timeline), Chrome can take a really long time
    // in their native smooth scroll implementation. If preferFast is true, just use the polyfill
    // so we can control how long it takes.
    console.log('smooth scroll: using native')
    return node.scrollTo({
      [horizontal ? 'left' : 'top']: topOrLeft,
      behavior: 'smooth'
    })
  } else {
    console.log('smooth scroll: using polyfill')
    return smoothScrollPolyfill(node, horizontal ? 'scrollLeft' : 'scrollTop', topOrLeft)
  }
}
