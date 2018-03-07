import { closeDialogButton, getNthStatus, modalDialogContents, scrollToStatus } from '../utils'
import { foobarRole } from '../roles'

fixture`008-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images and videos', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 7)
  await t.expect(getNthStatus(7).find('.status-media img').exists).notOk()
    .click(getNthStatus(7).find('.status-sensitive-media-button'))
    .expect(getNthStatus(7).find('.status-media img').getAttribute('alt')).eql('kitten')
    .expect(getNthStatus(7).find('.status-media img').hasAttribute('src')).ok()
    .hover(getNthStatus(8))
    .expect(getNthStatus(8).find('.status-media .play-video-button').exists).notOk()
    .click(getNthStatus(8).find('.status-sensitive-media-button'))
    .expect(getNthStatus(8).find('.status-media .play-video-button').exists).ok()
})

test('click and close image and video modals', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 9)
  await t.expect(modalDialogContents.exists).notOk()
    .click(getNthStatus(9).find('.play-video-button'))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .hover(getNthStatus(11))
    .hover(getNthStatus(12))
    .click(getNthStatus(12).find('.show-image-button'))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
})
