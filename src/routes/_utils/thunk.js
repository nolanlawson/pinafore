export function thunk (func) {
  let cached
  let runOnce
  return () => {
    if (!runOnce) {
      cached = func()
      runOnce = true
    }
    return cached
  }
}
