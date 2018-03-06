import { Selector as $ } from 'testcafe'
import { getFavoritesCount, getNthStatus, getReblogsCount, getUrl } from '../utils'
import { foobarRole } from '../roles'

fixture`11-reblog-favorites-count.js`
  .page`http://localhost:4002`

test('shows favorites', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')
    .expect(getFavoritesCount()).eql(2)
    .expect($('.icon-button[aria-label="Favorite"]').getAttribute('aria-pressed')).eql('true')
    .click($('.status-favs-reblogs').nth(1))
    .expect(getUrl()).match(/\/statuses\/[^\/]+\/favorites/)
    .expect($('.search-result-account-name').nth(0).innerText).eql('foobar')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@foobar')
    .expect($('.search-result-account-name').nth(1).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(1).innerText).eql('@admin')
})

test('shows boosts', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')
    .expect(getReblogsCount()).eql(1)
    .expect($('.icon-button[aria-label="Boost"]').getAttribute('aria-pressed')).eql('false')
    .click($('.status-favs-reblogs').nth(0))
    .expect(getUrl()).match(/\/statuses\/[^\/]+\/reblogs/)
    .expect($('.search-result-account-name').nth(0).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@admin')
})
