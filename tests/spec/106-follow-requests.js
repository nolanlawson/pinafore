import { loginAsFoobar } from '../roles'
import {
  accountProfileFollowButton,
  getNthStatus,
  sleep
} from '../utils'
import {
  authorizeFollowRequestAs, getFollowRequestsAs
} from '../serverActions'

fixture`106-follow-requests.js`
  .page`http://localhost:4002`

test('can request to follow an account', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/6')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow (follow requested)')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow (follow requested)')

  let requests = await getFollowRequestsAs('LockedAccount')
  await authorizeFollowRequestAs('LockedAccount', requests.slice(-1)[0].id)

  await sleep(2000)

  await t.navigateTo('/accounts/6')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(getNthStatus(1).innerText).contains('This account is locked')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
})
