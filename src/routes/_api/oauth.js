import { post, paramsString, WRITE_TIMEOUT } from '../_utils/ajax'
import { basename } from './utils'

const WEBSITE = 'https://pinafore.social'
const SCOPES = 'read write follow push'
const CLIENT_NAME = 'Pinafore'

export function registerApplication (instanceName, redirectUri) {
  const url = `${basename(instanceName)}/api/v1/apps`
  return post(url, {
    client_name: CLIENT_NAME,
    redirect_uris: redirectUri,
    scopes: SCOPES,
    website: WEBSITE
  }, null, { timeout: WRITE_TIMEOUT })
}

export function generateAuthLink (instanceName, clientId, redirectUri) {
  const params = paramsString({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES
  })
  return `${basename(instanceName)}/oauth/authorize?${params}`
}

export function getAccessTokenFromAuthCode (instanceName, clientId, clientSecret, code, redirectUri) {
  const url = `${basename(instanceName)}/oauth/token`
  return post(url, {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code: code
  }, null, { timeout: WRITE_TIMEOUT })
}
