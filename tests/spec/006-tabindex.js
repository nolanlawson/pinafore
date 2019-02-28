import { Selector as $ } from 'testcafe'
import { getNthStatus } from '../utils'
import { loginAsFoobar } from '../roles'

fixture`006-tabindex.js`
  .page`http://localhost:4002`

test('shows correct tabindex in home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(2).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(3).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(4).getAttribute('tabindex')).eql('0')
})

test('shows correct tabindex in notifications', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/notifications')
    .expect(getNthStatus(1).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(2).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(3).getAttribute('tabindex')).eql('0')
    .hover(getNthStatus(3))
    .expect(getNthStatus(4).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(5).getAttribute('tabindex')).eql('0')
    .hover(getNthStatus(5))
    .expect(getNthStatus(6).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(7).getAttribute('tabindex')).eql('0')
    .hover(getNthStatus(7))
    .expect(getNthStatus(8).getAttribute('tabindex')).eql('0')
    .expect(getNthStatus(8).getAttribute('aria-setsize')).eql('8')
})

test('shows correct tabindex in pinned statuses', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/pinned')
    .expect($('.status-article').getAttribute('tabindex')).eql('0')
    .expect($('.status-article').getAttribute('aria-posinset')).eql('1')
    .expect($('.status-article').getAttribute('aria-setsize')).eql('1')
})
