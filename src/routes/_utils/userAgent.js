// This file contains assorted user agent sniffing, which hopefully
// we can remove at some point.

function testUA (regex) {
  return process.browser && regex.test(navigator.userAgent)
}

// Rough guess at whether this is a "mobile" device or not, for the purposes
// of "device class" estimations
export const IS_MOBILE = testUA(/(?:iPhone|iPod|iPad|Android)/)

export const IS_FIREFOX = testUA(/Firefox/)

export const IS_IOS = testUA(/iP(?:hone|ad|od)/)

export const IS_IOS_PRE_12_2 = IS_IOS &&
  !(typeof IntersectionObserver === 'function' && IntersectionObserver.toString().includes('[native code]'))

export const IS_EDGEHTML = process.browser && 'StyleMedia' in window
