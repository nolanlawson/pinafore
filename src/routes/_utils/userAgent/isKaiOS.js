import { thunk } from '../thunk.js'

export const isKaiOS = thunk(() => process.browser && /KAIOS/.test(navigator.userAgent))
