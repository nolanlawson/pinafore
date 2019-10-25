// We name this __thunk__ so that we can tell terser that it's a pure function, without possibly
// affecting third-party libraries that may also be using a function called "thunk".
export function __thunk__ (func) {
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
