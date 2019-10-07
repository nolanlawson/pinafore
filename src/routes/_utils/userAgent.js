import { thunk } from './thunk'

export const isKaiOS = thunk(() => process.browser && /KAIOS/.test(navigator.userAgent))

export const isIOS = thunk(() => process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent))

export const isMac = thunk(() => process.browser && /mac/i.test(navigator.platform))

// IntersectionObserver introduced in iOS 12.2 https://caniuse.com/#feat=intersectionobserver
export const isIOSPre12Point2 = thunk(() => process.browser && isIOS() &&
  !(typeof IntersectionObserver === 'function' &&
    IntersectionObserver.toString().includes('[native code]')))

// PointerEvent introduced in iOS 13 https://caniuse.com/#feat=pointer
export const isIOSPre13 = thunk(() => process.browser && isIOS() &&
  !(typeof PointerEvent === 'function' &&
    PointerEvent.toString().includes('[native code]')))

export const isMobile = thunk(() => process.browser && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|KAIOS)/))
