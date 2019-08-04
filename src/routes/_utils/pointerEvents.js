import { get } from './lodash-lite'

const hasPointerEvents = process.browser && typeof PointerEvent === 'function'

// Epiphany browser reports that it's a touch device even though it's not
const isTouchDevice = process.browser && 'ontouchstart' in document && !/Epiphany/.test(navigator.userAgent)

let pointerDown
let pointerUp
let pointerLeave
let pointerMove

function createEventListener (event) {
  return (node, callback) => {
    const listener = e => {
      // lightweight polyfill for clientX/clientY in pointer events,
      // which is slightly different in touch events
      if (typeof e.clientX !== 'number') {
        e.clientX = get(e, ['touches', 0, 'clientX'])
      }
      if (typeof e.clientY !== 'number') {
        e.clientY = get(e, ['touches', 0, 'clientY'])
      }
      callback(e)
    }

    node.addEventListener(event, listener)
    return {
      destroy () {
        node.removeEventListener(event, listener)
      }
    }
  }
}

if (hasPointerEvents) {
  pointerDown = createEventListener('pointerdown')
  pointerUp = createEventListener('pointerup')
  pointerLeave = createEventListener('pointerleave')
  pointerMove = createEventListener('pointermove')
} else if (isTouchDevice) {
  pointerDown = createEventListener('touchstart')
  pointerUp = createEventListener('touchend')
  pointerLeave = createEventListener('touchend')
  pointerMove = createEventListener('touchmove')
} else {
  pointerDown = createEventListener('mousedown')
  pointerUp = createEventListener('mouseup')
  pointerLeave = createEventListener('mouseleave')
  pointerMove = createEventListener('mousemove')
}

export { pointerDown, pointerUp, pointerLeave, pointerMove }
