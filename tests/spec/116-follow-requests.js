import { lockedAccountRole } from '../roles'
import { followAs } from '../serverActions'
import {
  communityNavButton, followersButton, getNthSearchResult, getSearchResultByHref, getUrl,
  homeNavButton, sleep
} from '../utils'
import { users } from '../users'
import { Selector as $ } from 'testcafe'

fixture`116-follow-requests.js`
  .page`http://localhost:4002`

const timeout = 30000

test('Can approve and reject follow requests', async t => {
  await t.useRole(lockedAccountRole)

  await Promise.all([
    followAs('admin', 'LockedAccount'),
    followAs('baz', 'LockedAccount'),
    followAs('quux', 'LockedAccount')
  ])

  await sleep(2000)

  await t.click(communityNavButton)
    .click($('a[href="/requests"]'))
    // no guaranteed order on these
    .expect(getNthSearchResult(1).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(2).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(3).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(4).exists).notOk()

  await sleep(1000)
  // approve admin
  await t
    .click(getSearchResultByHref(`/accounts/${users.admin.id}`).find('.search-result-account-buttons button:nth-child(1)'))
    .expect(getNthSearchResult(1).innerText).match(/(@baz|@quux)/, {timeout})
    .expect(getNthSearchResult(2).innerText).match(/(@baz|@quux)/)
    .expect(getNthSearchResult(3).exists).notOk()
  await sleep(1000)
  // reject baz
  await t
    .click(getSearchResultByHref(`/accounts/${users.baz.id}`).find('.search-result-account-buttons button:nth-child(2)'))
    .expect(getNthSearchResult(1).innerText).contains('@quux', {timeout})
    .expect(getNthSearchResult(2).exists).notOk()
  await sleep(1000)
  // approve quux
  await t
    .click(getNthSearchResult(1).find('.search-result-account-buttons button:nth-child(1)'))
    .expect(getNthSearchResult(1).exists).notOk({timeout})

    // check our follow list to make sure they follow us
    .click(homeNavButton)
    .click($('.compose-box-avatar'))
    .expect(getUrl()).contains(`/accounts/${users.LockedAccount.id}`)
    .click(followersButton)
    .expect(getNthSearchResult(1).innerText).match(/(@admin|@quux)/)
    .expect(getNthSearchResult(2).innerText).match(/(@admin|@quux)/)
    .expect(getNthSearchResult(3).exists).notOk()
})
