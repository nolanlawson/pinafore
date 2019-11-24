import debounce from 'lodash-es/debounce'

const DEBOUNCE_DELAY = 700

const listeners = new Set()

if (process.browser) {
  window.__resizeListeners = listeners
}

if (process.browser) {
  window.addEventListener('resize', debounce(() => {
    console.log('resize')
    listeners.forEach(listener => listener())
  }, DEBOUNCE_DELAY))
}

export function registerResizeListener (listener) {
  listeners.add(listener)
}

export function unregisterResizeListener (listener) {
  listeners.delete(listener)
}
