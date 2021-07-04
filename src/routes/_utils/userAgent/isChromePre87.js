import { isChrome } from './isChrome.js'
import { thunk } from '../thunk.js'

// https://caniuse.com/cookie-store-api
export const isChromePre87 = thunk(() => (process.browser && isChrome() && typeof cookieStore === 'undefined'))
