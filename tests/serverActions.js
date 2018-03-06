import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
import { users } from './users'
global.fetch = fetch

export async function favoriteStatusAsAdmin (statusId) {
  return favoriteStatus('localhost:3000', users.admin.accessToken, statusId)
}
