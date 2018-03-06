import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
global.fetch = fetch

import { users } from './users'

export async function favoriteStatusAsAdmin (statusId) {
  return favoriteStatus('localhost:3000', users.admin.accessToken, statusId)
}
