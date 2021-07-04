// For convenience, periodically re-compute the current time. This ensures freshness of
// displays like "x minutes ago" without having to jump through a lot of hoops.
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask.js'
import { scheduleInterval } from '../../_utils/scheduleInterval.js'

const POLL_INTERVAL = 10000

export function nowObservers (store) {
  function updateNow () {
    store.set({ now: Date.now() })
  }

  function updateNowLazily () {
    scheduleIdleTask(updateNow)
  }

  updateNow()

  scheduleInterval(updateNowLazily, POLL_INTERVAL, /* runOnActive */ true)
}
