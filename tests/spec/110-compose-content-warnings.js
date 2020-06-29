import {
  composeButton, composeContentWarning, composeInput, contentWarningButton,
  getNthShowOrHideButton, getNthStatus, getNthStatusSelector
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`110-compose-content-warnings.js`
  .page`http://localhost:4002`

test('content warnings are posted', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hello this is a toot', { paste: true })
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'CW', { paste: true })
    .click(composeButton)
    .expect($(`${getNthStatusSelector(1)} .status-spoiler`).innerText).contains('CW', { timeout: 30000 })
    .click(getNthShowOrHideButton(1))
    .expect($(`${getNthStatusSelector(1)} .status-content`).innerText).contains('hello this is a toot')
    .click(getNthShowOrHideButton(1))
    .expect(getNthStatus(1).innerText).notContains('hello this is a toot')
})

test('content warnings are not posted if removed', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hi this is another toot', { paste: true })
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'content warning!', { paste: true })
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).notOk()
    .click(composeButton)
    .expect(getNthStatus(1).innerText).contains('hi this is another toot', { timeout: 30000 })
    .expect(getNthStatus(1).innerText).notContains('content warning!')
    .expect($(`${getNthStatusSelector(1)} .status-content`).innerText).contains('hi this is another toot')
})

test('content warnings can have emoji', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'I can: :blobnom: ')
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'can you feel the :blobpats: tonight')
    .click(composeButton)
    .expect(getNthStatus(1).innerText).contains('can you feel the', { timeout: 30000 })
    .expect($(`${getNthStatusSelector(1)} .status-spoiler img.inline-custom-emoji`).getAttribute('alt')).eql(':blobpats:')
    .click(getNthShowOrHideButton(1))
    .expect($(`${getNthStatusSelector(1)} .status-content img.inline-custom-emoji`).getAttribute('alt')).eql(':blobnom:')
})

test('no XSS in content warnings or text', async t => {
  const pwned1 = '<script>alert("pwned!")</script>'
  const pwned2 = '<script>alert("pwned from CW!")</script>'
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, pwned1)
    .click(contentWarningButton)
    .typeText(composeContentWarning, pwned2)
    .click(composeButton)
    .expect($(`${getNthStatusSelector(1)} .status-spoiler`).innerText).contains(pwned2)
    .click(getNthShowOrHideButton(1))
    .expect($(`${getNthStatusSelector(1)} .status-content`).innerText).contains(pwned1)
})
