import {
  composeContentWarning, composeInput, composeLengthIndicator, contentWarningButton, homeNavButton,
  notificationsNavButton
} from '../utils'
import { foobarRole } from '../roles'

fixture`15-compose-content-warnings.js`
  .page`http://localhost:4002`

test('Changes content warnings', async t => {
  await t.useRole(foobarRole)
    .expect(composeContentWarning.exists).notOk()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Add content warning')
    .expect(contentWarningButton.getAttribute('aria-pressed')).eql('false')
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).ok()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Remove content warning')
    .expect(contentWarningButton.getAttribute('aria-pressed')).eql('true')
    .typeText(composeContentWarning, 'hello content warning', {paste: true})
    .typeText(composeInput, 'secret text', {paste: true})
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Remove content warning')
    .expect(contentWarningButton.getAttribute('aria-pressed')).eql('true')
    .expect(composeContentWarning.value).eql('hello content warning')
    .expect(composeInput.value).eql('secret text')
    .selectText(composeInput)
    .pressKey('delete')
    .selectText(composeContentWarning)
    .pressKey('delete')
    .expect(composeContentWarning.value).eql('')
    .expect(composeInput.value).eql('')
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).notOk()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Add content warning')
    .expect(contentWarningButton.getAttribute('aria-pressed')).eql('false')
})

test('Considers content warnings for length limits', async t => {
  await t.useRole(foobarRole)
    .expect(composeLengthIndicator.innerText).eql('500')
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'my content warning', {paste: true})
    .expect(composeLengthIndicator.innerText).eql('482')
    .typeText(composeInput, 'secret text', {paste: true})
    .expect(composeLengthIndicator.innerText).eql('471')
    .selectText(composeContentWarning)
    .pressKey('delete')
    .expect(composeLengthIndicator.innerText).eql('489')
    .selectText(composeInput)
    .pressKey('delete')
    .expect(composeLengthIndicator.innerText).eql('500')
})

test('Considers hidden content warnings for length limits', async t => {
  await t.useRole(foobarRole)
    .expect(composeLengthIndicator.innerText).eql('500')
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'my content warning', {paste: true})
    .expect(composeLengthIndicator.innerText).eql('482')
    .click(contentWarningButton)
    .expect(composeLengthIndicator.innerText).eql('500')
    .click(contentWarningButton)
    .expect(composeLengthIndicator.innerText).eql('482')
    .selectText(composeContentWarning)
    .pressKey('delete')
    .expect(composeLengthIndicator.innerText).eql('500')
})