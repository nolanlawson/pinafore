export function thunk(fn) {
  let value
  let called
  return () => {
    if (!called) {
      value = fn()
      called = true
    }
    return value
  }
}