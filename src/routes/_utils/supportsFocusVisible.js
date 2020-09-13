import { thunk } from './thunk'
import { supportsSelector } from './supportsSelector'

export const supportsFocusVisible = thunk(() => supportsSelector(':focus-visible'))
