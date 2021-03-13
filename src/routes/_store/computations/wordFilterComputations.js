import { createRegexFromFilters } from '../../_utils/createRegexFromFilters'
import { WORD_FILTER_CONTEXTS } from '../../_static/wordFilters'

export function wordFilterComputations (store) {
  // unexpiredInstanceFilters is calculated based on `now` and `instanceFilters`,
  // but it's computed with observers rather than compute() to avoid excessive recalcs
  store.compute(
    'currentFilters',
    ['unexpiredInstanceFilters', 'currentInstance'],
    (unexpiredInstanceFilters, currentInstance) => unexpiredInstanceFilters[currentInstance] || []
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
