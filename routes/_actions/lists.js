import { store } from '../_store/store'
import { database } from '../_database/database'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter } from '../_utils/sync'

export async function updateLists() {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await cacheFirstUpdateAfter(
    () => getLists(instanceName, accessToken),
    () => database.getLists(instanceName),
    lists => database.setLists(instanceName, lists),
    lists => {
      let instanceLists = store.get('instanceLists')
      instanceLists[instanceName] = lists
      store.set({instanceLists: instanceLists})
    }
  )
}