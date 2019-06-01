import {
  settingsNavButton,
  homeNavButton,
  disableUnreadNotifications,
  getFirstVisibleStatus,
  getUrl,
  notificationsNavButton, getTitleText, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { postAs } from '../serverActions'

fixture`129-wellness.js`
  .page`http://localhost:4002`

test('Can disable unread notification counts', async t => {
  await loginAsFoobar(t)
  await t.click(settingsNavButton)
    .click($('a').withText('Wellness'))
    .click(disableUnreadNotifications)
    .expect(disableUnreadNotifications.checked).ok()
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getFirstVisibleStatus().exists).ok()
  await postAs('admin', 'hey @foobar')
  await sleep(2000)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
    .expect(getTitleText()).notContains('(1)')
    .click(settingsNavButton)
    .click($('a').withText('Wellness'))
    .click(disableUnreadNotifications)
    .expect(disableUnreadNotifications.checked).notOk()
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1 notification)')
    .expect(getTitleText()).contains('(1)')
})
