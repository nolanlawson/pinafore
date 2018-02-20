import { Selector as $ } from 'testcafe'
import { addInstanceButton, getUrl, instanceInput, login, settingsButton } from '../utils'
import { foobarRole } from '../roles'

fixture `02-login-spec.js`
  .page `http://localhost:4002`

const formError = $('.form-error')

test('Cannot log in to a fake instance', async t => {
  await t.click($('a').withText('log in to an instance'))
    .expect(getUrl()).contains('/settings/instances/add')
    .typeText(instanceInput, 'fake.nolanlawson.com')
    .click(addInstanceButton)
    .expect(formError.exists).ok()
    .expect(formError.innerText).contains('Is this a valid Mastodon instance?')
    .typeText(instanceInput, '.biz')
    .expect(formError.exists).notOk()
    .typeText(instanceInput, 'fake.nolanlawson.com', {replace: true})
    .expect(formError.exists).ok()
    .expect(formError.innerText).contains('Is this a valid Mastodon instance?')
})

test('Logs in to localhost:3000', async t => {
  await t.useRole(foobarRole)
    .expect($('article.status-article').exists).ok()
})

test('Logs out', async t => {
  await t.useRole(foobarRole)
    .click(settingsButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .expect(getUrl()).contains('/settings/instances/localhost:3000')
    .click($('button').withText('Log out'))
    .click($('#modal-dialog button').withText('OK'))
    .expect($('.container').innerText)
    .contains("You're not logged in to any instances")
})