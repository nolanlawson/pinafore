import { loginAsLockedAccount } from '../roles'
import { followAs, unfollowAs } from '../serverActions'
import {
  avatarInComposeBox,
  communityNavButton,
  followersButton,
  getNthSearchResult,
  getNthStatus,
  getSearchResultByHref,
  getUrl,
  goBack,
  homeNavButton,
  notificationsNavButton,
  sleep
} from '../utils'
import { users } from '../users'
import { Selector as $ } from 'testcafe'

fixture`116-follow-requests.js`
  .page`http://localhost:4002`

const timeout = 30000

const requestsButton = $('a[href="/requests"]')
const approveAdminButton = () => getSearchResultByHref(`/accounts/${users.admin.id}`).find('button:nth-child(1)')
const rejectBazButton = () => getSearchResultByHref(`/accounts/${users.baz.id}`).find('button:nth-child(2)')
const approveQuuxButton = () => getSearchResultByHref(`/accounts/${users.quux.id}`).find('button:nth-child(1)')

async function resetFollows () {
  // necessary for re-running this test in local testing
  await Promise.all([
    unfollowAs('admin', 'LockedAccount'),
    unfollowAs('baz', 'LockedAccount'),
    unfollowAs('quux', 'LockedAccount')
  ])
}

test('Can approve and reject follow requests', async t => {
  await resetFollows()
  await sleep(2000)
  await Promise.all([
    followAs('admin', 'LockedAccount'),
    followAs('baz', 'LockedAccount'),
    followAs('quux', 'LockedAccount')
  ])
  await sleep(2000)
  await loginAsLockedAccount(t)

  await t
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community (3 follow requests)')
    .click(communityNavButton)
    .click(requestsButton)
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
    .click(requestsButton)
    // reject baz
    .expect(rejectBazButton().getAttribute('aria-label')).eql('Reject')
    .hover(rejectBazButton())
    .click(rejectBazButton())
    .expect(getNthSearchResult(1).innerText).contains('@quux', { timeout })
    .expect(getNthSearchResult(2).exists).notOk()
  await goBack()
  await t
    .click(requestsButton)
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

test('Shows unresolved follow requests', async t => {
  await resetFollows()
  await sleep(2000)
  await Promise.all([
    followAs('admin', 'LockedAccount'),
    followAs('baz', 'LockedAccount')
  ])
  await sleep(2000)
  await loginAsLockedAccount(t)

  await t
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community (2 follow requests)')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).innerText).contains('requested to follow you')
    .click(communityNavButton)
    .expect(requestsButton.innerText).contains('Follow requests (2)')
    .click(requestsButton)
    .expect(getUrl()).contains('/requests')
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community (2 follow requests)')
    .click(approveAdminButton())
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community (1 follow request)')
    .click(rejectBazButton())
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community')
  await goBack()
  await t
    .expect(requestsButton.innerText).contains('Follow requests')
})

test('Shows unresolved follow requests immediately upon opening community page', async t => {
  await resetFollows()
  await sleep(2000)
  await loginAsLockedAccount(t)
  await sleep(2000)
  await followAs('admin', 'LockedAccount')
  await sleep(2000)
  await t
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community')
    .click(communityNavButton)
    .expect(communityNavButton.getAttribute('aria-label')).eql('Community (current page) (1 follow request)')
    .expect(requestsButton.innerText).contains('Follow requests (1)')
})
