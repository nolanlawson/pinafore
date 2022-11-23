import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'
import { getAccount } from '../_api/user.js'


export async function getFollows (instanceName, accessToken, accountId, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/following`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function lookup (instanceName, accountName) {
  let url = `${basename(instanceName)}/api/v1/accounts/lookup?acct=${accountName}`
  return get(url, { timeout: DEFAULT_TIMEOUT })
}

export async function getFollowers (instanceName, accessToken, accountId, limit = 80) {
  return getAccount(instanceName, accessToken, accountId).then(account => {
    let [accountName, remoteInstanceName] = account.acct.split('@');

    return lookup(remoteInstanceName, accountName).then(remoteAccount => {
      let url = `${basename(remoteInstanceName)}/api/v1/accounts/${remoteAccount.id}/followers`
      url += '?' + paramsString({ limit })
      return get(url, { timeout: DEFAULT_TIMEOUT })
    });
});


}
