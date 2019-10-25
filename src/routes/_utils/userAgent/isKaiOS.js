import { thunk } from '../thunk'

export const isKaiOS = thunk(() => process.browser && /KAIOS/.test(navigator.userAgent))
