import {
  authorizeInput, emailInput, getUrl, instanceInput, mastodonLogInButton,
  passwordInput,
  sleep
} from './utils'
import { users } from './users'

async function login (t, username, password) {
  await sleep(500)
  await t.typeText(instanceInput, 'localhost:3000', {paste: true})
  await sleep(500)
  return t
    .pressKey('enter')
    .expect(getUrl()).eql('http://localhost:3000/auth/sign_in', {timeout: 30000})
    .typeText(emailInput, username, {paste: true})
    .typeText(passwordInput, password, {paste: true})
    .click(mastodonLogInButton)
    .expect(getUrl()).contains('/oauth/authorize')
    .click(authorizeInput)
    .expect(getUrl()).eql('http://localhost:4002/', {timeout: 30000})
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
  await t.navigateTo('/settings/instances/add')
  await login(t, users.foobar.email, users.foobar.password)
}

export async function loginAsLockedAccount (t) {
  await t.navigateTo('/settings/instances/add')
  await login(t, users.LockedAccount.email, users.LockedAccount.password)
}
