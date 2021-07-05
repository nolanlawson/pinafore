import { thunk } from '../thunk.js'

export const isWebKit = thunk(() => process.browser && typeof webkitIndexedDB !== 'undefined')
