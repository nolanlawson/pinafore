// Promise-based implementation that waits a microtask tick
// and executes the resolve() functions in priority order
import { queueMicrotask } from './queueMicrotask'

export function createPriorityQueue () {
  const tasks = []

  function flush () {
    if (tasks.length) {
      const sortedTasks = tasks.sort((a, b) => a.priority < b.priority ? -1 : 1)
      for (const task of sortedTasks) {
        task.resolve()
      }
      tasks.length = 0
    }
  }

  return function next (priority) {
    return new Promise(resolve => {
      tasks.push({ priority, resolve })
      queueMicrotask(flush)
    })
  }
}
