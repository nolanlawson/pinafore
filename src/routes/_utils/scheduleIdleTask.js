// Wrapper to call requestIdleCallback() to schedule low-priority work.
// See https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
// for a good breakdown of the concepts behind this.

import Queue from 'tiny-queue'
import { mark, stop } from './marks'

const taskQueue = new Queue()
let runningRequestIdleCallback = false

const liteRIC = cb => setTimeout(() => cb({timeRemaining: () => Infinity})) // eslint-disable-line

function getRIC () {
  // we load polyfills asynchronously, so there's a tiny chance this is not defined
  return typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : liteRIC
}

function getIsInputPending () {
  return process.browser && navigator.scheduling && navigator.scheduling.isInputPending
    ? () => navigator.scheduling.isInputPending()
    : () => false // just assume input is not pending on browsers that don't support this
}

const isInputPending = getIsInputPending()

function runTasks (deadline) {
  mark('scheduleIdleTask:runTasks()')
  // Bail out early if our deadline has passed (probably ~50ms) or if there is input pending
  // See https://web.dev/isinputpending/
  while (taskQueue.length && deadline.timeRemaining() > 0 && !isInputPending()) {
    const task = taskQueue.shift()
    try {
      task()
    } catch (e) {
      console.error(e)
    }
  }
  if (taskQueue.length) {
    const rIC = getRIC()
    rIC(runTasks)
  } else {
    runningRequestIdleCallback = false
  }
  stop('scheduleIdleTask:runTasks()')
}

export function scheduleIdleTask (task) {
  taskQueue.push(task)
  if (!runningRequestIdleCallback) {
    runningRequestIdleCallback = true
    const rIC = getRIC()
    rIC(runTasks)
  }
}
