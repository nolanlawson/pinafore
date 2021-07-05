// IntersectionObserver introduced in iOS 12.2 https://caniuse.com/#feat=intersectionobserver
import { thunk } from '../thunk.js'
import { isIOS } from './isIOS.js'

export const isIOSPre12Point2 = thunk(() => process.browser && isIOS() &&
  !(typeof IntersectionObserver === 'function' &&
    IntersectionObserver.toString().includes('[native code]')))
