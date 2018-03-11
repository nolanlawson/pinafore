import { foobarRole } from '../roles'
import {
  clickToNotificationsAndBackHome, forceOffline, forceOnline, getNthStatus, getUrl, homeNavButton,
  notificationsNavButton,
  sleep
} from '../utils'
import { deleteAsAdmin, postAsAdmin, postReplyAsAdmin } from '../serverActions'

fixture`105-deletes.js`
  .page`http://localhost:4002`

test('deleted statuses are removed from the timeline', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
  let status = await postAsAdmin("I'm gonna delete this")
  await sleep(1000)
  await t.expect(getNthStatus(0).innerText).contains("I'm gonna delete this")
  await deleteAsAdmin(status.id)
  await sleep(1000)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this")
  await clickToNotificationsAndBackHome(t)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this")
  await t.navigateTo('/notifications')
  await forceOffline()
  await t.click(homeNavButton)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this")
  await forceOnline()
  await t
    .navigateTo('/')
    .expect(getNthStatus(0).innerText).notContains("I'm gonna delete this")
})

test('deleted statuses are removed from threads', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
  let status = await postAsAdmin("I won't delete this")
  let reply = await postReplyAsAdmin('But I will delete this', status.id)
  await sleep(5000)
  await t.expect(getNthStatus(0).innerText).contains('But I will delete this')
    .expect(getNthStatus(1).innerText).contains("I won't delete this")
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatus(0).innerText).contains("I won't delete this")
    .expect(getNthStatus(1).innerText).contains('But I will delete this')
  await deleteAsAdmin(reply.id)
  await sleep(1000)
  await t.expect(getNthStatus(1).exists).notOk()
    .expect(getNthStatus(0).innerText).contains("I won't delete this")
  await t.navigateTo('/')
  await forceOffline()
  await t.click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatus(1).exists).notOk()
    .expect(getNthStatus(0).innerText).contains("I won't delete this")
  await forceOnline()
})

test('deleted statuses result in deleted notifications', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
  let status = await postAsAdmin("@foobar yo yo foobar what's up")
  await sleep(2000)
  await t.expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1)')
  await deleteAsAdmin(status.id)
  await sleep(5000)
  await t.expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications')
})
