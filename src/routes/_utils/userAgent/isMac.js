import { thunk } from '../thunk'

export const isMac = thunk(() => process.browser && /mac/i.test(navigator.platform))
