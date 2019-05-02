import { scheduleIdleTask } from './scheduleIdleTask'

const tasks = []

function binarySearchByPriority (arr, item) {
  let low = 0
  let high = arr.length
  let mid
  while (low < high) {
    mid = (low + high) >>> 1
    if (arr[mid].priority < item.priority) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}

// schedule an idle task, but give it a priority so that it executes in a particular order.
// lower integer == higher priority
export function scheduleIdlePriorityTask (priority, func) {
  let task = { priority, func }
  let idx = binarySearchByPriority(tasks, task)
  tasks.splice(idx, 0, task)
  let runNextTask = () => {
    let task = tasks.shift()
    if (task) {
      task.func()
      if (tasks.length) {
        scheduleIdleTask(runNextTask)
      }
    }
  }
  scheduleIdleTask(runNextTask)
}
