import { store } from '../_store/store'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import {
  getLists as getListsFromDatabase,
  setLists as setListsInDatabase
} from '../_database/meta'

export async function updateLists () {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await cacheFirstUpdateAfter(
    () => getLists(instanceName, accessToken),
    () => getListsFromDatabase(instanceName),
    lists => setListsInDatabase(instanceName, lists),
    lists => {
      let instanceLists = store.get('instanceLists')
      instanceLists[instanceName] = lists
      store.set({instanceLists: instanceLists})
    }
  )
}
