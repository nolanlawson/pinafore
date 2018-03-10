import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import { users } from './users'
import { postStatus } from '../routes/_api/statuses'

global.fetch = fetch
global.File = FileApi.File
global.FormData = FileApi.FormData

export async function favoriteStatusAsAdmin (statusId) {
  return favoriteStatus('localhost:3000', users.admin.accessToken, statusId)
}

export async function postAsAdmin (text) {
  return postStatus('localhost:3000', users.admin.accessToken, text,
    null, null, false, null, 'public')
}
