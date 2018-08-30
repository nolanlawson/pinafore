import { loginAsLockedAccount } from '../roles'
import { followAs, unfollowAs } from '../serverActions'
import {
  avatarInComposeBox,
  communityNavButton, followersButton, getNthSearchResult, getSearchResultByHref, getUrl, goBack,
  homeNavButton, sleep
} from '../utils'
import { users } from '../users'
import { Selector as $ } from 'testcafe'

fixture`116-follow-requests.js`
  .page`http://localhost:4002`

const timeout = 30000

test('Can approve and reject follow requests', async t => {
  await loginAsLockedAccount(t)

  // necessary for re-running this test in local testing
  await Promise.all([
    unfollowAs('admin', 'LockedAccount'),
    unfollowAs('baz', 'LockedAccount'),
    unfollowAs('quux', 'LockedAccount')
  ])

  await Promise.all([
    followAs('admin', 'LockedAccount'),
    followAs('baz', 'LockedAccount'),
    followAs('quux', 'LockedAccount')
  ])

  await sleep(2000)

  const approveAdminButton = () => getSearchResultByHref(`/accounts/${users.admin.id}`).find('button:nth-child(1)')
  const rejectBazButton = () => getSearchResultByHref(`/accounts/${users.baz.id}`).find('button:nth-child(2)')
  const approveQuuxButton = () => getSearchResultByHref(`/accounts/${users.quux.id}`).find('button:nth-child(1)')

  await t.click(communityNavButton)
    .click($('a[href="/requests"]'))
    // no guaranteed order on these
    .expect(getNthSearchResult(1).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(2).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(3).innerText).match(/(@admin|@baz|@quux)/)
    .expect(getNthSearchResult(4).exists).notOk()
    // approve admin
    .expect(approveAdminButton().getAttribute('aria-label')).eql('Approve')
    .hover(approveAdminButton())
    .click(approveAdminButton())
    .expect(getNthSearchResult(1).innerText).match(/(@baz|@quux)/, { timeout })
    .expect(getNthSearchResult(2).innerText).match(/(@baz|@quux)/)
    .expect(getNthSearchResult(3).exists).notOk()
  await goBack()
  await t
    .click($('a[href="/requests"]'))
    // reject baz
    .expect(rejectBazButton().getAttribute('aria-label')).eql('Reject')
    .hover(rejectBazButton())
    .click(rejectBazButton())
    .expect(getNthSearchResult(1).innerText).contains('@quux', { timeout })
    .expect(getNthSearchResult(2).exists).notOk()
  await goBack()
  await t
    .click($('a[href="/requests"]'))
    // approve quux
    .expect(approveQuuxButton().getAttribute('aria-label')).eql('Approve')
    .hover(approveQuuxButton())
    .click(approveQuuxButton())
    .expect(getNthSearchResult(1).exists).notOk({ timeout })
    // check our follow list to make sure they follow us
    .click(homeNavButton)
    .click(avatarInComposeBox)
    .expect(getUrl()).contains(`/accounts/${users.LockedAccount.id}`)
    .click(followersButton)
    .expect(getNthSearchResult(1).innerText).match(/(@admin|@quux)/)
    .expect(getNthSearchResult(2).innerText).match(/(@admin|@quux)/)
    .expect(getNthSearchResult(3).exists).notOk()
})
