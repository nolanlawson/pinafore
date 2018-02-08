import { store } from '../../_store/store'
import pAny from 'p-any'
import { database } from '../../_database/database'
import { getLists } from '../../_api/lists'

export async function fetchLists() {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let lists = await pAny([
    getLists(instanceName, accessToken).then(lists => {
      /* no await */ database.setLists(instanceName, lists)
      return lists
    }),
    database.getLists(instanceName)
  ])
  let instanceLists = store.get('instanceLists')
  instanceLists[instanceName] = lists
  store.set({instanceLists: instanceLists})
}