// Someday we can maybe replace this with Intl.DurationFormat
// https://github.com/tc39/proposal-intl-duration-format

export const POLL_EXPIRY_OPTIONS = [
  {
    value: 300,
    label: 'intl.fiveMinutes'
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
    value: 86400,
    label: 'intl.oneDay'
  },
  {
    value: 259200,
    label: 'intl.threeDays'
  },
  {
    value: 604800,
    label: 'intl.sevenDays'
  }
]

export const POLL_EXPIRY_DEFAULT = 86400
