import { getNthDeleteMediaButton, getNthMedia, mediaButton, uploadKittenImage } from '../utils'
import { foobarRole } from '../roles'

fixture`13-compose-media.js`
  .page`http://localhost:4002`

test('inserts media', async t => {
  await t.useRole(foobarRole)
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(1)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
  await (uploadKittenImage(2)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(3)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .expect(getNthMedia(3).getAttribute('alt')).eql('kitten3.jpg')
    .expect(mediaButton.hasAttribute('disabled')).notOk()
  await (uploadKittenImage(4)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .expect(getNthMedia(3).getAttribute('alt')).eql('kitten3.jpg')
    .expect(getNthMedia(4).getAttribute('alt')).eql('kitten4.jpg')
    .expect(mediaButton.getAttribute('disabled')).eql('')
    .click(getNthDeleteMediaButton(4))
    .click(getNthDeleteMediaButton(3))
    .click(getNthDeleteMediaButton(2))
    .click(getNthDeleteMediaButton(1))
})

test('removes media', async t => {
  await t.useRole(foobarRole)
  await (uploadKittenImage(1)())
  await (uploadKittenImage(2)())
  await t.expect(getNthMedia(1).getAttribute('alt')).eql('kitten1.jpg')
    .expect(getNthMedia(2).getAttribute('alt')).eql('kitten2.jpg')
    .click(getNthDeleteMediaButton(2))
    .expect(getNthMedia(2).exists).notOk()
    .expect(getNthMedia(1).exists).ok()
})
