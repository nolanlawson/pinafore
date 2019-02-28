import { Selector as $ } from 'testcafe'
import { communityNavButton, getNthPinnedStatus, getUrl } from '../utils'
import { loginAsFoobar } from '../roles'

fixture`004-pinned-statuses.js`
  .page`http://localhost:4002`

test("shows a user's pinned statuses", async t => {
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('/community')
    .click($('a[href="/pinned"]'))
    .expect(getUrl()).contains('/pinned')
    .expect($('.status-article').getAttribute('aria-posinset')).eql('1')
    .expect($('.status-article').getAttribute('aria-setsize')).eql('1')
    .expect($('.status-article .status-content').innerText).contains('this is unlisted')
})

test("shows pinned statuses on a user's account page", async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/2')
    .expect(getNthPinnedStatus(1).getAttribute('aria-posinset')).eql('1')
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
})

test("shows pinned statuses on a user's account page 2", async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/3')
    .expect(getNthPinnedStatus(1).getAttribute('aria-posinset')).eql('1')
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('2')
    .expect(getNthPinnedStatus(1).innerText).contains('pinned toot 1')
    .expect(getNthPinnedStatus(2).getAttribute('aria-setsize')).eql('2')
    .expect(getNthPinnedStatus(2).innerText).contains('pinned toot 2')
})
