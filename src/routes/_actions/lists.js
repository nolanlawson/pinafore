import { store } from '../_store/store.js'
import { getLists } from '../_api/lists.js'
import { cacheFirstUpdateAfter } from '../_utils/sync.js'
import { database } from '../_database/database.js'

export async function updateListsForInstance (instanceName) {
  let { loggedInInstances } = store.get()
  let accessToken = loggedInInstances[instanceName].access_token

  await cacheFirstUpdateAfter(
    () => getLists(instanceName, accessToken),
    () => database.getLists(instanceName),
    lists => database.setLists(instanceName, lists),
    lists => {
      let { instanceLists } = store.get()
      instanceLists[instanceName] = lists
      store.set({ instanceLists: instanceLists })
    }
  )
}
