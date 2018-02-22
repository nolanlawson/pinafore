import { Selector as $ } from 'testcafe'
import { getNthStatus, getUrl } from '../utils'
import { foobarRole } from '../roles'

fixture`11-reblog-favorites-count.js`
  .page`http://localhost:4002`

test('shows favorites', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/99549266679020981')
    .expect($('.status-favs-reblogs').nth(0).getAttribute('aria-label')).eql('Favorited 2 times')
    .expect($('.icon-button[aria-label="Favorite"]').getAttribute('aria-pressed')).eql('true')
    .click($('.status-favs-reblogs').nth(1))
    .expect(getUrl()).contains('/statuses/99549266679020981/favorites')
    .expect($('.search-result-account-name').nth(0).innerText).eql('foobar')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@foobar')
    .expect($('.search-result-account-name').nth(1).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(1).innerText).eql('@admin')
})

test('shows boosts', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/99549266679020981')
    .expect($('.status-favs-reblogs').nth(1).getAttribute('aria-label')).eql('Boosted 1 time')
    .expect($('.icon-button[aria-label="Boost"]').getAttribute('aria-pressed')).eql('false')
    .click($('.status-favs-reblogs').nth(0))
    .expect(getUrl()).contains('/statuses/99549266679020981/reblogs')
    .expect($('.search-result-account-name').nth(0).innerText).eql('admin')
    .expect($('.search-result-account-username').nth(0).innerText).eql('@admin')
})
