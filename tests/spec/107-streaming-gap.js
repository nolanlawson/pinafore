import { loginAsFoobar } from '../roles'
import {
  forceOffline,
  forceOnline,
  getNthStatus, homeNavButton, localTimelineNavButton, notificationBadge, notificationsNavButton, sleep
} from '../utils'
import {
  postAs
} from '../serverActions'

fixture`107-streaming-gap.js`
  .page`http://localhost:4002`

const timeout = 30000

test('fills timeline gap while away from local timeline', async t => {
  await loginAsFoobar(t)
  await t
    .click(localTimelineNavButton)
    .expect(getNthStatus(1).exists).ok({ timeout })
    .hover(getNthStatus(1))
  await postAs('admin', 'heyo')
  await t.expect(getNthStatus(1).innerText).contains('heyo', { timeout })
    .click(homeNavButton)
    .hover(getNthStatus(1))
  await postAs('admin', 'posted this while you were away!')
  await t.expect(getNthStatus(1).innerText).contains('posted this while you were away!', { timeout })
    .click(localTimelineNavButton)
    .expect(getNthStatus(1).innerText).contains('posted this while you were away!', { timeout })
    .expect(getNthStatus(2).innerText).contains('heyo', { timeout })
  await sleep(2000)
  await postAs('admin', 'posted this while you were watching')
  await t.expect(getNthStatus(1).innerText).contains('posted this while you were watching', { timeout })
})

test('fills timeline gap while away from home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout })
    .hover(getNthStatus(1))
  await postAs('admin', 'hello world')
  await t.expect(getNthStatus(1).innerText).contains('hello world', { timeout })
  await forceOffline()
  await sleep(1000)
  await postAs('admin', 'posted this while you were offline')
  await sleep(1000)
  await forceOnline()
  await t.expect(getNthStatus(1).innerText).contains('posted this while you were offline', { timeout })
})

test('fills timeline gap while away from notifications timeline', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getNthStatus(1).exists).ok({ timeout })
    .hover(getNthStatus(1))
  await postAs('admin', '@foobar yo yo yo')
  await t.expect(getNthStatus(1).innerText).contains('yo yo yo', { timeout })
  await forceOffline()
  await sleep(1000)
  await postAs('admin', '@foobar mentioning you while you are offline!')
  await sleep(1000)
  await forceOnline()
  await t.expect(getNthStatus(1).innerText).contains('mentioning you while you are offline!', { timeout })
})

test('fills timeline gap while away from notifications timeline - badge updates', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout })
    .hover(getNthStatus(1))
  await postAs('admin', '@foobar hi hi hi')
  await t.expect(getNthStatus(1).innerText).contains('hi hi hi', { timeout })
  await forceOffline()
  await sleep(1000)
  await postAs('admin', '@foobar sneaky mention!')
  await sleep(1000)
  await forceOnline()
  await t
    .expect(notificationBadge.innerText).eql('1', { timeout })
    .click(notificationsNavButton)
    .expect(notificationBadge.exists).notOk()
    .expect(getNthStatus(1).innerText).contains('sneaky mention!', { timeout })
})
