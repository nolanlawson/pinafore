import {
  settingsNavButton,
  homeNavButton,
  disableInfiniteScroll,
  scrollToStatus,
  loadMoreButton, getFirstVisibleStatus, scrollFromStatusToStatus, sleep, getActiveElementAriaPosInSet
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { homeTimeline } from '../fixtures'

fixture`036-disable-infinite-load.js`
  .page`http://localhost:4002`

test('Can disable loading items at bottom of timeline', async t => {
  await loginAsFoobar(t)
  await t.click(settingsNavButton)
    .click($('a').withText('General'))
    .click(disableInfiniteScroll)
    .expect(disableInfiniteScroll.checked).ok()
    .click(homeNavButton)
    .expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql('20')
  await scrollToStatus(t, 20)
  await t
    .click(loadMoreButton)
    .expect(getActiveElementAriaPosInSet()).eql('20')
    .expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql('40')
  await scrollFromStatusToStatus(t, 20, 40)
  await t
    .click(loadMoreButton)
    .expect(getActiveElementAriaPosInSet()).eql('40')
    .expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql(homeTimeline.length.toString())
  await scrollFromStatusToStatus(t, 40, 47)
  await t
    .click(loadMoreButton)
  await sleep(1000)
  await t
    .expect(loadMoreButton.exists).ok()
    .expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql(homeTimeline.length.toString())
})
