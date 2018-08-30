import { loginAsFoobar } from '../roles'
import {
  clickToNotificationsAndBackHome, forceOffline, forceOnline, getNthStatus, getUrl, homeNavButton,
  notificationsNavButton
} from '../utils'
import { deleteAs, postAs, postReplyAs } from '../serverActions'

fixture`105-deletes.js`
  .page`http://localhost:4002`

test('deleted statuses are removed from the timeline', async t => {
  let timeout = 20000
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
  let status = await postAs('admin', "I'm gonna delete this")
  await t.expect(getNthStatus(0).innerText).contains("I'm gonna delete this", { timeout })
  await deleteAs('admin', status.id)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this", { timeout })
  await clickToNotificationsAndBackHome(t)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this", { timeout })
  await t.navigateTo('/notifications')
  await forceOffline()
  await t.click(homeNavButton)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this", { timeout })
  await forceOnline()
  await t
    .navigateTo('/')
    .expect(getNthStatus(0).innerText).notContains("I'm gonna delete this", { timeout })
})

test('deleted statuses are removed from threads', async t => {
  let timeout = 20000
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
  let status = await postAs('admin', "I won't delete this")
  let reply = await postReplyAs('admin', 'But I will delete this', status.id)
  await t.expect(getNthStatus(0).innerText).contains('But I will delete this', { timeout })
    .expect(getNthStatus(1).innerText).contains("I won't delete this", { timeout })
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatus(0).innerText).contains("I won't delete this", { timeout })
    .expect(getNthStatus(1).innerText).contains('But I will delete this', { timeout })
  await deleteAs('admin', reply.id)
  await t.expect(getNthStatus(1).exists).notOk()
    .expect(getNthStatus(0).innerText).contains("I won't delete this", { timeout })
  await t.navigateTo('/')
  await forceOffline()
  await t.click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatus(1).exists).notOk()
    .expect(getNthStatus(0).innerText).contains("I won't delete this", { timeout })
  await forceOnline()
})

test('deleted statuses result in deleted notifications', async t => {
  let timeout = 20000
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
  let status = await postAs('admin', "@foobar yo yo foobar what's up")
  await t.expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1)', { timeout })
  await deleteAs('admin', status.id)
  await t.expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications', { timeout })
})
