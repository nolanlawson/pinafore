import { mark as markyMark, stop as markyStop } from 'marky'
import noop from 'lodash/noop'

const enableMarks = process.browser &&
  (process.env.NODE_ENV !== 'production' ||
  new URLSearchParams(location.search).get('marks') === 'true')

const mark = enableMarks ? markyMark : noop
const stop = enableMarks ? markyStop : noop

export {
  mark,
  stop
}
