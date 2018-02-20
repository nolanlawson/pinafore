import { Selector as $ } from 'testcafe'
import { getUrl, settingsButton } from '../utils'

fixture `01-basic-spec.js`
  .page `http://localhost:4002`

test('has the correct <h1>', async t => {
  await t
    .expect($('.container h1').innerText).eql('Pinafore')
})

test('navigates to about', async t => {
  await t
    .click(settingsButton)
    .expect(getUrl()).contains('/settings')
    .click('a[href="/settings/about"]')
    .expect(getUrl()).contains('/about')
    .expect($('.container h1').innerText).eql('About Pinafore')
})

test('navigates to /settings/instances/add', async t => {
  await t.click($('a').withText('log in to an instance'))
    .expect(getUrl()).contains('/settings/instances/add')
})

test('navigates to settings/instances', async t => {
  await t.click(settingsButton)
    .expect(getUrl()).contains('/settings')
    .click($('a').withText('Instances'))
    .expect(getUrl()).contains('/settings/instances')
    .expect($('.container').innerText)
      .contains("You're not logged in to any instances")
})