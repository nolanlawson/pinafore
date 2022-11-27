import { loginAsFoobar } from '../roles'
import {
  getNthStatus, getNthStatusContent, getTitleText, getUrl, homeNavButton, notificationsNavButton
} from '../utils'
import { favoriteStatusAs, postAs } from '../serverActions'

fixture`102-notifications.js`
  .page`http://localhost:4002`

test('shows unread notification', async t => {
  const { id } = await postAs('foobar', 'somebody please favorite this to validate me')
  await loginAsFoobar(t)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
    .expect(getTitleText()).eql('Home · localhost:3000')
    .expect(getNthStatusContent(1).innerText).contains('somebody please favorite this to validate me', {
      timeout: 20000
    })
  await favoriteStatusAs('admin', id)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1 notification)', {
      timeout: 20000
    })
    .expect(getTitleText()).eql('(1) Home · localhost:3000')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)')
    .expect(getTitleText()).eql('Notifications · localhost:3000')
    .expect(getNthStatus(1).innerText).contains('somebody please favorite this to validate me')
    .expect(getNthStatus(1).innerText).match(/admin\s+favorited your toot/)
  await t
    .click(homeNavButton)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
    .expect(getTitleText()).eql('Home · localhost:3000')
})

test('shows unread notifications, more than one', async t => {
  const { id } = await postAs('foobar', 'I need lots of favorites on this one')
  await loginAsFoobar(t)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
    .expect(getTitleText()).eql('Home · localhost:3000')
    .expect(getNthStatusContent(1).innerText).contains('I need lots of favorites on this one', {
      timeout: 20000
    })
  await favoriteStatusAs('admin', id)
  await favoriteStatusAs('quux', id)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (2 notifications)', {
      timeout: 20000
    })
    .expect(getTitleText()).eql('(2) Home · localhost:3000')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)')
    .expect(getTitleText()).eql('Notifications · localhost:3000')
    .expect(getNthStatus(1).innerText).contains('I need lots of favorites on this one')
  await t
    .click(homeNavButton)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
    .expect(getTitleText()).eql('Home · localhost:3000')
})
