import {
  getUrl,
  scrollToStatus,
  getNthStatusSpoiler,
  settingsNavButton,
  generalSettingsButton,
  homeNavButton,
  getNthStatus,
  getNthShowOrHideButton
} from '../utils'
import { loginAsFoobar } from '../roles'
import { homeTimeline } from '../fixtures.js'
import { Selector as $ } from 'testcafe'

fixture`043-content-warnings.js`
  .page`http://localhost:4002`

test('Can set content warnings to auto-expand', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click($('#choice-show-all-spoilers'))
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).exists).ok()
  const idx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, idx + 1)
  await t
    .expect(getNthStatusSpoiler(1 + idx).innerText).contains('kitten CW')
    .expect(getNthStatus(1 + idx).innerText).contains('here\'s a kitten with a CW')
    .click(getNthShowOrHideButton(1 + idx))
    .expect(getNthStatus(1 + idx).innerText).notContains('here\'s a kitten with a CW')
    .click(getNthShowOrHideButton(1 + idx))
    .expect(getNthStatus(1 + idx).innerText).contains('here\'s a kitten with a CW')
})
