import {
  closeDialogButton,
  composeButton,
  composeModalInput,
  composeModalPostPrivacyButton,
  dialogOptionsOption,
  getNthStatus,
  getNthStatusMediaButton,
  getNthStatusOptionsButton, getScrollTop,
  getUrl,
  goBack,
  goForward,
  homeNavButton,
  modalDialog,
  modalDialogBackdrop,
  notificationsNavButton,
  postPrivacyDialogButtonUnlisted,
  scrollToStatus,
  sleep,
  visibleModalDialog
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { homeTimeline } from '../fixtures'

fixture`029-back-button-modal.js`
  .page`http://localhost:4002`

test('Back button dismisses the modal', async t => {
  await loginAsFoobar(t)
  let idx = homeTimeline.findIndex(_ => (_.content || '').includes('2 kitten photos'))
  await scrollToStatus(t, idx + 1)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(idx + 1))
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Back button dismisses a nested modal', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .click(dialogOptionsOption.withText('Report'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(modalDialog.innerText).contains('Report')
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Forward and back buttons', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
  await goForward()
  await t
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Closing dialog pops history state', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).contains('/status')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).contains('/status')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Pressing backspace pops history state', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).contains('/status')
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).contains('/status')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Pressing Esc pops history state', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).contains('/status')
  await sleep(1000)
  await t
    .pressKey('esc')
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).contains('/status')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Clicking outside dialog pops history state', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).contains('/status')
    .click(modalDialogBackdrop, {
      offsetX: 1,
      offsetY: 1
    })
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).contains('/status')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('Closing nested modal pops history state', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getUrl()).contains('/status')
  await sleep(1000)
  await t
    .click(dialogOptionsOption.withText('Report'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(modalDialog.innerText).contains('Report')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).contains('/status')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
})

test('History works correctly for nested modal', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .click(homeNavButton)
  await scrollToStatus(t, 10)
  await t
    .click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .click(composeModalPostPrivacyButton)
    .expect(visibleModalDialog.textContent).contains('Post privacy')
  await sleep(1000)
  await t
    .pressKey('backspace')
  await t
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(getUrl()).contains('/notifications')
})

test('History works correctly for nested modal 2', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .click(homeNavButton)
  await scrollToStatus(t, 10)
  await t
    .click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .click(composeModalPostPrivacyButton)
    .expect(visibleModalDialog.textContent).contains('Post privacy')
  await sleep(1000)
  await t
    .click(postPrivacyDialogButtonUnlisted)
  await t
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
  await sleep(1000)
  await goBack()
  await t
    .expect(modalDialog.exists).notOk()
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(getUrl()).contains('/notifications')
})

test('History works correctly for nested modal 3', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .click(homeNavButton)
  await scrollToStatus(t, 10)
  await t
    .click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .click(composeModalPostPrivacyButton)
    .expect(visibleModalDialog.textContent).contains('Post privacy')
  await sleep(1000)
  await t
    .click(closeDialogButton)
  await t
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
  await sleep(1000)
  await t
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await goBack()
  await t
    .expect(getUrl()).contains('/notifications')
})

test('History and scroll position work correctly for link in compose dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 10)
  await t
    .expect(getScrollTop()).notEql(0)
    .click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .click($('.modal-dialog-document .compose-box-display-name'))
    .expect(getUrl()).contains('/accounts')
    .expect(getScrollTop()).eql(0)
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getScrollTop()).notEql(0)
})
