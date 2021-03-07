export const WORD_FILTER_CONTEXT_HOME = 'home'
export const WORD_FILTER_CONTEXT_NOTIFICATIONS = 'notifications'
export const WORD_FILTER_CONTEXT_PUBLIC = 'public'
export const WORD_FILTER_CONTEXT_THREAD = 'thread'
export const WORD_FILTER_CONTEXT_ACCOUNT = 'account'

export const WORD_FILTER_CONTEXTS = [
  WORD_FILTER_CONTEXT_HOME,
  WORD_FILTER_CONTEXT_NOTIFICATIONS,
  WORD_FILTER_CONTEXT_PUBLIC,
  WORD_FILTER_CONTEXT_THREAD,
  WORD_FILTER_CONTEXT_ACCOUNT
]

// Someday we can maybe replace this with Intl.DurationFormat
// https://github.com/tc39/proposal-intl-duration-format
export const WORD_FILTER_EXPIRY_OPTIONS = [
  {
    value: 0,
    label: 'intl.never'
  },
  {
    value: 1800,
    label: 'intl.thirtyMinutes'
  },
  {
    value: 3600,
    label: 'intl.oneHour'
  },
  {
    value: 21600,
    label: 'intl.sixHours'
  },
  {
    value: 43200,
    label: 'intl.twelveHours'
  },
  {
    value: 86400,
    label: 'intl.oneDay'
  },
  {
    value: 604800,
    label: 'intl.sevenDays'
  }
]

export const WORD_FILTER_EXPIRY_DEFAULT = 0
