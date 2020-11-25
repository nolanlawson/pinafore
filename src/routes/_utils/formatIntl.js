import interpret from 'format-message-interpret'

const LOCALE = 'en-US' // TODO: make this configurable for i18n

export function formatIntl (ast, values) {
  return interpret(ast, LOCALE)(values).trim()
}
