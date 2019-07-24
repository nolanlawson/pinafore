import { scheduleIdleTask } from './scheduleIdleTask'
import { store } from '../_store/store'

// Rough guess at whether this is a "mobile" device or not, for the purposes
// of "device class" estimations
const IS_MOBILE = process.browser && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android)/)

// Run a task that doesn't need to be processed immediately, but should
// probably be delayed if we're on a mobile device. Also run it sooner
// if we're in a hidden tab, since browsers throttle or don't run setTimeout/rAF/etc.
export function runMediumPriorityTask (fn) {
  if (store.get().pageVisibilityHidden) {
    fn()
  } else if (IS_MOBILE) {
    scheduleIdleTask(fn)
  } else {
    requestAnimationFrame(fn)
  }
}
