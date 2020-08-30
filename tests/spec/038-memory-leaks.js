import {
  accountProfileName,
  closeDialogButton,
  composeInput,
  getNthAutosuggestionResult,
  getNthStatusMediaButton, getNthStatusSensitiveMediaButton,
  getNthStatus,
  getNumSyntheticListeners,
  getUrl,
  homeNavButton, modalDialog, notificationsNavButton,
  scrollToStatus,
  scrollToTop,
  settingsNavButton, sleep, getNumStoreListeners
} from '../utils'
import { loginAsFoobar } from '../roles'
import { installDomListenerListener, getNumDomListeners } from '../spyDomListeners'
import { homeTimeline } from '../fixtures'
import { Selector as $ } from 'testcafe'

fixture`038-memory-leaks.js`
  .page`http://localhost:4002`

async function runMemoryLeakTest (t, firstStep, secondStep) {
  await loginAsFoobar(t)
  await installDomListenerListener()
  await firstStep()
  await sleep(1000)
  const numSyntheticListeners = await getNumSyntheticListeners()
  const numDomListeners = await getNumDomListeners()
  const numStoreListeners = await getNumStoreListeners()
  await t
    .expect(numSyntheticListeners).typeOf('number')
    .expect(numDomListeners).typeOf('number')
    .expect(numStoreListeners).typeOf('number')
  await secondStep()
  await sleep(1000)
  await t
    .expect(getNumSyntheticListeners()).eql(numSyntheticListeners)
    .expect(getNumDomListeners()).eql(numDomListeners)
    .expect(getNumStoreListeners()).eql(numStoreListeners)
}

async function goToSettings (t) {
  await t
    .click(settingsNavButton)
    .expect(getUrl()).contains('/settings')
}

async function scrollUpAndDownAndDoAutosuggest (t) {
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  await scrollToStatus(t, 15)
  await scrollToTop()
  await t
    .typeText(composeInput, 'hey @qu')
    .expect(getNthAutosuggestionResult(1).find('.sr-only').innerText).contains('@quux')
  await goToSettings(t)
}

async function openAndCloseMediaModal (t) {
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  const idx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, idx + 1)
  await t
    .click(getNthStatusSensitiveMediaButton(idx + 1))
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
  await goToSettings(t)
}

async function openAProfileAndNotifications (t) {
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click($('.status-author-name').withText(('quux')))
    .expect(getUrl()).contains('/accounts/3')
    .expect(accountProfileName.innerText).contains('quux')
    .click(notificationsNavButton)
    .hover(getNthStatus(1))
  await goToSettings(t)
}

test('Does not leak listeners in timeline or autosuggest', async t => {
  await runMemoryLeakTest(
    t,
    () => goToSettings(t),
    () => scrollUpAndDownAndDoAutosuggest(t)
  )
})

test('Does not leak listeners in modal', async t => {
  await runMemoryLeakTest(
    t,
    () => goToSettings(t),
    () => openAndCloseMediaModal(t)
  )
})

test('Does not leak listeners in account profile or notifications page', async t => {
  await runMemoryLeakTest(
    t,
    () => goToSettings(t),
    () => openAProfileAndNotifications(t)
  )
})
