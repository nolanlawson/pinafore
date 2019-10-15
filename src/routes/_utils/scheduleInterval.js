import { lifecycle } from './lifecycle'

/**
 * Schedule a callback, similar to setInterval but disables itself when the page is not active to save battery/CPU.
 * @param callback - callback to run
 * @param delay - how many milliseconds between callback calls
 * @param runOnActive - whether to run immediately when the page switches to an "active" state
 */
export function scheduleInterval (callback, delay, runOnActive) {
  let interval

  function startPolling () {
    interval = setInterval(callback, delay)
  }

  function stopPolling () {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function restartPolling () {
    stopPolling()
    if (runOnActive) {
      try {
        callback()
      } catch (e) {
        console.warn(e)
      }
    }
    startPolling()
  }

  if (process.browser) {
    startPolling()

    lifecycle.addEventListener('statechange', e => {
      if (e.newState === 'passive') {
        console.log('pausing interval...')
        stopPolling()
      } else if (e.newState === 'active') {
        console.log('restarting interval...')
        restartPolling()
      }
    })
  }
}
