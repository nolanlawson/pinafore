import { thunk } from './thunk.js'
import { supportsSelector } from './supportsSelector.js'
import { isFirefoxPre90 } from './userAgent/isFirefoxPre90.js'

// Disabling in Firefox <90 due to bugs:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
// https://bugzilla.mozilla.org/show_bug.cgi?id=1711057
export const supportsFocusVisible = thunk(() => (!isFirefoxPre90() && supportsSelector(':focus-visible')))
