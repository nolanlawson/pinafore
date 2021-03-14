import { createSearchIndexFromStatusOrNotification } from './createSearchIndexFromStatusOrNotification'
import { uniq } from 'lodash-es'

export function computeFilterContextsForStatusOrNotification (statusOrNotification, filtersWithRegexes) {
  if (!filtersWithRegexes || !filtersWithRegexes.length) {
    // avoid computing the search index, just bail out
    return undefined
  }
  // the searchIndex is really just a string of text
  const searchIndex = createSearchIndexFromStatusOrNotification(statusOrNotification)
  const res = filtersWithRegexes && uniq(filtersWithRegexes
    .filter(({ regex }) => regex.test(searchIndex))
    .map(_ => _.context)
    .flat())

  // return undefined instead of a new array to reduce memory usage of TimelineSummary
  return (res && res.length) ? res : undefined
}
