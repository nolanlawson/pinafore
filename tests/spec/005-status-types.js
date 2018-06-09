import { getNthStatus, getNthStatusSelector } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`005-status-types.js`
  .page`http://localhost:4002`

test('shows direct vs followers-only vs regular', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).getAttribute('aria-label')).eql('Status by admin')
    .expect($(`${getNthStatusSelector(1)} .status-content`).innerText).contains('notification of unlisted message')
    .expect($(`${getNthStatusSelector(1)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Boost')
    .expect($(`${getNthStatusSelector(1)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).notOk()
    .expect(getNthStatus(2).getAttribute('aria-label')).eql('Status by admin')
    .expect($(`${getNthStatusSelector(2)} .status-content`).innerText).contains('notification of followers-only message')
    .expect($(`${getNthStatusSelector(2)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Cannot be boosted because this is followers-only')
    .expect($(`${getNthStatusSelector(2)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).ok()
    .expect(getNthStatus(3).getAttribute('aria-label')).eql('Direct message by admin')
    .expect($(`${getNthStatusSelector(3)} .status-content`).innerText).contains('notification of direct message')
    .expect($(`${getNthStatusSelector(3)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Cannot be boosted because this is a direct message')
    .expect($(`${getNthStatusSelector(3)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).ok()
})

test('shows direct vs followers-only vs regular in notifications', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/notifications')
    .expect(getNthStatus(2).getAttribute('aria-label')).eql('Status by admin')
    .expect($(`${getNthStatusSelector(2)} .status-content`).innerText).contains('notification of unlisted message')
    .expect($(`${getNthStatusSelector(2)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Boost')
    .expect($(`${getNthStatusSelector(2)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).notOk()
    .expect(getNthStatus(3).getAttribute('aria-label')).eql('Status by admin')
    .expect($(`${getNthStatusSelector(3)} .status-content`).innerText).contains('notification of followers-only message')
    .expect($(`${getNthStatusSelector(3)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Cannot be boosted because this is followers-only')
    .expect($(`${getNthStatusSelector(3)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).ok()
    .expect(getNthStatus(4).getAttribute('aria-label')).eql('Direct message by admin')
    .expect($(`${getNthStatusSelector(4)} .status-content`).innerText).contains('notification of direct message')
    .expect($(`${getNthStatusSelector(4)} .status-toolbar button:nth-child(2)`).getAttribute('aria-label'))
    .eql('Cannot be boosted because this is a direct message')
    .expect($(`${getNthStatusSelector(4)} .status-toolbar button:nth-child(2)`).hasAttribute('disabled')).ok()
})
