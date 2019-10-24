import { __thunk__ } from './thunk'

export const isKaiOS = __thunk__(() => process.browser && /KAIOS/.test(navigator.userAgent))

export const isIOS = __thunk__(() => process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent))

export const isMac = __thunk__(() => process.browser && /mac/i.test(navigator.platform))

// IntersectionObserver introduced in iOS 12.2 https://caniuse.com/#feat=intersectionobserver
export const isIOSPre12Point2 = __thunk__(() => process.browser && isIOS() &&
  !(typeof IntersectionObserver === 'function' &&
    IntersectionObserver.toString().includes('[native code]')))

// PointerEvent introduced in iOS 13 https://caniuse.com/#feat=pointer
export const isIOSPre13 = __thunk__(() => process.browser && isIOS() &&
  !(typeof PointerEvent === 'function' &&
    PointerEvent.toString().includes('[native code]')))

export const isMobile = __thunk__(() => process.browser && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|KAIOS)/))

export const isSafari = __thunk__(() => process.browser && /Safari/.test(navigator.userAgent) &&
  !/Chrome/.test(navigator.userAgent))

export const isChrome = __thunk__(() => process.browser && /Chrome/.test(navigator.userAgent))
