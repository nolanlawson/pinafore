import { thunk } from '../thunk.js'

export const isChrome = thunk(() => process.browser && /Chrome/.test(navigator.userAgent))
