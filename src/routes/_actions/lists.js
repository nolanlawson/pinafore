import { store } from '../_store/store'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'

export async function updateListsForInstance (instanceName) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token

  await cacheFirstUpdateAfter(
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
