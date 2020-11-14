import {
  closeDialogButton,
  composeModalInput,
  getNthFavoritedLabel,
  getNthStatus,
  getNthStatusContent,
  getNthStatusMediaImg,
  getNthStatusSensitiveMediaButton,
  getNthStatusSpoiler,
  getUrl, modalDialog,
  scrollToStatus,
  isNthStatusActive, getActiveElementRectTop, scrollToTop, isActiveStatusPinned, getFirstModalMedia
} from '../utils'
import { homeTimeline } from '../fixtures'
import { loginAsFoobar } from '../roles'

import { Selector as $ } from 'testcafe'

fixture`025-shortcuts-status.js`
  .page`http://localhost:4002`

async function activateStatus (t, idx) {
  const timeout = 20000
  for (let i = 0; i <= idx; i++) {
    await t.expect(getNthStatus(1 + i).exists).ok({ timeout })
      .pressKey('j')
      .expect(isNthStatusActive(1 + i)()).ok()
  }
}

test('Shortcut j/k change the active status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .expect(isNthStatusActive(1)()).notOk()
    .pressKey('j')
    .expect(isNthStatusActive(1)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(2)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(3)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(4)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(3)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(2)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isNthStatusActive(2)()).notOk()
    .expect(isNthStatusActive(3)()).notOk()
    .expect(isNthStatusActive(4)()).notOk()
})

test('Shortcut j goes to the first visible status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await scrollToStatus(t, 11)
  await t
    .expect(getNthStatus(11).exists).ok({ timeout: 30000 })
    .pressKey('j')
    .expect(getActiveElementRectTop()).gte(0)
})

test('Shortcut o opens active status, backspace goes back', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(3).exists).ok({ timeout: 30000 })
    .pressKey('j') // activates status 0
    .pressKey('j') // activates status 1
    .pressKey('j') // activates status 2
    .expect(isNthStatusActive(3)()).ok()
    .pressKey('o')
    .expect(getUrl()).contains('/statuses/')
    .pressKey('Backspace')
    .expect(isNthStatusActive(3)()).ok()
})

test('Shortcut x shows/hides spoilers', async t => {
  const idx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await activateStatus(t, idx)
  await t
    .expect(isNthStatusActive(1 + idx)()).ok()
    .expect(getNthStatusSpoiler(1 + idx).innerText).contains('kitten CW')
    .expect(getNthStatusContent(1 + idx).hasClass('shown')).notOk()
    .pressKey('x')
    .expect(getNthStatusContent(1 + idx).hasClass('shown')).ok()
    .pressKey('x')
    .expect(getNthStatusContent(1 + idx).hasClass('shown')).notOk()
})

test('Shortcut y shows/hides sensitive image, i opens', async t => {
  const idx = homeTimeline.findIndex(_ => _.content === "here's a secret kitten")
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await activateStatus(t, idx)
  await t
    .expect(isNthStatusActive(1 + idx)()).ok()
    .expect(getNthStatusSensitiveMediaButton(1 + idx).exists).ok()
    .expect(getNthStatusMediaImg(1 + idx).getAttribute('src')).match(/^blob:http:\/\/localhost/)
    .pressKey('y')
    .expect(getNthStatusMediaImg(1 + idx).getAttribute('src')).match(/^http:\/\//)
    .pressKey('y')
    .expect(getNthStatusMediaImg(1 + idx).getAttribute('src')).match(/^blob:http:\/\/localhost/)
    .pressKey('i')
    .expect(getFirstModalMedia().getAttribute('alt')).eql('kitten')
})

test('Shortcut f toggles favorite status', async t => {
  const idx = homeTimeline.findIndex(_ => _.content === 'this is unlisted')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1 + idx).exists).ok({ timeout: 30000 })
    .expect(getNthFavoritedLabel(1 + idx)).eql('Favorite')
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('f')
    .expect(getNthFavoritedLabel(1 + idx)).eql('Unfavorite')
    .pressKey('f')
    .expect(getNthFavoritedLabel(1 + idx)).eql('Favorite')
})

test('Shortcut p toggles profile', async t => {
  const idx = homeTimeline.findIndex(_ => _.content === 'pinned toot 1')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1 + idx).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/3')
})

test('Shortcut m toggles mention', async t => {
  const idx = homeTimeline.findIndex(_ => _.content === 'pinned toot 1')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1 + idx).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@quux ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})

test('Shortcut j/k change the active status on a thread', async t => {
  await loginAsFoobar(t)
  await t
    .click($('a').withText('quux'))
  await scrollToStatus(t, 3)
  await t
    .click(getNthStatus(3))
    .expect(getUrl()).contains('/statuses')
  await scrollToStatus(t, 1)
  await scrollToTop()
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .expect(isNthStatusActive(1)()).notOk()
    .pressKey('j')
    .expect(isNthStatusActive(1)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(2)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(3)()).ok()
    .pressKey('j')
    .expect(isNthStatusActive(4)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(3)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(2)()).ok()
    .pressKey('k')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isNthStatusActive(2)()).notOk()
    .expect(isNthStatusActive(3)()).notOk()
    .expect(isNthStatusActive(4)()).notOk()
})

test('Shortcut j/k change the active status on pinned statuses', async t => {
  await loginAsFoobar(t)
  await t
    .click($('a').withText('quux'))
    .expect(getUrl()).contains('/accounts')
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .expect(isNthStatusActive(1)()).notOk()
    .pressKey('j')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isActiveStatusPinned()).eql(true)
    .pressKey('j')
    .expect(isNthStatusActive(2)()).ok()
    .expect(isActiveStatusPinned()).eql(true)
    .pressKey('j')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isActiveStatusPinned()).eql(false)
    .pressKey('j')
    .expect(isNthStatusActive(2)()).ok()
    .expect(isActiveStatusPinned()).eql(false)
    .pressKey('k')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isActiveStatusPinned()).eql(false)
    .pressKey('k')
    .expect(isNthStatusActive(2)()).ok()
    .expect(isActiveStatusPinned()).eql(true)
    .pressKey('k')
    .expect(isNthStatusActive(1)()).ok()
    .expect(isActiveStatusPinned()).eql(true)
})
