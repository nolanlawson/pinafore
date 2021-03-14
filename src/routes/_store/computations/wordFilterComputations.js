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

  store.compute('unexpiredInstanceFilterRegexes', ['unexpiredInstanceFilters'], unexpiredInstanceFilters => {
    return Object.fromEntries(Object.entries(unexpiredInstanceFilters).map(([instanceName, filters]) => {
      const contextsToRegex = Object.fromEntries(WORD_FILTER_CONTEXTS.map(context => {
        const filtersForThisContext = filters.filter(_ => _.context.includes(context))
        if (!filtersForThisContext.length) {
          return undefined // don't bother even adding it to the map
        }
        const regex = createRegexFromFilters(filtersForThisContext)
        return [context, regex]
      }).filter(Boolean))
      return [instanceName, contextsToRegex]
    }))
  })
}
