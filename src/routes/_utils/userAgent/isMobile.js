import { thunk } from '../thunk'

export const isMobile = thunk(() => process.browser && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|KAIOS)/))
