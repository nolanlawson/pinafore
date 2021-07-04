// Avoid re-renders by caching the most recent value of an array
// or an object, using an approach similar to https://github.com/reactjs/reselect.
// This avoids the issue where Svelte may keep re-rendering because it doesn't
// know if an object/array has changed or not.

import { isEqual } from '../_thirdparty/lodash/objects.js'

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.reselectStats = {}
}

export function reselect (store, outputKey, inputKey) {
  let prevValue
  let nextValue
  let count = 0
  const countKey = `${outputKey}_reselectCount`

  store.compute(countKey, [inputKey], input => {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.reselectStats[inputKey] = window.reselectStats[inputKey] || { numInputChanges: 0, numOutputChanges: 0 }
      window.reselectStats[inputKey].numInputChanges++
    }
    if (!isEqual(prevValue, input)) {
      nextValue = input
      count++
    }
    return count
  })

  store.compute(outputKey, [countKey], () => {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.reselectStats[inputKey].numOutputChanges++
    }
    prevValue = nextValue
    nextValue = null
    return prevValue
  })
}
