import { Selector as $ } from 'testcafe'
import {
  addInstanceButton,
  authorizeInput,
  emailInput,
  formError,
  getFirstVisibleStatus, getOpacity,
  getUrl,
  homeNavButton,
  instanceInput,
  logInToInstanceLink,
  mastodonLogInButton,
  passwordInput, reload,
  settingsButton,
  sleep
} from '../utils'

fixture`002-login-spec.js`
  .page`http://localhost:4002`

function manualLogin (t, username, password) {
  return t.click(logInToInstanceLink)
    .expect(getUrl()).contains('/settings/instances/add')
    .typeText(instanceInput, 'localhost:3000')
    .click(addInstanceButton)
    .expect(getUrl()).eql('http://localhost:3000/auth/sign_in', { timeout: 30000 })
    .typeText(emailInput, username, { paste: true })
    .typeText(passwordInput, password, { paste: true })
    .click(mastodonLogInButton)
    .expect(getUrl()).contains('/oauth/authorize')
    .click(authorizeInput)
    .expect(getUrl()).eql('http://localhost:4002/')
}

test('Cannot log in to a fake instance', async t => {
  await sleep(500)
  await t.click(logInToInstanceLink)
    .expect(getUrl()).contains('/settings/instances/add')
    .typeText(instanceInput, 'fake.nolanlawson.com', { paste: true })
    .click(addInstanceButton)
    .expect(formError.exists).ok()
    .expect(formError.innerText).contains('Is this a valid Mastodon instance?')
    .typeText(instanceInput, '.biz', { paste: true })
    .expect(formError.exists).notOk()
    .typeText(instanceInput, 'fake.nolanlawson.com', { paste: true, replace: true })
    .expect(formError.exists).ok()
    .expect(formError.innerText).contains('Is this a valid Mastodon instance?')
})

test('Logs in and logs out of localhost:3000', async t => {
  await sleep(500)
  await manualLogin(t, 'foobar@localhost:3000', 'foobarfoobar')
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getFirstVisibleStatus())
    .expect($('article.status-article').exists).ok()
    .click(settingsButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .expect(getUrl()).contains('/settings/instances/localhost:3000')
    .expect($('.instance-name-h1').innerText).eql('localhost:3000')
    .expect($('.acct-handle').innerText).eql('@foobar')
    .expect($('.acct-display-name').innerText).eql('foobar')
    .click($('button').withText('Log out'))
    .click($('.modal-dialog button').withText('OK'))
    .expect($('.main-content').innerText).contains("You're not logged in to any instances")
    .click(homeNavButton)
    // check that the "hidden from SSR" content is visible
    .expect(getOpacity('.hidden-from-ssr')()).eql('1')
    .navigateTo('/')
    .expect(getOpacity('.hidden-from-ssr')()).eql('1')
  await reload()
  await t
    .expect(getOpacity('.hidden-from-ssr')()).eql('1')
})
