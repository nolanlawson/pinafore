import { Selector as $ } from 'testcafe'
import { getNthVirtualArticle } from '../utils'
import { foobarRole } from '../roles'

fixture`06-tabindex.js`
  .page`http://localhost:4002`

test('shows correct tabindex in home timeline', async t => {
  await t.useRole(foobarRole)
    .expect(getNthVirtualArticle(0).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(1).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(2).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(3).getAttribute('tabindex')).eql('0')
})

test('shows correct tabindex in notifications', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/notifications')
    .expect(getNthVirtualArticle(0).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(1).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(2).getAttribute('tabindex')).eql('0')
    .hover(getNthVirtualArticle(2))
    .expect(getNthVirtualArticle(3).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(4).getAttribute('tabindex')).eql('0')
    .hover(getNthVirtualArticle(4))
    .expect(getNthVirtualArticle(5).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(6).getAttribute('tabindex')).eql('0')
    .hover(getNthVirtualArticle(6))
    .expect(getNthVirtualArticle(7).getAttribute('tabindex')).eql('0')
    .expect(getNthVirtualArticle(7).getAttribute('aria-setsize')).eql('8')
})

test('shows correct tabindex in pinned statuses', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/pinned')
    .expect($('.status-article').getAttribute('tabindex')).eql('0')
    .expect($('.status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.status-article').getAttribute('aria-setsize')).eql('1')
})
