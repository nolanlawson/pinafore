import {
  composeContentWarning,
  composeInput, composeMediaSensitiveCheckbox, contentWarningButton,
  getNthDeleteMediaButton,
  getNthMedia,
  getNthMediaAltInput,
  getNthMediaListItem,
  homeNavButton,
  mediaButton,
  settingsNavButton,
  sleep,
  uploadKittenImage
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`013-compose-media.js`
  .page`http://localhost:4002`

test('inserts media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
  await (uploadKittenImage(2)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(3)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .expect(getNthMediaListItem(3).getAttribute('aria-label')).eql('kitten3.jpg')
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(4)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .expect(getNthMediaListItem(3).getAttribute('aria-label')).eql('kitten3.jpg')
    .expect(getNthMediaListItem(4).getAttribute('aria-label')).eql('kitten4.jpg')
    .expect(mediaButton.getAttribute('disabled')).eql('')
    .click(getNthDeleteMediaButton(4))
    .click(getNthDeleteMediaButton(3))
    .click(getNthDeleteMediaButton(2))
    .click(getNthDeleteMediaButton(1))
    .expect(mediaButton.hasAttribute('disabled')).notOk()
})

test('removes media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.exists).ok()
  await (uploadKittenImage(1)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
  await (uploadKittenImage(2)())
  await t.expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .click(getNthDeleteMediaButton(2))
    .expect(getNthMedia(2).exists).notOk()
    .expect(getNthMedia(1).exists).ok()
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMedia(2).exists).notOk()
})

test('does not add URLs as media is added/removed', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'this is a toot')
    .expect(mediaButton.exists).ok()
  await (uploadKittenImage(1)())
  await sleep(500)
  await t.expect(composeInput.value).eql('this is a toot')
  await (uploadKittenImage(1)())
  await sleep(500)
  await t.expect(composeInput.value).eql('this is a toot')
    .click(getNthDeleteMediaButton(1))
    .expect(composeInput.value).eql('this is a toot')
    .click(getNthDeleteMediaButton(1))
    .expect(composeInput.value).eql('this is a toot')
})

test('keeps media descriptions as media is removed', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.exists).ok()
  await (uploadKittenImage(1)())
  await t
    .typeText(getNthMediaAltInput(1), 'kitten numero uno')
  await (uploadKittenImage(2)())
  await t
    .typeText(getNthMediaAltInput(2), 'kitten numero dos')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMediaAltInput(1).value).eql('kitten numero dos')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten2.jpg')
})

test('keeps media in local storage', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.exists).ok()
  await (uploadKittenImage(1)())
  await t
    .typeText(getNthMediaAltInput(1), 'kitten numero uno')
  await (uploadKittenImage(2)())
  await t
    .typeText(getNthMediaAltInput(2), 'kitten numero dos')
  await t
    .typeText(composeInput, 'hello hello')
    .expect(composeInput.value).eql('hello hello')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
  await sleep(1)
  await t
    .click(settingsNavButton)
    .click(homeNavButton)
    .expect(composeInput.value).eql('hello hello')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
    .navigateTo('/')
    .expect(composeInput.value).eql('hello hello')
    .expect(getNthMediaAltInput(1).value).eql('kitten numero uno')
    .expect(getNthMediaAltInput(2).value).eql('kitten numero dos')
    .expect(getNthMediaListItem(1).getAttribute('aria-label')).eql('kitten1.jpg')
    .expect(getNthMediaListItem(2).getAttribute('aria-label')).eql('kitten2.jpg')
})

test('resets sensitive settings when deleting media', async t => {
  await loginAsFoobar(t)
  await t
    .expect(mediaButton.exists).ok()
  await (uploadKittenImage(1)())
  await t
    .click(composeMediaSensitiveCheckbox)
    .expect(composeMediaSensitiveCheckbox.checked).ok()
  await (uploadKittenImage(2)())
  await t
    .expect(composeMediaSensitiveCheckbox.checked).ok()
    .click(getNthDeleteMediaButton(2))
    .expect(getNthMedia(2).exists).notOk()
    .expect(composeMediaSensitiveCheckbox.checked).ok()
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMedia(1).exists).notOk()
  await (uploadKittenImage(1)())
  await t
    .expect(composeMediaSensitiveCheckbox.checked).notOk()
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'warn warn warn', { paste: true })
    .expect(composeMediaSensitiveCheckbox.checked).ok()
    .click(getNthDeleteMediaButton(1))
    .expect(getNthMedia(1).exists).notOk()
  await (uploadKittenImage(1)())
  await t
    .expect(composeMediaSensitiveCheckbox.checked).ok()
})
