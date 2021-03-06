import { importFocusVisible } from './asyncPolyfills'
import { supportsFocusVisible } from '../supportsFocusVisible'

export function loadNonCriticalPolyfills () {
  return Promise.all([
    !supportsFocusVisible() && importFocusVisible()
  ])
}
