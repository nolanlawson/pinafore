import { scheduleRenderTask } from './scheduleRenderTask'

const tasks = new Map()
let toRender = []
let counter = -1

function doRenders () {
  if (!toRender.length) {
    return
  }
  toRender = toRender.sort((a, b) => (a < b ? -1 : 1))
  for (let handle of toRender) {
    let task = tasks.get(handle)
    scheduleRenderTask(task)
    tasks.delete(handle)
  }
  toRender = []
}

export function getRenderHandle () {
  return ++counter
}

export function queueRender (handle, task) {
  tasks.set(handle, task)
  toRender.push(handle)
  requestAnimationFrame(doRenders)
}
