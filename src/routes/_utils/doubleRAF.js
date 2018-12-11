export function doubleRAF (fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}
