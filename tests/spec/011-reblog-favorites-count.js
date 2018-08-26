import { Selector as $ } from 'testcafe'
import {
  favoritesCountElement, getFavoritesCount, getNthStatus, getReblogsCount, getUrl,
  reblogsCountElement
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`011-reblog-favorites-count.js`
  .page`http://localhost:4002`

test('shows favorites', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')
    .expect(getFavoritesCount()).eql(2)
    .expect(favoritesCountElement.getAttribute('aria-label')).eql('Favorited 2 times')
    .expect($('.icon-button[aria-label="Favorite"]').getAttribute('aria-pressed')).eql('true')
    .click(favoritesCountElement)
    .expect(getUrl()).match(/\/statuses\/[^/]+\/favorites/)
    .expect($('.search-result-account-name').nth(0).innerText).eql('foobar')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@foobar')
    .expect($('.search-result-account-name').nth(1).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(1).innerText).eql('@admin')
})

test('shows boosts', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')
    .expect(getReblogsCount()).eql(1)
    .expect(reblogsCountElement.getAttribute('aria-label')).eql('Boosted 1 time')
    .expect($('.icon-button[aria-label="Boost"]').getAttribute('aria-pressed')).eql('false')
    .click(reblogsCountElement)
    .expect(getUrl()).match(/\/statuses\/[^/]+\/reblogs/)
    .expect($('.search-result-account-name').nth(0).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@admin')
})
