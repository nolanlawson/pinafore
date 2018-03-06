import { Selector as $ } from 'testcafe'
import { getNthStatus, getUrl, validateTimeline, scrollToBottomOfTimeline } from '../utils'
import { foobarRole } from '../roles'
import { quuxThread } from '../fixtures'

fixture`09-threads.js`
  .page`http://localhost:4002`

test('Shows a thread', async t => {
  await t.useRole(foobarRole)
    .click($('a').withText('quux'))

  await scrollToBottomOfTimeline(t)
  await t
    .click(getNthStatus(26))
    .expect(getUrl()).contains('/statuses/')

  await validateTimeline(t, quuxThread)

  await t.expect(getNthStatus(24).getAttribute('aria-setsize')).eql('25')
})

test('Scrolls to proper point in thread', async t => {
  await t.useRole(foobarRole)
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
      .eql(Math.round($('.container').boundingClientRect.top))
})
