// PointerEvent introduced in iOS 13 https://caniuse.com/#feat=pointer
import { thunk } from '../thunk'
import { isIOS } from '../userAgent/isIOS'

export const isIOSPre13 = thunk(() => process.browser && isIOS() &&
  !(typeof PointerEvent === 'function' &&
    PointerEvent.toString().includes('[native code]')))
