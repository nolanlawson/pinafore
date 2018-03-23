// Get the bounding client rect from an IntersectionObserver entry.
// This is to work around a bug in Chrome: https://crbug.com/737228

let hasBoundingRectBug

function rectsAreEqual (rectA, rectB) {
  return rectA.height === rectB.height &&
  rectA.top === rectB.top &&
  rectA.width === rectB.width &&
  rectA.bottom === rectB.bottom &&
  rectA.left === rectB.left &&
  rectA.right === rectB.right
}

export function getRectFromEntry (entry) {
  if (typeof hasBoundingRectBug !== 'boolean') {
    const boundingRect = entry.target.getBoundingClientRect()
    const observerRect = entry.boundingClientRect
    hasBoundingRectBug = !rectsAreEqual(boundingRect, observerRect)
  }
  return hasBoundingRectBug ? entry.target.getBoundingClientRect() : entry.boundingClientRect
}
