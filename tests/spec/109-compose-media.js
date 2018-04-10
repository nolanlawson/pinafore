import {
  composeButton, getNthDeleteMediaButton, getNthMedia, getNthMediaAltInput, getNthStatusAndImage, getUrl,
  homeNavButton,
  mediaButton, notificationsNavButton, sleep,
  uploadKittenImage
} from '../utils'
import { foobarRole } from '../roles'

fixture`109-compose-media.js`
  .page`http://localhost:4002`

test('uploads alts for media', async t => {
  await t.useRole(foobarRole)
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await (uploadKittenImage(2)())
  await t.typeText(getNthMediaAltInput(2), 'kitten 2')
    .typeText(getNthMediaAltInput(1), 'kitten 1')
    .click(composeButton)
    .expect(getNthStatusAndImage(0, 0).getAttribute('alt')).eql('kitten 1')
    .expect(getNthStatusAndImage(0, 1).getAttribute('alt')).eql('kitten 2')
})

test('uploads alts when deleting and re-uploading media', async t => {
  await t.useRole(foobarRole)
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await t.typeText(getNthMediaAltInput(1), 'this will be deleted')
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMedia(1).exists).notOk()
  await (uploadKittenImage(2)())
  await t.expect(getNthMediaAltInput(1).value).eql('')
    .expect(getNthMedia(1).getAttribute('alt')).eql('kitten2.jpg')
    .typeText(getNthMediaAltInput(1), 'this will not be deleted')
    .click(composeButton)
    .expect(getNthStatusAndImage(0, 0).getAttribute('alt')).eql('this will not be deleted')
})

test('saves alts to local storage', async t => {
  await t.useRole(foobarRole)
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await (uploadKittenImage(2)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .typeText(getNthMediaAltInput(1), 'kitten numero uno')
    .typeText(getNthMediaAltInput(2), 'kitten numero dos')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .click(composeButton)
    .expect(getNthStatusAndImage(0, 0).getAttribute('alt')).eql('kitten numero uno')
    .expect(getNthStatusAndImage(0, 1).getAttribute('alt')).eql('kitten numero dos')
})
