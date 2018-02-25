import { foobarRole } from '../roles'
import { getNthStatus, getUrl, homeNavButton, notificationsNavButton, validateTimeline } from '../utils'
import { favoriteStatusAsAdmin } from '../serverActions'
import { notifications } from '../fixtures'

fixture`32-notifications.js`
  .page`http://localhost:4002`

test('shows unread notifications', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
  await favoriteStatusAsAdmin('99548061995124415')
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1)')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)')
  await validateTimeline(t, [
    {
      favoritedBy: 'admin',
      content: 'this is followers-only'
    }
  ].concat(notifications))
  await t
    .click(homeNavButton)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
})
