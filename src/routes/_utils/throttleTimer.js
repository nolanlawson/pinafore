// Sometimes we want to queue multiple requestAnimationFrames but only run the last one.
// It's tedious to do this using cancelAnimationFrame, so this is a utility to throttle
// a timer such that it only runs the last callback when it fires.

export const throttleTimer = timer => {
  let queuedCallback

  const flush = () => {
    const callback = queuedCallback
    queuedCallback = null
    callback()
  }

  return callback => {
    if (!queuedCallback) {
      timer(flush)
    }
    queuedCallback = callback
  }
}
