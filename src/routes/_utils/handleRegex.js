/* eslint-disable */
import { thunk } from './thunk'

export const handleRegex = thunk(() => /(^|[^\/\w])@(([a-z0-9_]+)@[a-z0-9\.\-]+[a-z0-9]+)/ig)
/* eslint-enable */
