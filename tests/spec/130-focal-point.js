import {
  sleep,
  composeInput,
  mediaButton,
  uploadKittenImage,
  getNthMediaAltInput,
  getNthMediaFocalPointButton,
  modalDialog,
  focalPointXInput,
  closeDialogButton,
  composeButton,
  focalPointYInput,
  getNthStatusContent,
  getNthStatusAndImage
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`130-focal-point.js`
  .page`http://localhost:4002`

test('Can set a focal point', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'here is a focal point')
    .click(mediaButton)
  await (uploadKittenImage(1)())
  await sleep(2000)
  await (uploadKittenImage(2)())
  await sleep(2000)
  await (uploadKittenImage(3)())
  await sleep(2000)
  await t
    .typeText(getNthMediaAltInput(1), 'kitten 1', { paste: true })
  await sleep(1000)
  await t
    .typeText(getNthMediaAltInput(2), 'kitten 2', { paste: true })
  await sleep(1000)
  await t
    .click(getNthMediaFocalPointButton(2))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk({ timeout: 30000 })
    .typeText(focalPointXInput, '0.5')
  await sleep(1000)
  await t
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
  await sleep(1000)
  await t
    .click(getNthMediaFocalPointButton(3))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk({ timeout: 30000 })
    .typeText(focalPointXInput, '-0.25')
    .typeText(focalPointYInput, '1')
  await sleep(1000)
  await t
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
  await sleep(1000)
  await t
    .click(composeButton)
    .expect(getNthStatusContent(1).innerText).contains('here is a focal point', { timeout: 30000 })
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('kitten 1')
    .expect(getNthStatusAndImage(1, 2).getAttribute('alt')).eql('kitten 2')
    .expect(getNthStatusAndImage(1, 3).getAttribute('alt')).eql('')
    .expect(getNthStatusAndImage(1, 1).getAttribute('style')).eql('object-position: 50% 50%;')
    .expect(getNthStatusAndImage(1, 2).getAttribute('style')).eql('object-position: 75% 50%;')
    .expect(getNthStatusAndImage(1, 3).getAttribute('style')).eql('object-position: 62.5% 0%;')
})
