import { Role } from 'testcafe'
import {
  addInstanceButton,
  authorizeInput, emailInput, getUrl, instanceInput, mastodonLogInButton,
  passwordInput
} from './utils'

function login (t, username, password) {
  return t.typeText(instanceInput, 'localhost:3000', {paste: true})
    .click(addInstanceButton)
    .expect(getUrl()).eql('http://localhost:3000/auth/sign_in', {timeout: 30000})
    .typeText(emailInput, username, {paste: true})
    .typeText(passwordInput, password, {paste: true})
    .click(mastodonLogInButton)
    .expect(getUrl()).contains('/oauth/authorize')
    .click(authorizeInput)
    .expect(getUrl()).eql('http://localhost:4002/', {timeout: 30000})
}

export const foobarRole = Role('http://localhost:4002/settings/instances/add', async t => {
  await login(t, 'foobar@localhost:3000', 'foobarfoobar')
})
