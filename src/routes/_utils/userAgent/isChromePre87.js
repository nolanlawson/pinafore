import { isChrome } from './isChrome'
import { thunk } from '../thunk'

// https://caniuse.com/cookie-store-api
export const isChromePre87 = thunk(() => (process.browser && isChrome() && typeof cookieStore === 'undefined'))
