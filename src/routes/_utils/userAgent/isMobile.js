import { thunk } from '../thunk.js'

export const isMobile = thunk(() => process.browser && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|KAIOS)/))
