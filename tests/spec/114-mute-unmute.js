import {
  accountProfileFollowButton,
  accountProfileMoreOptionsButton, communityNavButton, getNthSearchResult,
  getNthStatus, getNthStatusOptionsButton, getNthDialogOptionsOption, getUrl, modalDialog
} from '../utils'
import { Selector as $ } from 'testcafe'
import { foobarRole } from '../roles'
import { postAs } from '../serverActions'

fixture`114-mute-unmute.js`
  .page`http://localhost:4002`

test('Can mute and unmute an account', async t => {
  await t.useRole(foobarRole)
  let post = 'blah blah blah'
  await postAs('admin', post)

  await t.expect(getNthStatus(0).innerText).contains(post, {timeout: 20000})
    .click(getNthStatusOptionsButton(0))
    .expect(getNthDialogOptionsOption(1).innerText).contains('Unfollow @admin')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Block @admin')
    .expect(getNthDialogOptionsOption(3).innerText).contains('Mute @admin')
    .click(getNthDialogOptionsOption(3))
    .expect(modalDialog.exists).notOk()
    .click(communityNavButton)
    .click($('a[href="/muted"]'))
    .expect(getNthSearchResult(1).innerText).contains('@admin')
    .click(getNthSearchResult(1))
    .expect(getUrl()).contains('/accounts/1')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @admin')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unfollow @admin')
    .expect(getNthDialogOptionsOption(3).innerText).contains('Block @admin')
    .expect(getNthDialogOptionsOption(4).innerText).contains('Unmute @admin')
    .click(getNthDialogOptionsOption(4))
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @admin')
    .expect(getNthDialogOptionsOption(2).innerText).contains('Unfollow @admin')
    .expect(getNthDialogOptionsOption(3).innerText).contains('Block @admin')
    .expect(getNthDialogOptionsOption(4).innerText).contains('Mute @admin')
    .click(getNthDialogOptionsOption(2))
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
})
