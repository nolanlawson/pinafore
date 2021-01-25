import {
  disableHotkeys,
  getActiveElementAriaLabel,
  getNthStatus,
  getUrl, homeNavButton, isNthStatusActive, leftRightChangesFocus, modalDialog,
  modalDialogContents,
  notificationsNavButton, scrollToStatus, settingsNavButton, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`024-shortcuts-navigation.js`
  .page`http://localhost:4002`

test('Shortcut g+l goes to the local timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g l')
    .expect(getUrl()).contains('/local')
})

test('Shortcut g+t goes to the federated timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g t')
    .expect(getUrl()).contains('/federated')
})

test('Shortcut g+h goes back to the home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .pressKey('g h')
})

test('Shortcut g+f goes to the favorites', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g f')
    .expect(getUrl()).contains('/favorites')
})

test('Shortcut g+c goes to the community page', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g c')
    .expect(getUrl()).contains('/community')
})

test('Shortcut s goes to the search page', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('s')
    .expect(getUrl()).contains('/search')
})

test('Shortcut / goes to the search page', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('/')
    .expect(getUrl()).contains('/search')
})

test('Shortcut backspace goes back from favorites', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g t')
    .expect(getUrl()).contains('/federated')
    .pressKey('g f')
    .expect(getUrl()).contains('/favorites')
    .pressKey('backspace')
    .expect(getUrl()).contains('/federated')
})

test('Shortcut h toggles shortcut help dialog', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('h')
    .expect(modalDialogContents.exists).ok()
    .expect(modalDialogContents.hasClass('shortcut-help-modal-dialog')).ok()
    .pressKey('h')
    .expect(modalDialogContents.exists).notOk()
})

test('Global shortcut has no effects while in modal dialog', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g f')
    .expect(getUrl()).contains('/favorites')
    .pressKey('h')
    .expect(modalDialogContents.exists).ok()
    .pressKey('s') // does nothing
    .expect(getUrl()).contains('/favorites')
    .pressKey('backspace')
    .expect(modalDialogContents.exists).notOk()
    .pressKey('s') // now works
    .expect(getUrl()).contains('/search')
})

test('Shortcut 1 goes to the home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('1')
    .expect(getUrl()).contains('/')
})

test('Shortcut 6 goes to the settings', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('6')
    .expect(getUrl()).contains('/settings')
})

test('Shortcut . scrolls to top and focuses', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
  await scrollToStatus(t, 10)
  await t
    .pressKey('.')
    .expect(isNthStatusActive(1)()).ok()
})

test('Shortcut left and right changes columns', async t => {
  await loginAsFoobar(t)

  const steps = [
    ['right', 'notifications'],
    ['right', 'local'],
    ['right', 'community'],
    ['right', 'search'],
    ['right', 'settings'],
    ['right', 'settings'],
    ['left', 'search'],
    ['left', 'community'],
    ['left', 'local'],
    ['left', 'notifications'],
    ['left', ''],
    ['left', '']
  ]

  await t
    .expect(getUrl()).eql('http://localhost:4002/')

  for (const [key, page] of steps) {
    await t.pressKey(key)
      .expect(getUrl()).eql('http://localhost:4002/' + page)
  }
})

test('Shortcut left and right can change focus', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/hotkeys"]'))
    .click(leftRightChangesFocus)
    .expect(leftRightChangesFocus.checked).ok()
    .click(homeNavButton)
  await sleep(1000)
  await t
    .pressKey('right')
    .expect(getActiveElementAriaLabel()).eql('Home (current page)')
    .pressKey('right')
    .expect(getActiveElementAriaLabel()).eql('Notifications')
    .pressKey('left')
    .expect(getActiveElementAriaLabel()).eql('Home (current page)')
})

test('Shortcuts can be disabled', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/hotkeys"]'))
    .click(disableHotkeys)
    .expect(disableHotkeys.checked).ok()
    .click(homeNavButton)
    .pressKey('2')
  await sleep(500)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('h')
  await sleep(500)
  await t
    .expect(modalDialog.exists).false
})

test('Shortcut left/right works on settings page', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/hotkeys"]'))
    .expect(getUrl()).contains('/settings/hotkeys')
    .expect(settingsNavButton.getAttribute('aria-current')).eql('true')
    .pressKey('left')
    .expect(settingsNavButton.getAttribute('aria-current')).notEql('true')
    .expect(getUrl()).contains('/search')
    .pressKey('right')
    .expect(getUrl()).match(/\/settings$/)
    .expect(settingsNavButton.getAttribute('aria-current')).eql('true')
})
