// Sometimes we want to queue multiple requestAnimationFrames but only run the last one.
// It's tedious to do this using cancelAnimationFrame, so this is a utility to throttle
// a timer such that it only runs the last callback when it fires.

import { requestPostAnimationFrame } from './requestPostAnimationFrame'
import { scheduleIdleTask } from './scheduleIdleTask'

const throttle = (timer) => {
  return () => {
    let queuedCallback

    return function throttledRaf (callback) {
      const alreadyQueued = !!queuedCallback
      queuedCallback = callback
      if (!alreadyQueued) {
        timer(() => {
          const cb = queuedCallback
          queuedCallback = null
          cb()
        })
      }
    }
  }
}

export const throttleRequestAnimationFrame = throttle(requestAnimationFrame)
export const throttleRequestPostAnimationFrame = throttle(requestPostAnimationFrame)
export const throttleScheduleIdleTask = throttle(scheduleIdleTask)
