import { thunk } from '../thunk'

export const isWebKit = thunk(() => process.browser && typeof webkitIndexedDB !== 'undefined')
