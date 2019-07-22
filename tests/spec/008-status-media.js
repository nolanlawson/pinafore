import { closeDialogButton, getNthStatus, getNthStatusSelector, modalDialogContents, scrollToStatus } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { homeTimeline } from '../fixtures'

fixture`008-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images and videos', async t => {
  await loginAsFoobar(t)

  const kittenIdx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  const videoIdx = homeTimeline.findIndex(_ => _.content === 'secret video')

  await scrollToStatus(t, 1 + kittenIdx)
  await t.expect($(`${getNthStatusSelector(1 + kittenIdx)} .status-media img`).exists).notOk()
    .click($(`${getNthStatusSelector(1 + kittenIdx)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(1 + kittenIdx)} .status-media img`).getAttribute('alt')).eql('kitten')
    .expect($(`${getNthStatusSelector(1 + kittenIdx)} .status-media img`).hasAttribute('src')).ok()
    .hover(getNthStatus(1 + videoIdx))
    .expect($(`${getNthStatusSelector(1 + videoIdx)} .status-media .play-video-button`).exists).notOk()
    .click($(`${getNthStatusSelector(1 + videoIdx)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(1 + videoIdx)} .status-media .play-video-button`).exists).ok()
})

test('click and close image and video modals', async t => {
  await loginAsFoobar(t)

  const videoIdx = homeTimeline.findIndex(_ => _.content === "here's a video")
  const kittenIdx = homeTimeline.findIndex(_ => _.content === "here's an animated kitten gif")

  await scrollToStatus(t, 1 + videoIdx)
  await t.expect(modalDialogContents.exists).notOk()
    .click($(`${getNthStatusSelector(1 + videoIdx)} .play-video-button`))
    .expect(modalDialogContents.exists).ok()
    .expect($('.modal-dialog video').getAttribute('src')).contains('mp4')
    .expect($('.modal-dialog video').getAttribute('poster')).contains('png')
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .hover(getNthStatus(1 + kittenIdx - 1))
    .hover(getNthStatus(1 + kittenIdx))
    .click($(`${getNthStatusSelector(1 + kittenIdx)} .show-image-button`))
    .expect(modalDialogContents.exists).ok()
    .expect($('.modal-dialog video').getAttribute('src')).contains('mp4')
    .expect($('.modal-dialog video').getAttribute('poster')).contains('png')
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
})
