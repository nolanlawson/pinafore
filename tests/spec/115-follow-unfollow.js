import {
  accountProfileFollowButton,
  accountProfileMoreOptionsButton, closeDialogButton,
  getNthDialogOptionsOption,
  sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { unfollowAs } from '../serverActions'

fixture`115-follow-unfollow.js`
  .page`http://localhost:4002`

test('Can follow and unfollow an account from the profile page', async t => {
  await unfollowAs('foobar', 'baz') // reset
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/5')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
  await sleep(500)
  await t
    .click(accountProfileMoreOptionsButton)
  await sleep(500)
  await t
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @baz')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Follow @baz')
  await sleep(500)
  await t
    .click(getNthDialogOptionsOption(2))
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unfollow')
  await sleep(500)
  await t
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unfollow @baz')
  await sleep(500)
  await t
    .click(getNthDialogOptionsOption(2))
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
  await sleep(500)
  await t
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(2).innerText).contains('Follow @baz')
  await sleep(500)
  await t
    .click(closeDialogButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
})
