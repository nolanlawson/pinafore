import { Selector as $ } from 'testcafe'
import {
  favoritesCountElement,
  getFavoritesCount,
  getNthFavoritedLabel,
  getNthRebloggedLabel,
  getNthStatus,
  getReblogsCount,
  getUrl,
  reblogsCountElement
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`011-reblog-favorites-count.js`
  .page`http://localhost:4002`

test('shows favorites', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(1).exists).ok()
    .expect(getFavoritesCount()).eql(2)
    .expect(favoritesCountElement.getAttribute('aria-label')).eql('Favorited 2 times')
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
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
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(1).exists).ok()
    .expect(getReblogsCount()).eql(1)
    .expect(reblogsCountElement.getAttribute('aria-label')).eql('Boosted 1 time')
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(reblogsCountElement)
    .expect(getUrl()).match(/\/statuses\/[^/]+\/reblogs/)
    .expect($('.search-result-account-name').nth(0).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@admin')
})
