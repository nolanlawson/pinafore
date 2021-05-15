import { thunk } from './thunk'
import { supportsSelector } from './supportsSelector'
import { isFirefox } from './userAgent/isFirefox'

// Disabling for now in Firefox due to bugs:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
// https://bugzilla.mozilla.org/show_bug.cgi?id=1711057
export const supportsFocusVisible = thunk(() => (!isFirefox() && supportsSelector(':focus-visible')))
