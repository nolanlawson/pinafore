import {
  composeButton, composeContentWarning, composeInput, contentWarningButton,
  getNthShowOrHideButton, getNthStatus
} from '../utils'
import { foobarRole } from '../roles'

fixture`110-compose-content-warnings.js`
  .page`http://localhost:4002`

test('content warnings are posted', async t => {
  await t.useRole(foobarRole)
    .typeText(composeInput, 'hello this is a toot', {paste: true})
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'CW', {paste: true})
    .click(composeButton)
    .expect(getNthStatus(0).find('.status-spoiler').innerText).contains('CW', {timeout: 30000})
    .click(getNthShowOrHideButton(0))
    .expect(getNthStatus(0).find('.status-content').innerText).contains('hello this is a toot')
    .click(getNthShowOrHideButton(0))
    .expect(getNthStatus(0).innerText).notContains('hello this is a toot')
})

test('content warnings are not posted if removed', async t => {
  await t.useRole(foobarRole)
    .typeText(composeInput, 'hi this is another toot', {paste: true})
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'content warning!', {paste: true})
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).notOk()
    .click(composeButton)
    .expect(getNthStatus(0).innerText).contains('hi this is another toot', {timeout: 30000})
    .expect(getNthStatus(0).innerText).notContains('content warning!')
    .expect(getNthStatus(0).find('.status-content').innerText).contains('hi this is another toot')
})

test('content warnings can have emoji', async t => {
  await t.useRole(foobarRole)
    .typeText(composeInput, 'I can: :blobnom:')
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'can you feel the :blobpats: tonight')
    .click(composeButton)
    .expect(getNthStatus(0).innerText).contains('can you feel the', {timeout: 30000})
    .expect(getNthStatus(0).find('.status-spoiler img.status-emoji').getAttribute('alt')).eql(':blobpats:')
    .click(getNthShowOrHideButton(0))
    .expect(getNthStatus(0).find('.status-content img.status-emoji').getAttribute('alt')).eql(':blobnom:')
})

test('no XSS in content warnings or text', async t => {
  let pwned1 = `<script>alert("pwned!")</script>`
  let pwned2 = `<script>alert("pwned from CW!")</script>`
  await t.useRole(foobarRole)
    .typeText(composeInput, pwned1)
    .click(contentWarningButton)
    .typeText(composeContentWarning, pwned2)
    .click(composeButton)
    .expect(getNthStatus(0).find('.status-spoiler').innerText).contains(pwned2)
    .click(getNthShowOrHideButton(0))
    .expect(getNthStatus(0).find('.status-content').innerText).contains(pwned1)
})
