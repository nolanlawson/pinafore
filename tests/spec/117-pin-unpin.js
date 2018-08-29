import { loginAsFoobar } from '../roles'
import {
  avatarInComposeBox, closeDialogButton, composeInput, getNthDialogOptionsOption, getNthPinnedStatus,
  getNthPinnedStatusFavoriteButton,
  getNthStatus, getNthStatusContent,
  getNthStatusOptionsButton, getUrl, homeNavButton, postStatusButton, scrollToBottomOfTimeline, scrollToTopOfTimeline,
  settingsNavButton, sleep
} from '../utils'
import { users } from '../users'
import { postAs } from '../serverActions'

fixture`117-pin-unpin.js`
  .page`http://localhost:4002`

test('Can pin statuses', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'I am going to pin this', {paste: true})
    .click(postStatusButton)
    .expect(getNthStatus(0).innerText).contains('I am going to pin this')
    .click(avatarInComposeBox)
    .expect(getUrl()).contains(`/accounts/${users.foobar.id}`)
    .expect(getNthPinnedStatus(0).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatus(0).innerText).contains('this is unlisted')
    .expect(getNthStatus(0).innerText).contains('I am going to pin this')
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Delete')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Pin to profile')
    .click(getNthDialogOptionsOption(2))
    .expect(getNthPinnedStatus(0).getAttribute('aria-setsize')).eql('2')
    .expect(getNthPinnedStatus(0).innerText).contains('I am going to pin this')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
    .expect(getNthStatus(0).innerText).contains('I am going to pin this')
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Delete')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
    .click(getNthDialogOptionsOption(2))
    .expect(getUrl()).contains(`/accounts/${users.foobar.id}`)
    .expect(getNthPinnedStatus(0).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatus(0).innerText).contains('this is unlisted')
    .expect(getNthStatus(0).innerText).contains('I am going to pin this')
})

test('Can favorite a pinned status', async t => {
  await loginAsFoobar(t)
  await t
    .click(avatarInComposeBox)
    .expect(getNthPinnedStatus(0).getAttribute('aria-setsize')).eql('1')
    .expect(getNthPinnedStatusFavoriteButton(0).getAttribute('aria-pressed')).eql('false')
    .click(getNthPinnedStatusFavoriteButton(0))
    .expect(getNthPinnedStatusFavoriteButton(0).getAttribute('aria-pressed')).eql('true')
    .click(getNthPinnedStatusFavoriteButton(0))
    .expect(getNthPinnedStatusFavoriteButton(0).getAttribute('aria-pressed')).eql('false')
})

test('Saved pinned/unpinned state of status', async t => {
  await postAs('foobar', 'hey I am going to pin and unpin this')
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(0).innerText).contains('hey I am going to pin and unpin this')
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Pin to profile')
    .click(getNthDialogOptionsOption(2))
  await sleep(1)
  await t
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
    .click(closeDialogButton)

  // scroll down and back up to force an unrender
  await scrollToBottomOfTimeline(t)
  await scrollToTopOfTimeline(t)

  await t
    .expect(getNthStatusContent(0).innerText).contains('hey I am going to pin and unpin this')
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
    // navigate to another page and back to force another unrender
    .click(settingsNavButton)
    .click(homeNavButton)
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unpin from profile')
})
