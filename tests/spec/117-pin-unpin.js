import { loginAsFoobar } from '../roles'
import {
  avatarInComposeBox, closeDialogButton, composeInput, getNthDialogOptionsOption, getNthPinnedStatus,
  getNthPinnedStatusFavoriteButton,
  getNthStatus, getNthStatusContent,
  getNthStatusOptionsButton, getUrl, homeNavButton, postStatusButton, scrollToTop, scrollToBottom,
  settingsNavButton, sleep, getNthStatusAccountLink
} from '../utils'
import { users } from '../users'
import { postAs, postStatusWithMediaAs } from '../serverActions'

fixture`117-pin-unpin.js`
  .page`http://localhost:4002`

test('Can pin statuses', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'I am going to pin this', { paste: true })
    .click(postStatusButton)
    .expect(getNthStatus(1).innerText).contains('I am going to pin this')
    .click(avatarInComposeBox)
    .expect(getUrl()).contains(`/accounts/${users.foobar.id}`)
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
    .expect(getNthStatus(1).innerText).contains('I am going to pin this')
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Delete')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Pin to profile')
    .click(getNthDialogOptionsOption(2))
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('2')
    .expect(getNthPinnedStatus(1).innerText).contains('I am going to pin this')
    .expect(getNthPinnedStatus(2).innerText).contains('this is unlisted')
    .expect(getNthStatus(1).innerText).contains('I am going to pin this')
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Delete')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
    .click(getNthDialogOptionsOption(2))
    .expect(getUrl()).contains(`/accounts/${users.foobar.id}`)
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
    .expect(getNthStatus(1).innerText).contains('I am going to pin this')
})

test('Can favorite a pinned status', async t => {
  await loginAsFoobar(t)
  await t
    .click(avatarInComposeBox)
    .expect(getNthPinnedStatus(1).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatusFavoriteButton(1).getAttribute('aria-label')).eql('Favorite')
    .click(getNthPinnedStatusFavoriteButton(1))
    .expect(getNthPinnedStatusFavoriteButton(1).getAttribute('aria-label')).eql('Unfavorite')
    .click(getNthPinnedStatusFavoriteButton(1))
    .expect(getNthPinnedStatusFavoriteButton(1).getAttribute('aria-label')).eql('Favorite')
})

test('Saved pinned/unpinned state of status', async t => {
  const timeout = 20000
  await postAs('foobar', 'hey I am going to pin and unpin this')
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('hey I am going to pin and unpin this', { timeout })
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Pin to profile')
    .click(getNthDialogOptionsOption(2))
  await sleep(1)
  await t
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
    .click(closeDialogButton)

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()

  await t
    .expect(getNthStatusContent(1).innerText).contains('hey I am going to pin and unpin this', { timeout })
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile', { timeout })
    // navigate to another page and back to force another unrender
    .click(settingsNavButton)
    .click(homeNavButton)
    .expect(getNthStatusContent(1).innerText).contains('hey I am going to pin and unpin this', { timeout })
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile', { timeout })
})

test('pinned posts and aria-labels', async t => {
  const timeout = 20000
  await postStatusWithMediaAs('foobar', 'here is a sensitive kitty', 'kitten2.jpg', 'kitten', true)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('here is a sensitive kitty', { timeout })
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Pin to profile')
    .click(getNthDialogOptionsOption(2))
    .click(getNthStatusAccountLink(1))
    .expect(getNthPinnedStatus(1).getAttribute('aria-label')).match(
      /foobar, here is a sensitive kitty, has media, (.+ ago|just now), @foobar, Public/i
    )
    .expect(getNthStatusContent(1).innerText).contains('here is a sensitive kitty')
    .click(getNthStatusOptionsButton(1))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
  await sleep(2000)
})
