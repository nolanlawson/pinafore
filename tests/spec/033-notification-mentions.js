import {
  getUrl, notificationsTabAll, notificationsTabMentions,
  notificationsNavButton, validateTimeline
} from '../utils'
import { foobarURL } from '../roles'
import { notificationsMentions, notifications } from '../fixtures'

fixture`033-notification-mentions.js`
  .page`${foobarURL}`

test('Shows notification mentions', async t => {
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).match(/\/notifications$/)
    .click(notificationsTabMentions)
    .expect(getUrl()).match(/\/notifications\/mentions$/)
  await validateTimeline(t, notificationsMentions)
  await t.click(notificationsTabAll)
    .expect(getUrl()).match(/\/notifications$/)
  await validateTimeline(t, notifications)
})
