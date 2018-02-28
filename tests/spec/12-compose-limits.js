import {
  composeButton, composeInput, composeLengthIndicator, getUrl, homeNavButton, notificationsNavButton
} from '../utils'
import { foobarRole } from '../roles'
import times from 'lodash/times'

fixture`12-compose-limits.js`
  .page`http://localhost:4002`

test('shows compose limits', async t => {
  await t.useRole(foobarRole)
    .hover(composeInput)
    .expect(composeLengthIndicator.innerText).eql('0')
    .expect(composeButton.getAttribute('disabled')).eql('')
    .typeText(composeInput, 'typing some text')
    .expect(composeLengthIndicator.innerText).eql('16')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .typeText(composeInput, times(50, () => 'hello world').join(' '), {replace: true, paste: true})
    .expect(composeLengthIndicator.innerText).eql('-99')
    .expect(composeButton.getAttribute('disabled')).eql('')
    .typeText(composeInput, 'hello world', {replace: true})
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(composeInput.value).eql('hello world')
    .expect(composeLengthIndicator.innerText).eql('11')
    .expect(composeButton.hasAttribute('disabled')).notOk()
    .selectText(composeInput)
    .pressKey('delete')
    .expect(composeInput.value).eql('')
    .expect(composeLengthIndicator.innerText).eql('0')
    .expect(composeButton.getAttribute('disabled')).eql('')
})
