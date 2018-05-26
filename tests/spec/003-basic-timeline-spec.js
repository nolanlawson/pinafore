import { Selector as $ } from 'testcafe'
import {
  communityNavButton,
  getFirstVisibleStatus, getNthStatus, getUrl, localTimelineNavButton, notificationsNavButton,
  validateTimeline
} from '../utils'
import { homeTimeline, notifications, localTimeline, favorites } from '../fixtures'
import { loginAsFoobar } from '../roles'

fixture`003-basic-timeline-spec.js`
  .page`http://localhost:4002`

test('Shows the home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getFirstVisibleStatus().exists).ok()
    .expect(getFirstVisibleStatus().hasAttribute('aria-setsize')).ok()
    .expect(getFirstVisibleStatus().getAttribute('aria-posinset')).eql('0')

  await validateTimeline(t, homeTimeline)

  await t.expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql('49')
})

test('Shows notifications', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')

  await validateTimeline(t, notifications)
})

test('Shows the local timeline', async t => {
  await loginAsFoobar(t)
  await t
    .click(localTimelineNavButton)
    .expect(getUrl()).contains('/local')

  await validateTimeline(t, localTimeline)
})

test('Shows the federated timeline', async t => {
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Federated'))
    .expect(getUrl()).contains('/federated')

  await validateTimeline(t, localTimeline) // local is same as federated in this case
})

test('Shows favorites', async t => {
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Favorites'))
    .expect(getUrl()).contains('/favorites')

  await validateTimeline(t, favorites)
})
