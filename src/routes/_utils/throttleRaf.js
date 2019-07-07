// ensure callback is only executed once per raf
export const throttleRaf = () => {
  let rafCallback
  let rafQueued

  return function throttledRaf (callback) {
    rafCallback = callback
    if (!rafQueued) {
      rafQueued = true
      requestAnimationFrame(() => {
        let cb = rafCallback
        rafCallback = null
        rafQueued = false
        cb()
      })
    }
  }
}
