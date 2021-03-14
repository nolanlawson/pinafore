import { getUrl } from './utils'
import { users } from './users'

// quick login using a secret page and a known access token (makes tests run faster)
async function login (t, user) {
  await t.navigateTo(`/?instanceName=localhost:3000&accessToken=${user.accessToken}`)
    .expect(getUrl()).eql('http://localhost:4002/', { timeout: 30000 })
}

// roles appear not to be working anymore :(
// export const foobarRole = Role('http://localhost:4002/settings/instances/add', async t => {
//   await login(t, users.foobar.email, users.foobar.password)
// })
//
// export const lockedAccountRole = Role('http://localhost:4002/settings/instances/add', async t => {
//   await login(t, users.LockedAccount.email, users.LockedAccount.password)
// })

export async function loginAsFoobar (t) {
  await login(t, users.foobar)
}

export async function loginAsLockedAccount (t) {
  await login(t, users.LockedAccount)
}
