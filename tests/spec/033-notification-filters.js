import {
  getUrl, notificationFiltersAll, notificationFiltersMention,
  notificationsNavButton, validateTimeline
} from '../utils'
import { loginAsFoobar } from '../roles'
import { notificationsMentions, notifications } from '../fixtures'

fixture`033-notification-filters.js`
  .page`http://localhost:4002`

test('Shows notification filters', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).match(/\/notifications$/)
    .click(notificationFiltersMention)
    .expect(getUrl()).match(/\/notifications\/mentions$/)
  await validateTimeline(t, notificationsMentions)
  await t.click(notificationFiltersAll)
    .expect(getUrl()).match(/\/notifications$/)
  await validateTimeline(t, notifications)
})
