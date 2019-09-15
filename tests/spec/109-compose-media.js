import {
  composeButton,
  composeInput,
  getNthDeleteMediaButton,
  getNthMedia,
  getNthMediaAltInput,
  getNthMediaListItem,
  getNthStatusAndImage,
  getUrl,
  homeNavButton,
  mediaButton,
  notificationsNavButton,
  uploadKittenImage,
  composeMediaSensitiveCheckbox, getNthStatusAndSensitiveImage, getNthStatusAndSensitiveButton, getNthStatusContent
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`109-compose-media.js`
  .page`http://localhost:4002`

async function uploadTwoKittens (t) {
  await (uploadKittenImage(1)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
  await (uploadKittenImage(2)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
}

test('uploads alts for media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await uploadTwoKittens(t)
  await t.typeText(getNthMediaAltInput(2), 'kitten 2')
    .typeText(getNthMediaAltInput(1), 'kitten 1')
    .click(composeButton)
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('kitten 1')
    .expect(getNthStatusAndImage(1, 1).getAttribute('title')).eql('kitten 1')
    .expect(getNthStatusAndImage(1, 2).getAttribute('alt')).eql('kitten 2')
    .expect(getNthStatusAndImage(1, 2).getAttribute('title')).eql('kitten 2')
})

test('uploads alts when deleting and re-uploading media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await t.typeText(getNthMediaAltInput(1), 'this will be deleted')
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMedia(1).exists).notOk()
  await (uploadKittenImage(2)())
  await t.expect(getNthMediaAltInput(1).value).eql('')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten2.jpg')
    .typeText(getNthMediaAltInput(1), 'this will not be deleted')
    .click(composeButton)
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('this will not be deleted')
})

test('uploads alts mixed with no-alts', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await uploadTwoKittens(t)
  await t.typeText(getNthMediaAltInput(2), 'kitten numero dos')
    .click(composeButton)
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('')
    .expect(getNthStatusAndImage(1, 2).getAttribute('alt')).eql('kitten numero dos')
})

test('saves alts to local storage', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await uploadTwoKittens(t)
  await t.typeText(getNthMediaAltInput(1), 'kitten numero uno')
    .typeText(getNthMediaAltInput(2), 'kitten numero dos')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .click(composeButton)
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('kitten numero uno')
    .expect(getNthStatusAndImage(1, 2).getAttribute('alt')).eql('kitten numero dos')
})

test('can post a status with empty content if there is media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
    .typeText(composeInput, 'this is a toot')
  await (uploadKittenImage(1)())
  await t
    .typeText(getNthMediaAltInput(1), 'just an image!')
  await t.click(composeButton)
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('just an image!')
})

test('can make an image sensitive without adding a CW', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'this is just a kitteh')
  await (uploadKittenImage(2)())
  await t
    .typeText(getNthMediaAltInput(1), 'sensitive kitteh')
    .expect(composeMediaSensitiveCheckbox.checked).notOk()
    .click(composeMediaSensitiveCheckbox)
    .expect(composeMediaSensitiveCheckbox.checked).ok()
    .click(composeButton)
    .expect(getNthStatusContent(1).innerText).contains('this is just a kitteh')
    .expect(getNthStatusAndSensitiveImage(1, 1).getAttribute('src')).match(/^blob:http:\/\/localhost/)
    .click(getNthStatusAndSensitiveButton(1, 1))
    .expect(getNthStatusAndImage(1, 1).getAttribute('alt')).eql('sensitive kitteh')
})
