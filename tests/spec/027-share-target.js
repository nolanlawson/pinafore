import {
  closeDialogButton,
  composeModalInput,
  getUrl, goBack, modalDialog, notificationsNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`027-share-target.js`
  .page`http://localhost:4002`

const SHARE_URL = 'http://localhost:4002/share?' +
  'title=My+cool+title&' +
  'text=This+is+a+bit+clich%C3%A9&' +
  'url=http%3A%2F%2Fexample.com'

const SHARE_TEXT = 'My cool title This is a bit cliché http://example.com'

test('Share target works when page is not open', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('about:blank')
    .navigateTo(SHARE_URL)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql(SHARE_TEXT)
})

test('Share target works when page is open', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo(SHARE_URL)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql(SHARE_TEXT)
})

test('Share target page replaces itself in back nav history', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .navigateTo(SHARE_URL)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql(SHARE_TEXT)
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
  await goBack()
  await t
    .expect(getUrl()).contains('/notifications')
})

test('Share target does nothing when not logged in', async t => {
  await t
    .navigateTo(SHARE_URL)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(modalDialog.exists).notOk()
})
