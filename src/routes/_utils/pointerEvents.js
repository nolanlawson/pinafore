const hasPointerEvents = process.browser && typeof PointerEvent === 'function'
const isTouchDevice = 'ontouchstart' in document

let pointerDown
let pointerUp
let pointerLeave
let pointerMove

function createEventListener (event) {
  return (node, callback) => {
    node.addEventListener(event, callback)
    return {
      destroy () {
        node.removeEventListener(event, callback)
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

export { hasPointerEvents, pointerDown, pointerUp, pointerLeave, pointerMove }
