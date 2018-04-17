import { fetchAccount } from './fetchAccount'
import { ACCOUNT_ID, REBLOG_ID } from '../constants'

export function fetchStatus (statusesStore, accountsStore, id, callback) {
  statusesStore.get(id).onsuccess = e => {
    let status = e.target.result
    callback(status)
    fetchAccount(accountsStore, status[ACCOUNT_ID], account => {
      status.account = account
    })
    if (status[REBLOG_ID]) {
      fetchStatus(statusesStore, accountsStore, status[REBLOG_ID], reblog => {
        status.reblog = reblog
      })
    }
  }
}
