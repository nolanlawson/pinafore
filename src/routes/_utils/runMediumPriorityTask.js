import { scheduleIdleTask } from './scheduleIdleTask'
import { store } from '../_store/store'
import { IS_MOBILE } from './userAgent'

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
