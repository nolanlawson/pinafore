import { closeDialogButton, getNthStatus, getNthStatusSelector, modalDialogContents, scrollToStatus } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`008-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images and videos', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 7)
  await t.expect($(`${getNthStatusSelector(7)} .status-media img`).exists).notOk()
    .click($(`${getNthStatusSelector(7)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(7)} .status-media img`).getAttribute('alt')).eql('kitten')
    .expect($(`${getNthStatusSelector(7)} .status-media img`).hasAttribute('src')).ok()
    .hover(getNthStatus(8))
    .expect($(`${getNthStatusSelector(8)} .status-media .play-video-button`).exists).notOk()
    .click($(`${getNthStatusSelector(8)} .status-sensitive-media-button`))
    .expect($(`${getNthStatusSelector(8)} .status-media .play-video-button`).exists).ok()
})

test('click and close image and video modals', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 9)
  await t.expect(modalDialogContents.exists).notOk()
    .click($(`${getNthStatusSelector(9)} .play-video-button`))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .hover(getNthStatus(11))
    .hover(getNthStatus(12))
    .click($(`${getNthStatusSelector(12)} .show-image-button`))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
})
