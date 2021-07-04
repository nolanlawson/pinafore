import { thunk } from './thunk.js'
import { supportsSelector } from './supportsSelector.js'
import { isFirefox } from './userAgent/isFirefox.js'

// Disabling for now in Firefox due to bugs:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
// https://bugzilla.mozilla.org/show_bug.cgi?id=1711057
export const supportsFocusVisible = thunk(() => (!isFirefox() && supportsSelector(':focus-visible')))
