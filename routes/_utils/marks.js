import noop from 'lodash/noop'

const enableMarks = process.browser &&
  performance.mark &&
  (process.env.NODE_ENV !== 'production' ||
  new URLSearchParams(location.search).get('marks') === 'true')

const perf = process.browser && performance

function doMark(name) {
  perf.mark(`start ${name}`)
}

function doStop(name) {
  perf.mark(`end ${name}`)
  perf.measure(name, `start ${name}`, `end ${name}`)
}

const mark = enableMarks ? doMark : noop
const stop = enableMarks ? doStop : noop

export {
  mark,
  stop
}
