import { Selector as $ } from 'testcafe'
import {
  closeDialogButton,
  composeModalInput,
  getNthFavorited,
  getNthStatus,
  getNthStatusContent,
  getNthStatusMedia,
  getNthStatusSensitiveMediaButton,
  getNthStatusSpoiler,
  getUrl, modalDialog,
  scrollToStatus
} from '../utils'
import { homeTimeline } from '../fixtures'
import { loginAsFoobar } from '../roles'
import { indexWhere } from '../../src/routes/_utils/arrays'

fixture`025-shortcuts-status.js`
  .page`http://localhost:4002`

function isNthStatusActive (idx) {
  return getNthStatus(idx).hasClass('status-active')
}

async function activateStatus (t, idx) {
  let timeout = 20000
  for (let i = 0; i <= idx; i++) {
    await t.expect(getNthStatus(i).exists).ok({ timeout })
      .pressKey('j')
      .expect(getNthStatus(i).hasClass('status-active')).ok()
  }
}

test('Shortcut j/k change the active status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(0).exists).ok({ timeout: 30000 })
    .expect(isNthStatusActive(0)).notOk()
    .pressKey('j')
    .expect(isNthStatusActive(0)).ok()
    .pressKey('j')
    .expect(isNthStatusActive(1)).ok()
    .pressKey('j')
    .expect(isNthStatusActive(2)).ok()
    .pressKey('j')
    .expect(isNthStatusActive(3)).ok()
    .pressKey('k')
    .expect(isNthStatusActive(2)).ok()
    .pressKey('k')
    .expect(isNthStatusActive(1)).ok()
    .pressKey('k')
    .expect(isNthStatusActive(0)).ok()
    .expect(isNthStatusActive(1)).notOk()
    .expect(isNthStatusActive(2)).notOk()
    .expect(isNthStatusActive(3)).notOk()
})

test('Shortcut j goes to the first visible status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await scrollToStatus(t, 10)
  await t
    .expect(getNthStatus(10).exists).ok({ timeout: 30000 })
    .pressKey('j')
    .expect($('.status-active').exists).ok()
    .expect($('.status-active').getBoundingClientRectProperty('top')).gte(0)
})

test('Shortcut o opens active status, backspace goes back', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(2).exists).ok({ timeout: 30000 })
    .pressKey('j') // activates status 0
    .pressKey('j') // activates status 1
    .pressKey('j') // activates status 2
    .expect(isNthStatusActive(2)).ok()
    .pressKey('o')
    .expect(getUrl()).contains('/statuses/')
    .pressKey('Backspace')
    .expect(isNthStatusActive(2)).ok()
})

test('Shortcut x shows/hides spoilers', async t => {
  let idx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await activateStatus(t, idx)
  await t
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .expect(getNthStatusSpoiler(idx).innerText).contains('kitten CW')
    .expect(getNthStatusContent(idx).hasClass('shown')).notOk()
    .pressKey('x')
    .expect(getNthStatusContent(idx).hasClass('shown')).ok()
    .pressKey('x')
    .expect(getNthStatusContent(idx).hasClass('shown')).notOk()
})

test('Shortcut y shows/hides sensitive image', async t => {
  let idx = indexWhere(homeTimeline, _ => _.content === "here's a secret kitten")
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await activateStatus(t, idx)
  await t
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .expect(getNthStatusSensitiveMediaButton(idx).exists).ok()
    .expect(getNthStatusMedia(idx).exists).notOk()
    .pressKey('y')
    .expect(getNthStatusMedia(idx).exists).ok()
    .pressKey('y')
    .expect(getNthStatusMedia(idx).exists).notOk()
})

test('Shortcut f toggles favorite status', async t => {
  let idx = indexWhere(homeTimeline, _ => _.content === 'this is unlisted')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(idx).exists).ok({ timeout: 30000 })
    .expect(getNthFavorited(idx)).eql('false')
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('f')
    .expect(getNthFavorited(idx)).eql('true')
    .pressKey('f')
    .expect(getNthFavorited(idx)).eql('false')
})

test('Shortcut p toggles profile', async t => {
  let idx = indexWhere(homeTimeline, _ => _.content === 'pinned toot 1')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(idx).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/3')
})

test('Shortcut m toggles mention', async t => {
  let idx = indexWhere(homeTimeline, _ => _.content === 'pinned toot 1')
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(idx).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(getNthStatus(idx).hasClass('status-active')).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@quux ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
