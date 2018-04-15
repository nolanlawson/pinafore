import {
  accountProfileFollowButton,
  accountProfileMoreOptionsButton, closeDialogButton,
  getNthDialogOptionsOption
} from '../utils'
import { foobarRole } from '../roles'

fixture`115-follow-unfollow.js`
  .page`http://localhost:4002`

test('Can follow and unfollow an account from the profile page', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/5')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @baz')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Follow @baz')
    .click(getNthDialogOptionsOption(2))
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unfollow @baz')
    .click(getNthDialogOptionsOption(2))
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(2).innerText).contains('Follow @baz')
    .click(closeDialogButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
})
