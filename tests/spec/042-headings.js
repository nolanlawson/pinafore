import {
  settingsNavButton,
  notificationsNavButton,
  localTimelineNavButton,
  communityNavButton,
  searchNavButton,
  getNumElementsMatchingSelector,
  getUrl, getNthStatus
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`042-headings.js`
  .page`http://localhost:4002`

async function testHeadings (t, loggedIn) {
  const navButtons = [
    { button: notificationsNavButton, url: 'notifications' },
    { button: localTimelineNavButton, url: 'local' },
    { button: communityNavButton, url: 'community' },
    { button: searchNavButton, url: 'search' },
    { button: settingsNavButton, url: 'settings' }
  ]

  // home page
  await t
    .expect(getNumElementsMatchingSelector('h1')()).eql(1)

  if (loggedIn) {
    // status page
    await t
      .click(getNthStatus(1))
      .expect(getUrl()).contains('status')
      .expect(getNumElementsMatchingSelector('h1')()).eql(1)
  }

  // non-home pages
  for (const { button, url } of navButtons) {
    await t
      .click(button)
      .expect(getUrl()).contains(url)
      .expect(getNumElementsMatchingSelector('h1')()).eql(1)
  }
}

test('Only one <h1> when not logged in', async t => {
  await testHeadings(t, false)
})

test('Only one <h1> when logged in', async t => {
  await loginAsFoobar(t)
  await testHeadings(t, true)
})
