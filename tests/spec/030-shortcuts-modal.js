import {
  getMediaScrollLeft,
  getNthStatusMediaButton, getNthStatusOptionsButton,
  modalDialog, scrollToStatus, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'

import { homeTimeline } from '../fixtures'

fixture`030-shortcuts-modal.js`
  .page`http://localhost:4002`

test('Backspace dismisses modal', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})

test('Backspace dismisses media modal', async t => {
  await loginAsFoobar(t)
  let idx = homeTimeline.findIndex(_ => (_.content || '').includes('2 kitten photos'))
  await scrollToStatus(t, idx + 1)
  await t
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})

test('Left/right changes active media in modal', async t => {
  await loginAsFoobar(t)
  let idx = homeTimeline.findIndex(_ => (_.content || '').includes('2 kitten photos'))
  await scrollToStatus(t, idx + 1)
  await t
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getMediaScrollLeft()).eql(0)
  await sleep(1000)
  await t
    .pressKey('right')
    .expect(getMediaScrollLeft()).gt(0)
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})
