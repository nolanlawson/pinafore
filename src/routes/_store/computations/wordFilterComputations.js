import { createRegexFromFilter } from '../../_utils/createRegexFromFilter'

export function wordFilterComputations (store) {
  // unexpiredInstanceFilters is calculated based on `now` and `instanceFilters`,
  // but it's computed with observers rather than compute() to avoid excessive recalcs
  store.compute(
    'currentFilters',
    ['unexpiredInstanceFilters', 'currentInstance'],
    (unexpiredInstanceFilters, currentInstance) => unexpiredInstanceFilters[currentInstance] || []
  )

  store.compute('unexpiredInstanceFiltersWithRegexes', ['unexpiredInstanceFilters'], unexpiredInstanceFilters => {
    return Object.fromEntries(Object.entries(unexpiredInstanceFilters).map(([instanceName, filters]) => {
      const filtersWithRegexes = filters.map(filter => ({
        ...filter,
        regex: createRegexFromFilter(filter)
      }))
      return [instanceName, filtersWithRegexes]
    }))
  })
}
