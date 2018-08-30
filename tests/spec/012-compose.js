import { Selector as $ } from 'testcafe'
import {
  composeButton, composeInput, composeLengthIndicator, emojiButton, getComposeSelectionStart,
  getNthStatusContent, getUrl,
  homeNavButton,
  notificationsNavButton, sleep,
  times
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`012-compose.js`
  .page`http://localhost:4002`

test('shows compose limits', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .expect(composeLengthIndicator.innerText).eql('500')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .typeText(composeInput, 'typing some text')
    .expect(composeLengthIndicator.innerText).eql('484')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .typeText(composeInput, times(50, () => 'hello world').join(' '), { replace: true, paste: true })
    .expect(composeLengthIndicator.innerText).eql('-99')
    .expect(composeButton.getAttribute('disabled')).eql('')
    .typeText(composeInput, 'hello world', { replace: true })
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(composeInput.value).eql('hello world')
    .expect(composeLengthIndicator.innerText).eql('489')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .selectText(composeInput)
    .pressKey('delete')
    .expect(composeInput.value).eql('')
    .expect(composeLengthIndicator.innerText).eql('500')
    .expect(composeButton.hasAttribute('disabled')).notOk()
})

test('shows compose limits for URLs/handles', async t => {
  await loginAsFoobar(t)
  await t
    .expect(composeLengthIndicator.innerText).eql('500')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .typeText(composeInput, 'hello world ' +
      'http://foo.bar.baz.whatever.example.com/hello ' +
      '@reallylongnamethatstretchesonandon@foo.example.com', { paste: true })
    .expect(composeLengthIndicator.innerText).eql('429')
    .expect(composeButton.hasAttribute('disabled')).notOk()
})

test('shows compose limits for emoji', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hello world \ud83c\ude01 \ud83d\udc6a')
    .expect(composeLengthIndicator.innerText).eql('485')
    .expect(composeButton.hasAttribute('disabled')).notOk()
})

test('shows compose limits for custom emoji', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hello world ')
    .click(emojiButton)
    .click($('button img[title=":blobnom:"]'))
    .expect(composeInput.value).eql('hello world :blobnom: ')
    .expect(composeLengthIndicator.innerText).eql('478')
})

test('inserts custom emoji correctly', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hello world')
    .selectText(composeInput, 6, 6)
    .expect(getComposeSelectionStart()).eql(6)
    .click(emojiButton)
    .click($('button img[title=":blobpats:"]'))
    .expect(composeInput.value).eql('hello :blobpats: world')
    .selectText(composeInput, 0, 0)
    .expect(getComposeSelectionStart()).eql(0)
    .click(emojiButton)
    .click($('button img[title=":blobnom:"]'))
    .expect(composeInput.value).eql(':blobnom: hello :blobpats: world')
    .typeText(composeInput, ' foobar ')
    .click(emojiButton)
    .click($('button img[title=":blobpeek:"]'))
    .expect(composeInput.value).eql(':blobnom: hello :blobpats: world foobar :blobpeek: ')
})

test('inserts emoji without typing anything', async t => {
  await loginAsFoobar(t)
  await t
    .click(emojiButton)
    .click($('button img[title=":blobpats:"]'))
    .expect(composeInput.value).eql(':blobpats: ')
    .click(emojiButton)
    .click($('button img[title=":blobpeek:"]'))
    .expect(composeInput.value).eql(':blobpeek: :blobpats: ')
})

test('cannot post an empty status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(0).innerText).contains('pinned toot 1')
    .click(composeButton)
  await sleep(2)
  await t
    .expect(getNthStatusContent(0).innerText).contains('pinned toot 1')
})
