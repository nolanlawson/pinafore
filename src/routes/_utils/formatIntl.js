import interpret from 'format-message-interpret'
import { LOCALE } from '../_static/intl'

export function formatIntl (ast, values) {
  return interpret(ast, LOCALE)(values).trim()
}
