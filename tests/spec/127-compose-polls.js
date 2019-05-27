import {
  getNthStatusContent,
  getNthStatusPollForm,
  getNthStatusPollResult,
  getNthStatusPollVoteCount,
  pollButton,
  getComposePollNthInput,
  composePoll,
  composePollMultipleChoice,
  composePollExpiry, composePollAddButton, getComposePollRemoveNthButton, postStatusButton, composeInput
} from '../utils'
import { loginAsFoobar } from '../roles'
import { POLL_EXPIRY_DEFAULT } from '../../src/routes/_static/polls'

fixture`127-compose-polls.js`
  .page`http://localhost:4002`

test('Can add and remove poll', async t => {
  await loginAsFoobar(t)
  await t
    .expect(composePoll.exists).notOk()
    .expect(pollButton.getAttribute('aria-label')).eql('Add poll')
    .click(pollButton)
    .expect(composePoll.exists).ok()
    .expect(getComposePollNthInput(1).value).eql('')
    .expect(getComposePollNthInput(2).value).eql('')
    .expect(getComposePollNthInput(3).exists).notOk()
    .expect(getComposePollNthInput(4).exists).notOk()
    .expect(composePollMultipleChoice.checked).notOk()
    .expect(composePollExpiry.value).eql(POLL_EXPIRY_DEFAULT.toString())
    .expect(pollButton.getAttribute('aria-label')).eql('Remove poll')
    .click(pollButton)
    .expect(composePoll.exists).notOk()
})

test('Can add and remove poll options', async t => {
  await loginAsFoobar(t)
  await t
    .expect(composePoll.exists).notOk()
    .expect(pollButton.getAttribute('aria-label')).eql('Add poll')
    .click(pollButton)
    .expect(composePoll.exists).ok()
    .typeText(getComposePollNthInput(1), 'first', { paste: true })
    .typeText(getComposePollNthInput(2), 'second', { paste: true })
    .click(composePollAddButton)
    .typeText(getComposePollNthInput(3), 'third', { paste: true })
    .expect(getComposePollNthInput(1).value).eql('first')
    .expect(getComposePollNthInput(2).value).eql('second')
    .expect(getComposePollNthInput(3).value).eql('third')
    .expect(getComposePollNthInput(4).exists).notOk()
    .click(getComposePollRemoveNthButton(2))
    .expect(getComposePollNthInput(1).value).eql('first')
    .expect(getComposePollNthInput(2).value).eql('third')
    .expect(getComposePollNthInput(3).exists).notOk()
    .expect(getComposePollNthInput(4).exists).notOk()
    .click(composePollAddButton)
    .typeText(getComposePollNthInput(3), 'fourth', { paste: true })
    .typeText(composeInput, 'Vote on my poll!!!', { paste: true })
    .click(postStatusButton)
    .expect(getNthStatusContent(1).innerText).contains('Vote on my poll!!!')
    .expect(getNthStatusPollForm(1).exists).notOk()
    .expect(getNthStatusPollResult(1, 1).innerText).eql('0% first')
    .expect(getNthStatusPollResult(1, 2).innerText).eql('0% third')
    .expect(getNthStatusPollResult(1, 3).innerText).eql('0% fourth')
    .expect(getNthStatusPollResult(1, 4).exists).notOk()
    .expect(getNthStatusPollVoteCount(1).innerText).eql('0 votes')
})
