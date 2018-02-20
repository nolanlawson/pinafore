import { Selector as $ } from 'testcafe'
import { getNthVirtualArticle } from '../utils'
import { foobarRole } from '../roles'

const modalDialogContents = $('.modal-dialog-contents')
const closeDialogButton = $('.close-dialog-button')

fixture`08-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images and videos', async t => {
  await t.useRole(foobarRole)
    .hover(getNthVirtualArticle(3))
    .hover(getNthVirtualArticle(6))
    .hover(getNthVirtualArticle(7))
    .expect(getNthVirtualArticle(7).find('.status-media img').exists).notOk()
    .click(getNthVirtualArticle(7).find('.status-sensitive-media-button'))
    .expect(getNthVirtualArticle(7).find('.status-media img').getAttribute('alt')).eql('kitten')
    .expect(getNthVirtualArticle(7).find('.status-media img').hasAttribute('src')).ok()
    .hover(getNthVirtualArticle(8))
    .expect(getNthVirtualArticle(8).find('.status-media .play-video-button').exists).notOk()
    .click(getNthVirtualArticle(8).find('.status-sensitive-media-button'))
    .expect(getNthVirtualArticle(8).find('.status-media .play-video-button').exists).ok()
})

test('click and close image and video modals', async t => {
  await t.useRole(foobarRole)
    .hover(getNthVirtualArticle(3))
    .hover(getNthVirtualArticle(6))
    .hover(getNthVirtualArticle(7))
    .hover(getNthVirtualArticle(9))
    .expect(modalDialogContents.exists).notOk()
    .click(getNthVirtualArticle(9).find('.play-video-button'))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .hover(getNthVirtualArticle(11))
    .hover(getNthVirtualArticle(12))
    .click(getNthVirtualArticle(12).find('.show-image-button'))
    .expect(modalDialogContents.exists).ok()
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
})