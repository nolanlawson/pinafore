import { thunk } from '../thunk.js'

export const isMac = thunk(() => process.browser && /mac/i.test(navigator.platform))
