import { Role } from 'testcafe'
import { authorizeInput, emailInput, getUrl, instanceInput, passwordInput } from './utils'

function login (t, username, password) {
  return t.typeText(instanceInput, 'localhost:3000', {paste: true})
    .pressKey('enter')
    .expect(getUrl()).eql('http://localhost:3000/auth/sign_in')
    .typeText(emailInput, username, {paste: true})
    .typeText(passwordInput, password, {paste: true})
    .pressKey('enter')
    .expect(getUrl()).contains('/oauth/authorize')
    .click(authorizeInput)
    .expect(getUrl()).eql('http://localhost:4002/', {timeout: 20000})
}

export const foobarRole = Role('http://localhost:4002/settings/instances/add', async t => {
  await login(t, 'foobar@localhost:3000', 'foobarfoobar')
})
