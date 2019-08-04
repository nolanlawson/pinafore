import { requestPostAnimationFrame } from './requestPostAnimationFrame'

const throttle = (timer) => {
  return () => {
    let timerCallback

    return function throttledRaf (callback) {
      const timerQueued = !!timerCallback
      timerCallback = callback
      if (!timerQueued) {
        timer(() => {
          const cb = timerCallback
          timerCallback = null
          cb()
        })
      }
    }
  }
}

export const throttleRequestAnimationFrame = throttle(requestAnimationFrame)

export const throttleRequestPostAnimationFrame = throttle(requestPostAnimationFrame)
