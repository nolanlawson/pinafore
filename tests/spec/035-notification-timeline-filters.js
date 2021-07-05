import {
  validateTimeline,
  settingsNavButton,
  instanceSettingNotificationReblogs,
  notificationsNavButton,
  instanceSettingNotificationFavs,
  instanceSettingNotificationFollows,
  instanceSettingNotificationMentions
} from '../utils'
import { foobarURL } from '../roles'
import { notifications } from '../fixtures'
import { Selector as $ } from 'testcafe'

fixture`035-notification-timeline-filters.js`
  .page`${foobarURL}`

function setSettingAndGoToNotifications (t, setting) {
  return t.click(settingsNavButton)
    .click($('a[href="/settings/instances"]'))
    .click($('a[href="/settings/instances/localhost:3000"]'))
    .click(setting)
    .expect(setting.checked).notOk()
    .click(notificationsNavButton)
}

test('Filters reblogs from notification timeline', async t => {
  await setSettingAndGoToNotifications(t, instanceSettingNotificationReblogs)
  await validateTimeline(t, notifications.filter(_ => !_.rebloggedBy))
})

test('Filters favs from notification timeline', async t => {
  await setSettingAndGoToNotifications(t, instanceSettingNotificationFavs)
  await validateTimeline(t, notifications.filter(_ => !_.favoritedBy))
})

test('Filters follows from notification timeline', async t => {
  await setSettingAndGoToNotifications(t, instanceSettingNotificationFollows)
  await validateTimeline(t, notifications.filter(_ => !_.followedBy))
})

test('Filters mentions from notification timeline', async t => {
  await setSettingAndGoToNotifications(t, instanceSettingNotificationMentions)
  await validateTimeline(t, notifications.filter(_ => !_.content))
})
