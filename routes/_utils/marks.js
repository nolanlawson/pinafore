import { mark as markyMark, stop as markyStop } from 'marky'
import noop from 'lodash/noop'

const enableMarks = typeof window !== 'undefined' &&
  new URLSearchParams(location.search).get('marks') === 'true'

const mark = enableMarks ? markyMark : noop
const stop = enableMarks ? markyStop : noop

export {
  mark,
  stop
}