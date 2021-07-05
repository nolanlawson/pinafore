import { importFocusVisible } from './asyncPolyfills.js'
import { supportsFocusVisible } from '../supportsFocusVisible.js'

export function loadNonCriticalPolyfills () {
  return Promise.all([
    !supportsFocusVisible() && importFocusVisible()
  ])
}
