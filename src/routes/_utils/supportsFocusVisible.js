import { thunk } from './thunk'
import { supportsSelector } from './supportsSelector'
import { isFirefoxPre88 } from './userAgent/isFirefoxPre88'

// Firefox pre-88 had a focus-visible bug:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
export const supportsFocusVisible = thunk(() => (!isFirefoxPre88() && supportsSelector(':focus-visible')))
