import {
  closeDialogButton,
  dialogOptionsOption,
  getNthStatus, getNthStatusMediaButton, getNthStatusOptionsButton,
  getUrl, goBack, goForward,
  modalDialog, modalDialogBackdrop, scrollToStatus, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`029-back-button-modal.js`
  .page`http://localhost:4002`

test('Back button dismisses the modal', async t => {
  await loginAsFoobar(t)
  let idx = indexWhere(homeTimeline, _ => (_.content || '').includes('2 kitten photos'))
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
