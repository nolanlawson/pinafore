import { LOCALE } from '../_static/intl'
import { thunk } from './thunk'

export const absoluteDateFormatter = thunk(() => new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}))

export const shortAbsoluteDateFormatter = thunk(() => new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}))

export const dayOnlyAbsoluteDateFormatter = thunk(() => new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}))
