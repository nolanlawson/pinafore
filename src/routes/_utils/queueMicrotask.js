// via https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask
function queueMicrotaskPolyfill (callback) {
  Promise.resolve()
    .then(callback)
    .catch(e => setTimeout(() => { throw e }))
}

const qM = typeof queueMicrotask === 'function' ? queueMicrotask : queueMicrotaskPolyfill

export {
  qM as queueMicrotask
}
