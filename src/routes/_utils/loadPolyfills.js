import {
  importRequestIdleCallback
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback()
  ])
}
