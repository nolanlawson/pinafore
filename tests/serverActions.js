import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
global.fetch = fetch

const accessToken = 'a306d698185db24b12385a5432817551d7ac94bdcbe23233d4e5eff70f6408c4'

export async function favoriteStatusAsAdmin (statusId) {
  return favoriteStatus('localhost:3000', accessToken, statusId)
}
