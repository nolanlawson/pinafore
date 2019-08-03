import { fetchAccount } from './fetchAccount'
import { ACCOUNT_ID, STATUS_ID } from '../constants'
import { fetchStatus } from './fetchStatus'

export function fetchNotification (notificationsStore, statusesStore, accountsStore, id, callback) {
  notificationsStore.get(id).onsuccess = e => {
    const notification = e.target.result
    callback(notification)
    fetchAccount(accountsStore, notification[ACCOUNT_ID], account => {
      notification.account = account
    })
    if (notification[STATUS_ID]) {
      fetchStatus(statusesStore, accountsStore, notification[STATUS_ID], status => {
        notification.status = status
      })
    }
  }
}
