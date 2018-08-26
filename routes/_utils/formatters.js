let dateFormatter

export function getDateFormatter () {
  if (!dateFormatter) {
    dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return dateFormatter
}

let shortDateFormatter

export function getShortDateFormatter () {
  if (!shortDateFormatter) {
    shortDateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return shortDateFormatter
}
