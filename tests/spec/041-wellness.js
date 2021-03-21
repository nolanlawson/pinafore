import {
  settingsNavButton,
  homeNavButton,
  getFirstVisibleStatus,
  getUrl,
  disableRelativeTimestamps, getNthStatus, getNthStatusRelativeDate
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`041-wellness.js`
  .page`http://localhost:4002`

test('Can disable relative time stamps', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getFirstVisibleStatus().exists).ok()
    .expect(getNthStatusRelativeDate(1).innerText).match(/\bago\b/i)
    .click(settingsNavButton)
    .click($('a').withText('Wellness'))
    .click(disableRelativeTimestamps)
    .expect(disableRelativeTimestamps.checked).ok()
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getFirstVisibleStatus().exists).ok()
    .expect(getNthStatusRelativeDate(1).innerText).notMatch(/\bago\b/i)
    .expect(getNthStatus(1).getAttribute('aria-label')).notMatch(/\bago\b/i)
})
