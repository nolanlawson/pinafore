import { thunk } from '../thunk'

export const isSafari = thunk(() => process.browser && /Safari/.test(navigator.userAgent) &&
  !/Chrome/.test(navigator.userAgent))
