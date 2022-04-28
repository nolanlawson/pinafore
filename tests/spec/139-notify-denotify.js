import {
  accountProfileMoreOptionsButton,
  getNthStatus,
  getNthStatusOptionsButton,
  getUrl,
  modalDialog,
  sleep, getDialogOptionWithText, getNthStatusAccountLink, notificationsNavButton, getNthStatusHeader
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postAs } from '../serverActions'

fixture`139-notify-denotify.js`
  .page`http://localhost:4002`

test('Can notify and denotify an account', async t => {
  await loginAsFoobar(t)
  const post = 'ha ha ha'
  await postAs('admin', post)

  await t.expect(getNthStatus(1).innerText).contains(post, { timeout: 20000 })
    .click(getNthStatusOptionsButton(1))
  await sleep(1000)
  await t.click(getDialogOptionWithText('Subscribe to @admin'))
  await sleep(1000)
  await t
    .expect(modalDialog.exists).notOk()
  await sleep(1000)
  const notificationPost = 'get a notification for this'
  await postAs('admin', notificationPost)
  await sleep(1000)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (1 notification)', {
      timeout: 20000
    })
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
  await t
    .expect(getNthStatus(1).innerText).contains(notificationPost, { timeout: 20000 })
    .expect(getNthStatusHeader(1).innerText).contains('posted')
    .click(getNthStatusAccountLink(1))
    .expect(getUrl()).contains('/accounts/1')
    .click(accountProfileMoreOptionsButton)
  await sleep(1000)
  await t.click(getDialogOptionWithText('Unsubscribe from @admin'))
  await sleep(1000)
  await t.click(accountProfileMoreOptionsButton)
  await t
    .expect(getDialogOptionWithText('Subscribe to @admin').exists).ok()
})
