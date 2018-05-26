import { loginAsFoobar } from '../roles'
import { getNthStatus, getUrl, homeNavButton, notificationsNavButton, validateTimeline } from '../utils'
import { favoriteStatusAs } from '../serverActions'
import { notifications } from '../fixtures'

fixture`102-notifications.js`
  .page`http://localhost:4002`

test('shows unread notifications', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .hover(getNthStatus(2))
    .hover(getNthStatus(4))
    .hover(getNthStatus(5))
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
  let statusId = (await getNthStatus(5).find('.status-relative-date').getAttribute('href'))
    .split('/').slice(-1)[0]
  await favoriteStatusAs('admin', statusId)
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
