import { supportsSelector } from './supportsSelector'
import { importFocusVisible } from './asyncPolyfills'

export function loadNonCriticalPolyfills () {
  return Promise.all([
    !supportsSelector(':focus-visible') && importFocusVisible()
  ])
}
