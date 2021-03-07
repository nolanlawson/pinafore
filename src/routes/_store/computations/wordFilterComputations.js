import { createRegexFromFilters } from '../../_utils/createRegexFromFilters'

const FILTER_TYPES = ['home', 'notifications', 'public', 'thread', 'account']

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
    for (const filterType of FILTER_TYPES) {
      res[filterType] = createRegexFromFilters(currentFilters.filter(_ => _.context.includes(filterType)))
    }
    return res
  })
}
