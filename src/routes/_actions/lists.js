import { store } from '../_store/store'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync'
import { database } from '../_database/database'

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
      store.set({ instanceLists: instanceLists })
    }
  )
}

export async function updateListsForInstance (instanceName) {
  await syncLists(instanceName, cacheFirstUpdateAfter)
}

export async function setupListsForInstance (instanceName) {
  await syncLists(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}
