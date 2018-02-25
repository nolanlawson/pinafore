// Wrapper to call requestIdleCallback() to schedule low-priority work.
// See https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
// for a good breakdown of the concepts behind this.

import Queue from 'tiny-queue'
import { mark, stop } from './marks'

const taskQueue = new Queue()
let runningRequestIdleCallback = false

function runTasks (deadline) {
  mark('scheduleIdleTask:runTasks()')
  while (taskQueue.length && deadline.timeRemaining() > 0) {
    taskQueue.shift()()
  }
  if (taskQueue.length) {
    requestIdleCallback(runTasks)
  } else {
    runningRequestIdleCallback = false
  }
  stop('scheduleIdleTask:runTasks()')
}

export function scheduleIdleTask (task) {
  taskQueue.push(task)
  if (!runningRequestIdleCallback) {
    runningRequestIdleCallback = true
    requestIdleCallback(runTasks)
  }
}
