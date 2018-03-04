import { Selector as $ } from 'testcafe'
import { getFirstVisibleStatus, getNthStatus, getUrl, validateTimeline } from '../utils'
import { homeTimeline, notifications, localTimeline, favorites } from '../fixtures'
import { foobarRole } from '../roles'

fixture`03-basic-timeline-spec.js`
  .page`http://localhost:4002`

test('Shows the home timeline', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .expect(getFirstVisibleStatus().exists).ok()
    .expect(getFirstVisibleStatus().hasAttribute('aria-setsize')).ok()
    .expect(getFirstVisibleStatus().getAttribute('aria-posinset')).eql('0')

  await validateTimeline(t, homeTimeline)

  await t.expect(getFirstVisibleStatus().getAttribute('aria-setsize')).eql('49')
})

test('Shows notifications', async t => {
  await t.useRole(foobarRole)
    .click($('nav a[aria-label=Notifications]'))
    .expect(getUrl()).contains('/notifications')

  await validateTimeline(t, notifications)
})

test('Shows the local timeline', async t => {
  await t.useRole(foobarRole)
    .click($('nav a[aria-label=Local]'))
    .expect(getUrl()).contains('/local')

  await validateTimeline(t, localTimeline)
})

test('Shows the federated timeline', async t => {
  await t.useRole(foobarRole)
    .click($('nav a[aria-label=Community]'))
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Federated'))
    .expect(getUrl()).contains('/federated')

  await validateTimeline(t, localTimeline) // local is same as federated in this case
})

test('Shows favorites', async t => {
  await t.useRole(foobarRole)
    .click($('nav a[aria-label=Community]'))
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Favorites'))
    .expect(getUrl()).contains('/favorites')

  await validateTimeline(t, favorites)
})
