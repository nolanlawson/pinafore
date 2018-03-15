import TinyQueue from 'tiny-queue'
let queue = new TinyQueue()

let running = false

function run() {
  if (queue.length) {
    queue.shift()()
    requestAnimationFrame(run)
  } else {
    running = false
  }
}

export function staggeredRequestAnimationFrame(fn) {
  queue.push(fn)
  if (!running) {
    running = true
    requestAnimationFrame(run)
  }
}