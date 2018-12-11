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

function runTasks (deadline) {
  mark('scheduleIdleTask:runTasks()')
  while (taskQueue.length && deadline.timeRemaining() > 0) {
    let task = taskQueue.shift()
    try {
      task()
    } catch (e) {
      console.error(e)
    }
  }
  if (taskQueue.length) {
    let rIC = getRIC()
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
    let rIC = getRIC()
    rIC(runTasks)
  }
}
