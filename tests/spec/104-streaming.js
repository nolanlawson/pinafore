import { foobarRole } from '../roles'
import {
  getFirstVisibleStatus, getNthReplyButton, getNthStatus, getUrl, homeNavButton, notificationsNavButton,
  postStatusButton, scrollContainerToTop, showMoreButton, sleep
} from '../utils'
import { postAsAdmin } from '../serverActions'

fixture`104-streaming.js`
  .page`http://localhost:4002`

test('new incoming statuses show up immediately', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
  await postAsAdmin('hello my baby hello my honey')
  await t.expect(getNthStatus(0).innerText).contains('hello my baby hello my honey')
})

test('new incoming toots show a button if scrolled down', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .hover(getNthStatus(2))
    .hover(getNthStatus(4))
  await postAsAdmin('hello my ragtime gal')
  await postAsAdmin('send me a kiss by wire')
  await sleep(4000)
  await t.hover(getNthStatus(2))
    .hover(getNthStatus(0))
  await scrollContainerToTop()
  await sleep(1000)
  await t
    .expect(showMoreButton.innerText).contains('Show 2 more')
  await postAsAdmin("baby my heart's on fire")
  await sleep(4000)
  await t.expect(showMoreButton.innerText).contains('Show 3 more')
    .click(showMoreButton)
  await t
    .expect(getNthStatus(0).innerText).contains("baby my heart's on fire")
    .expect(getNthStatus(1).innerText).contains('send me a kiss by wire')
    .expect(getNthStatus(2).innerText).contains('hello my ragtime gal')
    .navigateTo('/')
    .expect(getNthStatus(0).innerText).contains("baby my heart's on fire")
    .expect(getNthStatus(1).innerText).contains('send me a kiss by wire')
    .expect(getNthStatus(2).innerText).contains('hello my ragtime gal')
})
