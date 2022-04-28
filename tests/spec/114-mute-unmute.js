import {
  accountProfileFollowButton,
  accountProfileMoreOptionsButton,
  communityNavButton,
  getNthSearchResult,
  getNthStatus,
  getNthStatusOptionsButton,
  getUrl,
  modalDialog,
  closeDialogButton,
  confirmationDialogOKButton, sleep, getDialogOptionWithText
} from '../utils'
import { Selector as $ } from 'testcafe'
import { loginAsFoobar } from '../roles'
import { postAs } from '../serverActions'

fixture`114-mute-unmute.js`
  .page`http://localhost:4002`

test('Can mute and unmute an account', async t => {
  await loginAsFoobar(t)
  const post = 'blah blah blah'
  await postAs('admin', post)

  await t.expect(getNthStatus(1).innerText).contains(post, { timeout: 20000 })
    .click(getNthStatusOptionsButton(1))
  await sleep(1000)
  await t
    .click(getDialogOptionWithText('Mute @admin'))
  await sleep(1000)
  await t
    .click(confirmationDialogOKButton)
    .expect(modalDialog.exists).notOk()
  await sleep(1000)
  await t
    .click(communityNavButton)
    .click($('a[href="/muted"]'))
    .expect(getNthSearchResult(1).innerText).contains('@admin')
    .click(getNthSearchResult(1))
    .expect(getUrl()).contains('/accounts/1')
    .click(accountProfileMoreOptionsButton)
  await sleep(1000)
  await t
    .click(getDialogOptionWithText('Unmute @admin'))
  await sleep(1000)
  await t
    .click(accountProfileMoreOptionsButton)
    .expect(getDialogOptionWithText('Mute @admin').exists).ok()
  await sleep(1000)
  await t
    .click(closeDialogButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(accountProfileFollowButton.getAttribute('title')).eql('Unfollow')
})
