// For convenience, periodically re-compute the current time. This ensures freshness of
// displays like "x minutes ago" without having to jump through a lot of hoops.
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'

const POLL_INTERVAL = 10000

export function nowObservers (store) {
  let interval

  function updateNow () {
    store.set({ now: Date.now() })
  }

  function startPolling () {
    interval = setInterval(() => scheduleIdleTask(updateNow), POLL_INTERVAL)
  }

  function stopPolling () {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function restartPolling () {
    stopPolling()
    scheduleIdleTask(updateNow)
    startPolling()
  }

  updateNow()

  if (process.browser) {
    startPolling()

    lifecycle.addEventListener('statechange', e => {
      if (e.newState === 'passive') {
        console.log('stopping Date.now() observer...')
        stopPolling()
      } else if (e.newState === 'active') {
        console.log('restarting Date.now() observer...')
        restartPolling()
      }
    })
  }
}
