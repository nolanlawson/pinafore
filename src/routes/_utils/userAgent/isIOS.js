import { thunk } from '../thunk.js'

export const isIOS = thunk(() => process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent))
