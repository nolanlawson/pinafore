import { store } from '../_store/store'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import {
  getLists as getListsFromDatabase,
  setLists as setListsInDatabase
} from '../_database/meta'

export async function updateLists () {
  let { currentInstance, accessToken } = store.get()

  await cacheFirstUpdateAfter(
    () => getLists(currentInstance, accessToken),
    () => getListsFromDatabase(currentInstance),
    lists => setListsInDatabase(currentInstance, lists),
    lists => {
      let { instanceLists } = store.get()
      instanceLists[currentInstance] = lists
      store.set({instanceLists: instanceLists})
    }
  )
}
