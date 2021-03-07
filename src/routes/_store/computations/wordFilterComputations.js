import { createRegexFromFilters } from '../../_utils/createRegexFromFilters'
import { WORD_FILTER_CONTEXTS } from '../../_static/wordFilters'

export function wordFilterComputations (store) {
  store.compute(
    'currentFilters',
    ['instanceFilters', 'currentInstance'],
    (instanceFilters, currentInstance) => instanceFilters[currentInstance] || []
  )

  store.compute('currentFilterRegexes', ['currentFilters'], currentFilters => {
    if (!currentFilters.length) {
      return null
    }
    const res = {}
    for (const filterType of WORD_FILTER_CONTEXTS) {
      res[filterType] = createRegexFromFilters(currentFilters.filter(_ => _.context.includes(filterType)))
    }
    return res
  })
}
