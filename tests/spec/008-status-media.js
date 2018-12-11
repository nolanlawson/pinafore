import { closeDialogButton, getNthStatus, getNthStatusSelector, modalDialogContents, scrollToStatus } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { homeTimeline } from '../fixtures'
import { indexWhere } from '../../src/routes/_utils/arrays'

fixture`008-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images and videos', async t => {
  await loginAsFoobar(t)

  let kittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  let videoIdx = indexWhere(homeTimeline, _ => _.content === 'secret video')

  await scrollToStatus(t, kittenIdx)
  await t.expect($(`${getNthStatusSelector(kittenIdx)} .status-media img`).exists).notOk()
    .click($(`${getNthStatusSelector(kittenIdx)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(kittenIdx)} .status-media img`).getAttribute('alt')).eql('kitten')
    .expect($(`${getNthStatusSelector(kittenIdx)} .status-media img`).hasAttribute('src')).ok()
    .hover(getNthStatus(videoIdx))
    .expect($(`${getNthStatusSelector(videoIdx)} .status-media .play-video-button`).exists).notOk()
    .click($(`${getNthStatusSelector(videoIdx)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(videoIdx)} .status-media .play-video-button`).exists).ok()
})

test('click and close image and video modals', async t => {
  await loginAsFoobar(t)

  let videoIdx = indexWhere(homeTimeline, _ => _.content === "here's a video")
  let kittenIdx = indexWhere(homeTimeline, _ => _.content === "here's an animated kitten gif")

  await scrollToStatus(t, videoIdx)
  await t.expect(modalDialogContents.exists).notOk()
    .click($(`${getNthStatusSelector(videoIdx)} .play-video-button`))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .hover(getNthStatus(kittenIdx - 1))
    .hover(getNthStatus(kittenIdx))
    .click($(`${getNthStatusSelector(kittenIdx)} .show-image-button`))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
})
