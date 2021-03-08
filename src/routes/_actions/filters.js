import { store } from '../_store/store'
import { createFilter, getFilters, updateFilter, deleteFilter as doDeleteFilter } from '../_api/filters'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync'
import { database } from '../_database/database'
import { isEqual } from 'lodash-es'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { emit } from '../_utils/eventBus'

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

export async function createOrUpdateFilter (instanceName, filter) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token
  try {
    if (filter.id) {
      await updateFilter(instanceName, accessToken, filter)
      /* no await */ toast.say('intl.updatedFilter')
    } else {
      await createFilter(instanceName, accessToken, filter)
      /* no await */ toast.say('intl.createdFilter')
    }
    emit('wordFiltersChanged', instanceName)
  } catch (err) {
    /* no await */ toast.say(formatIntl('intl.failedToModifyFilter', err.message || ''))
  }
}

export async function deleteFilter (instanceName, id) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token
  try {
    await doDeleteFilter(instanceName, accessToken, id)
    /* no await */ toast.say('intl.deletedFilter')
    emit('wordFiltersChanged', instanceName)
  } catch (err) {
    /* no await */ toast.say(formatIntl('intl.failedToModifyFilter', err.message || ''))
  }
}
