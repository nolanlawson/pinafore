import {
  accountProfileFollowButton,
  accountProfileFollowedBy, accountProfileMoreOptionsButton, communityNavButton, getNthSearchResult,
  getNthStatus, getNthStatusOptionsButton, getNthDialogOptionsOption, getUrl, modalDialog,
  sleep, getDialogOptionWithText
} from '../utils'
import { Selector as $ } from 'testcafe'
import { loginAsFoobar } from '../roles'
import { postAs, unfollowAs } from '../serverActions'

fixture`113-block-unblock.js`
  .page`http://localhost:4002`

test('Can block and unblock an account from a status', async t => {
  const post = 'a very silly statement that should probably get me blocked'
  await postAs('admin', post)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).innerText).contains(post, { timeout: 30000 })
  await sleep(500)
  await t
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Unfollow @admin')
    .expect(getNthDialogOptionsOption(3).innerText).contains('Block @admin')
  await sleep(500)
  await t
    .click(getDialogOptionWithText('Block @admin'))
    .expect(modalDialog.exists).notOk()
  await sleep(500)
  await t
    .click(communityNavButton)
    .click($('a[href="/blocked"]'))
    .expect(getNthSearchResult(1).innerText).contains('@admin')
  await sleep(500)
  await t
    .click(getNthSearchResult(1))
    .expect(getUrl()).contains('/accounts/1')
    .expect(accountProfileFollowedBy.innerText).match(/blocked/i)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unblock')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unblock')
  await sleep(500)
  await t
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowedBy.innerText).contains('')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
  await sleep(500)
  await t
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unfollow')
})

test('Can block and unblock an account from the account profile page', async t => {
  await unfollowAs('foobar', 'baz') // reset
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/5')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
  await sleep(500)
  await t
    .click(accountProfileMoreOptionsButton)
  await sleep(500)
  await t
    .click(getDialogOptionWithText('Block @baz'))
    .expect(accountProfileFollowedBy.innerText).match(/blocked/i)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unblock')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unblock')
  await sleep(500)
  await t
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowedBy.innerText).contains('')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
  await sleep(500)
  await t
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unfollow')
  await sleep(500)
  await t
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Follow')
})
