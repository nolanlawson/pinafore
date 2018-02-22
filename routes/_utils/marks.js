import { thunk } from './thunk'

// Lazily invoke because URLSearchParams isn't supported in Edge 16,
// so we need the polyfill.
const enabled = thunk(() => process.browser &&
  performance.mark &&
  (
    process.env.NODE_ENV !== 'production' ||
    new URLSearchParams(location.search).get('marks') === 'true'
  )
)

const perf = process.browser && performance

export function mark(name) {
  if (enabled()) {
    perf.mark(`start ${name}`)
  }
}

export function stop(name) {
  if (enabled()) {
    perf.mark(`end ${name}`)
    perf.measure(name, `start ${name}`, `end ${name}`)
  }
}