import Queue from 'tiny-queue'

const tasks = new Queue()
let running = false

function runTasks () {
  if (!tasks.length) {
    running = false
    return
  }
  let task = tasks.shift()
  try {
    task()
  } catch (e) {
    console.error(e)
  }
  requestAnimationFrame(runTasks)
}

function requestRun () {
  if (running) {
    return
  }
  running = true
  requestAnimationFrame(runTasks)
}

export function scheduleRenderTask (task) {
  tasks.push(task)
  requestRun()
}
