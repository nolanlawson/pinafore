// polyfill modeled after https://github.com/andrewiggins/afterframe
// see also https://github.com/WICG/requestPostAnimationFrame

function createRPAFPolyfill () {
  if (!process.browser) {
    return setTimeout
  }
  const channel = new MessageChannel()
  const callbacks = []

  channel.port1.onmessage = onMessage

  function runCallback (callback) {
    try {
      callback()
    } catch (e) {
      console.error(e)
    }
  }

  function onMessage () {
    for (const callback of callbacks) {
      runCallback(callback)
    }
    callbacks.length = 0
  }

  function postMessage () {
    channel.port2.postMessage(undefined)
  }

  return function rPAFPolyfill (callback) {
    if (callbacks.push(callback) === 1) {
      requestAnimationFrame(postMessage)
    }
  }
}

const rPAF = typeof requestPostAnimationFrame === 'function'
  ? requestPostAnimationFrame
  : createRPAFPolyfill()

export { rPAF as requestPostAnimationFrame }
