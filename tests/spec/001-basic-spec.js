import { Selector as $ } from 'testcafe'
import { getUrl, logInToInstanceLink, settingsButton } from '../utils'

fixture`001-basic-spec.js`
  .page`http://localhost:4002`

test('has the correct <h1>', async t => {
  await t
    .expect($('.main-content h1').innerText).eql('Semaphore')
})

test('navigates to about', async t => {
  await t
    .click(settingsButton)
    .expect(getUrl()).contains('/settings')
    .click('a[href="/settings/about"]')
    .expect(getUrl()).contains('/about')
    .expect($('.main-content h1').innerText).eql('About Semaphore')
})

test('navigates to /settings/instances/add', async t => {
  await t.click(logInToInstanceLink)
    .expect(getUrl()).contains('/settings/instances/add')
})

test('navigates to settings/instances', async t => {
  await t.click(settingsButton)
    .expect(getUrl()).contains('/settings')
    .click($('a').withText('Instances'))
    .expect(getUrl()).contains('/settings/instances')
    .expect($('.main-content').innerText)
    .contains("You're not logged in to any instances")
})
