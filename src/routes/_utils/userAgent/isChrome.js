import { thunk } from '../thunk'

export const isChrome = thunk(() => process.browser && /Chrome/.test(navigator.userAgent))
