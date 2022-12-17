import {
  closeDialogButton,
  composeModalInput,
  getNthStatus,
  getUrl, modalDialog, notificationsNavButton,
  isNthStatusActive, goBack,
  getNthFavoritedLabel
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`026-shortcuts-notification.js`
  .page`http://localhost:4002`

test('Shortcut f toggles favorite status in notification', async t => {
  const idx = 6 // "hello foobar"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })

  for (let i = 0; i < idx + 1; i++) {
    await t.pressKey('j')
      .expect(getNthStatus(1 + i).exists).ok()
      .expect(isNthStatusActive(1 + i)()).ok()
  }

  await t
    .expect(getNthFavoritedLabel(1 + idx)).eql('Favorite')
    .pressKey('f')
    .expect(getNthFavoritedLabel(1 + idx)).eql('Unfavorite')
    .pressKey('f')
    .expect(getNthFavoritedLabel(1 + idx)).eql('Favorite')
})

test('Shortcut p toggles profile in a follow notification', async t => {
  const idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/3')
  await goBack()
  await t
    .expect(isNthStatusActive(1 + idx)()).ok() // focus preserved
})

test('Shortcut m toggles mention in a follow notification', async t => {
  const idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@quux ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})

test('Shortcut p refers to booster in a boost notification', async t => {
  const idx = 1 // "@admin boosted your status"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/1')
})

test('Shortcut m refers to favoriter in a favorite notification', async t => {
  const idx = 0 // "@admin favorited your status"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@admin ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
