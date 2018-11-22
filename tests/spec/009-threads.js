import { Selector as $ } from 'testcafe'
import {
  getNthStatus, getUrl, validateTimeline, getFirstVisibleStatus,
  goBack, forceOffline, forceOnline, searchNavButton, searchInput, getNthSearchResult, scrollToStatus
} from '../utils'
import { loginAsFoobar } from '../roles'
import { bazThreadRelativeTo2, bazThreadRelativeTo2b, bazThreadRelativeTo2B2, quuxThread } from '../fixtures'

fixture`009-threads.js`
  .page`http://localhost:4002`

test('Shows a thread', async t => {
  await loginAsFoobar(t)
  await t
    .click($('a').withText('quux'))

  await scrollToStatus(t, 26)
  await t
    .hover(getNthStatus(26))
    .click(getNthStatus(26))
    .expect(getUrl()).contains('/statuses/')

  await validateTimeline(t, quuxThread)

  await t.expect(getNthStatus(24).getAttribute('aria-setsize')).eql('25')
})

test('Scrolls to proper point in thread', async t => {
  await loginAsFoobar(t)
  await t
    .click($('a').withText('quux'))
    .hover(getNthStatus(0))
    .hover(getNthStatus(2))
    .hover(getNthStatus(4))
    .hover(getNthStatus(6))
    .hover(getNthStatus(8))
    .hover(getNthStatus(10))
    .click(getNthStatus(10))
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(16).innerText).contains('unlisted thread 17')
    .expect(Math.round(getNthStatus(16).boundingClientRect.top))
    .eql(Math.round($('.main-content').boundingClientRect.top))
})

async function navigateToBazAccount (t) {
  await t.click(searchNavButton)
    .expect(getUrl()).contains('/search')
    .typeText(searchInput, 'baz', { paste: true })
    .pressKey('enter')
    .click(getNthSearchResult(1))
    .expect(getUrl()).contains('/accounts/5')
}

async function validateForkedThread (t) {
  await t.hover(getNthStatus(1))
    .click(getNthStatus(2))
    .expect(getUrl()).contains('/statuses')
  await validateTimeline(t, bazThreadRelativeTo2B2)
  await goBack()
  await t.hover(getNthStatus(3))
    .hover(getNthStatus(5))
    .hover(getNthStatus(7))
    .hover(getNthStatus(9))
    .click(getNthStatus(9))
    .expect(getUrl()).contains('/statuses')
  await validateTimeline(t, bazThreadRelativeTo2b)
  await goBack()
  await t.hover(getNthStatus(11))
    .click(getNthStatus(11))
    .expect(getUrl()).contains('/statuses')
  await validateTimeline(t, bazThreadRelativeTo2)
}

test('Forked threads look correct online and offline', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getFirstVisibleStatus())
  await navigateToBazAccount(t)
  await validateForkedThread(t)
  await t.navigateTo('/') // clears in-memory cache while still preserving IDB cache
    .hover(getFirstVisibleStatus())
  await navigateToBazAccount(t)
  await forceOffline()
  await validateForkedThread(t)
  await forceOnline()
})
