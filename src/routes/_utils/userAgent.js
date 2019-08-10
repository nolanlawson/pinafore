// User agent sniffing which we should probably feel bad about. But at least it's all centralized in one place

import { thunk } from './thunk'

export const isIOS = thunk(() => process.browser && CSS.supports('-webkit-overflow-scrolling', 'touch'))

export const isFirefox = thunk(() => process.browser && 'InstallTrigger' in window)

export const isEdgeHTML = thunk(() => process.browser && 'StyleMedia' in window)

export const isMobile = thunk(() => process.browser && /(?:Android|iP(?:hone|ad|od))/.test(navigator.userAgent))

export const isGnomeWeb = thunk(() => process.browser && /Epiphany/.test(navigator.userAgent))
