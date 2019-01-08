import { getUrl, notificationsNavButton } from '../utils'
import { loginAsFoobar } from '../roles'

fixture`024-shortcuts-navigation.js`
  .page`http://localhost:4002`

test('Shortcut g+l goes to the local timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g l')
    .expect(getUrl()).contains('/local')
})

test('Shortcut g+t goes to the federated timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g t')
    .expect(getUrl()).contains('/federated')
})

test('Shortcut g+h goes back to the home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .pressKey('g h')
})

test('Shortcut g+f goes to the favorites', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g f')
    .expect(getUrl()).contains('/favorites')
})

test('Shortcut g+c goes to the community page', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g c')
    .expect(getUrl()).contains('/community')
})

test('Shortcut s goes to the search page', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('s')
    .expect(getUrl()).contains('/search')
})

test('Shortcut backspace goes back from favorites', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .pressKey('g t')
    .expect(getUrl()).contains('/federated')
    .pressKey('g f')
    .expect(getUrl()).contains('/favorites')
    .pressKey('Backspace')
    .expect(getUrl()).contains('/federated')
})
