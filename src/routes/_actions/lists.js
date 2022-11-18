import { store } from '../_store/store.js'
import { getLists } from '../_api/lists.js'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync.js'
import { database } from '../_database/database.js'

async function syncLists (instanceName, syncMethod) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token

  await syncMethod(
    () => getLists(instanceName, accessToken),
    () => database.getLists(instanceName),
    lists => database.setLists(instanceName, lists),
    lists => {
      const { instanceLists } = store.get()
      instanceLists[instanceName] = lists
      store.set({ instanceLists })
    }
  )
}

export async function updateListsForInstance (instanceName) {
  await syncLists(instanceName, cacheFirstUpdateAfter)
}

export async function setupListsForInstance (instanceName) {
  await syncLists(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}
