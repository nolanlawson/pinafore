import { thunk } from '../thunk'

export const isIOS = thunk(() => process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent))
