import { loginAsFoobar } from '../roles'
import { postAs } from '../serverActions'
import {
  avatarInComposeBox, getNthDialogOptionsOption, getNthPinnedStatus, getNthPinnedStatusFavoriteButton, getNthStatus,
  getNthStatusOptionsButton, getUrl, sleep
} from '../utils'
import { users } from '../users'

fixture`117-pin-unpin.js`
  .page`http://localhost:4002`

test('Can pin statuses', async t => {
  await loginAsFoobar(t)

  await postAs('foobar', 'I am going to pin this')

  await sleep(2000)

  await t.click(avatarInComposeBox)
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
