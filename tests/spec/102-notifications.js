import { loginAsFoobar } from '../roles'
import {
  getNthStatus, getUrl, homeNavButton, notificationsNavButton
} from '../utils'
import { favoriteStatusAs, postAs } from '../serverActions'

fixture`102-notifications.js`
  .page`http://localhost:4002`

test('shows unread notifications', async t => {
  let { id } = await postAs('foobar', 'somebody please favorite this to validate me')
  await loginAsFoobar(t)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
  await favoriteStatusAs('admin', id)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1)')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)')
    .expect(getNthStatus(0).innerText).contains('somebody please favorite this to validate me')
    .expect(getNthStatus(0).innerText).match(/admin\s+favorited your status/)
  await t
    .click(homeNavButton)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
})
