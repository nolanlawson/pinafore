import {
  importIntersectionObserver,
  importRequestIdleCallback,
  importWebAnimationPolyfill
} from './asyncModules'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !Element.prototype.animate && importWebAnimationPolyfill()
  ])
}
