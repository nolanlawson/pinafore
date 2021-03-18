import { thunk } from './thunk'
import { supportsSelector } from './supportsSelector'
import { isFirefox } from './userAgent/isFirefox'

// TODO: remove the Firefox check once this bug is fixed
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
export const supportsFocusVisible = thunk(() => (!isFirefox() && supportsSelector(':focus-visible')))
