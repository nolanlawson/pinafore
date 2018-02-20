import { Selector as $, Role } from 'testcafe'
import { addInstanceButton, getUrl, instanceInput } from './utils'

function login (t, username, password) {
  return t.typeText(instanceInput, 'localhost:3000')
    .click(addInstanceButton)
    .expect(getUrl()).eql('http://localhost:3000/auth/sign_in')
    .typeText($('input#user_email'), username)
    .typeText($('input#user_password'), password)
    .click($('button[type=submit]'))
    .expect(getUrl()).contains('/oauth/authorize')
    .click($('button[type=submit]:not(.negative)'))
    .expect(getUrl()).eql('http://localhost:4002/')
}

export const foobarRole = Role('http://localhost:4002/settings/instances/add', async t => {
  await login(t, 'foobar@localhost:3000', 'foobarfoobar')
})
