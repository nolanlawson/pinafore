import {
  composeModalInput, getComposeModalNthMediaListItem,
  getUrl, modalDialogContents, simulateWebShare
} from '../utils'
import { loginAsFoobar } from '../roles'
import { ONE_TRANSPARENT_PIXEL } from '../../src/routes/_static/media'

fixture`027-web-share-and-web-shortcuts.js`
  .page`http://localhost:4002`

test('Can take a shortcut directly to a compose dialog', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .navigateTo('http://localhost:4002/?compose=true')
    .expect(modalDialogContents.exists).ok()
    .expect(composeModalInput.value).eql('')
    .expect(getComposeModalNthMediaListItem(1).exists).notOk()
})

test('Can share title/text using Web Share', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await (simulateWebShare({ title: 'my title', url: undefined, text: 'my text' })())
  await t
    .navigateTo('http://localhost:4002/?compose=true')
    .expect(modalDialogContents.exists).ok()
    .expect(composeModalInput.value).eql('my title\n\nmy text')
    .expect(getComposeModalNthMediaListItem(1).exists).notOk()
})

test('Can share a file using Web Share', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
  await (simulateWebShare({ title: undefined, url: undefined, text: undefined, file: ONE_TRANSPARENT_PIXEL })())
  await t
    .navigateTo('http://localhost:4002/?compose=true')
    .expect(modalDialogContents.exists).ok()
    .expect(composeModalInput.value).eql('')
    .expect(getComposeModalNthMediaListItem(1).exists).ok()
    .expect(getComposeModalNthMediaListItem(1).getAttribute('aria-label')).eql('media')
})
