import {
  closeDialogButton,
  composeModalInput,
  getNthFavorited,
  getNthStatus,
  getUrl, modalDialog, notificationsNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`025-shortcuts-status.js`
  .page`http://localhost:4002`

test('Shortcut f toggles favorite status in notification', async t => {
  let idx = 0
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(idx).exists).ok({ timeout: 30000 })
    .expect(getNthFavorited(idx)).eql('false')
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('f')
    .expect(getNthFavorited(idx)).eql('true')
    .pressKey('f')
    .expect(getNthFavorited(idx)).eql('false')
})

test('Shortcut p toggles profile in a follow notification', async t => {
  let idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(0).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/3')
})

test('Shortcut m toggles mention in a follow notification', async t => {
  let idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(0).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@quux ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
