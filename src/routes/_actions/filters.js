import { store } from '../_store/store'
import { getFilters } from '../_api/filters'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync'
import { database } from '../_database/database'
import { isEqual } from 'lodash-es'

async function syncFilters (instanceName, syncMethod) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token

  await syncMethod(
    () => getFilters(instanceName, accessToken),
    () => database.getFilters(instanceName),
    filters => database.setFilters(instanceName, filters),
    filters => {
      const { instanceFilters } = store.get()
      if (!isEqual(instanceFilters[instanceName], filters)) { // avoid re-render if nothing changed
        instanceFilters[instanceName] = filters
        store.set({ instanceFilters })
      }
    }
  )
}

export async function updateFiltersForInstance (instanceName) {
  await syncFilters(instanceName, cacheFirstUpdateAfter)
}

export async function setupFiltersForInstance (instanceName) {
  await syncFilters(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}
