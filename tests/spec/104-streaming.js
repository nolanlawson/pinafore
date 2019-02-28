import { loginAsFoobar } from '../roles'
import {
  getNthStatus, scrollToTop, showMoreButton, sleep
} from '../utils'
import { postAs } from '../serverActions'

fixture`104-streaming.js`
  .page`http://localhost:4002`

test('new incoming statuses show up immediately', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
  await postAs('admin', 'hello my baby hello my honey')
  await t.expect(getNthStatus(1).innerText).contains('hello my baby hello my honey')
})

test('new incoming toots show a button if scrolled down', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .hover(getNthStatus(3))
    .hover(getNthStatus(5))
  await sleep(1000)
  await postAs('admin', 'hello my ragtime gal')
  await postAs('admin', 'send me a kiss by wire')
  await sleep(4000)
  await t.hover(getNthStatus(3))
    .hover(getNthStatus(1))
  await scrollToTop()
  await sleep(1000)
  await t
    .expect(showMoreButton.innerText).contains('Show 2 more')
  await postAs('admin', "baby my heart's on fire")
  await sleep(4000)
  await t.expect(showMoreButton.innerText).contains('Show 3 more')
    .click(showMoreButton)
  await t
    .expect(getNthStatus(1).innerText).contains("baby my heart's on fire")
    .expect(getNthStatus(2).innerText).contains('send me a kiss by wire')
    .expect(getNthStatus(3).innerText).contains('hello my ragtime gal')
    .navigateTo('/')
    .expect(getNthStatus(1).innerText).contains("baby my heart's on fire")
    .expect(getNthStatus(2).innerText).contains('send me a kiss by wire')
    .expect(getNthStatus(3).innerText).contains('hello my ragtime gal')
})
