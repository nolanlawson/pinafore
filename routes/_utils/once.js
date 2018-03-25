// svelte helper to add a .once() method similar to .on, but only fires once

export function once (eventName, callback) {
  let listener = this.on(eventName, eventValue => {
    listener.cancel()
    callback(eventValue)
  })
}
