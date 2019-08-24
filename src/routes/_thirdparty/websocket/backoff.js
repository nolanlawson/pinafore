const MAX_DELAY = 60000 // 60 seconds
const INITIAL_DELAY = 100

export class Backoff {
  constructor (onReady) {
    this.attempts = 0
    this.onReady = onReady
  }

  backoff () {
    const delay = this.fibonacci(++this.attempts)
    console.log('websocket delay', delay)
    setTimeout(this.onReady, delay)
  }

  fibonacci (attempt) {
    let current = 1

    if (attempt > current) {
      let prev = 1
      current = 2

      for (let index = 2; index < attempt; index++) {
        const next = prev + current
        prev = current
        current = next
      }
    }

    return Math.min(MAX_DELAY, Math.floor(Math.random() * current * INITIAL_DELAY))
  }

  reset () {
    this.attempts = 0
  }
}
