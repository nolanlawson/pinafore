import { loginAsFoobar } from '../roles'
import {
  generalSettingsButton,
  getNthStatus, getNthStatusMedia, getNthStatusSensitiveMediaButton, homeNavButton, markMediaSensitiveInput,
  scrollToStatus, settingsNavButton, neverMarkMediaSensitiveInput
} from '../utils'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`023-mark-media-as-sensitive.js`
  .page`http://localhost:4002`

async function checkSensitivityForStatus (t, idx, sensitive) {
  if (sensitive) {
    await t
      .expect(getNthStatusSensitiveMediaButton(idx).exists).ok()
      .expect(getNthStatusMedia(idx).exists).notOk()
  } else {
    await t
      .expect(getNthStatusSensitiveMediaButton(idx).exists).notOk()
      .expect(getNthStatusMedia(idx).exists).ok()
  }
}

async function checkSensitivity (t, shouldBeSensitive) {
  let sensitiveKittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  let sensitiveVideoIdx = indexWhere(homeTimeline, _ => _.content === 'secret video')
  let videoIdx = indexWhere(homeTimeline, _ => _.content === "here's a video")
  let sensitiveAnimatedKittenIdx = indexWhere(homeTimeline, _ => _.content === "here's a secret animated kitten gif")
  let animatedKittenIdx = indexWhere(homeTimeline, _ => _.content === "here's an animated kitten gif")

  await t.hover(getNthStatus(0))

  let expected = [
    [ sensitiveKittenIdx, shouldBeSensitive(true) ],
    [ sensitiveVideoIdx, shouldBeSensitive(true) ],
    [ videoIdx, shouldBeSensitive(false) ],
    [ sensitiveAnimatedKittenIdx, shouldBeSensitive(true) ],
    [ animatedKittenIdx, shouldBeSensitive(false) ]
  ]

  for (let [ idx, sensitive ] of expected) {
    await scrollToStatus(t, sensitiveKittenIdx)
    await checkSensitivityForStatus(t, idx, sensitive)
  }
}

async function changeSetting (t, input, checked) {
  await t
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(input)
  if (checked) {
    await t.expect(input.checked).ok()
  } else {
    await t.expect(input.checked).notOk()
  }
  await t.click(homeNavButton)
}

async function doMarkMediaAsSensitive (t, checked) {
  await changeSetting(t, markMediaSensitiveInput, checked)
}

async function doNeverMarkMediaAsSensitive (t, checked) {
  await changeSetting(t, neverMarkMediaSensitiveInput, checked)
}

test('default sensitive settings', async t => {
  await loginAsFoobar(t)
  await checkSensitivity(t, sensitive => sensitive)
})

test('always mark media sensitive', async t => {
  await loginAsFoobar(t)
  await doMarkMediaAsSensitive(t, true)
  await checkSensitivity(t, () => true)
  // cleanup
  await doMarkMediaAsSensitive(t, false)
})

test('never mark media sensitive', async t => {
  await loginAsFoobar(t)
  await doNeverMarkMediaAsSensitive(t, true)
  await checkSensitivity(t, () => false)
  // cleanup
  await doNeverMarkMediaAsSensitive(t, false)
})

test('settings are mutually exclusive', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(markMediaSensitiveInput)
    .expect(markMediaSensitiveInput.checked).ok()
    .expect(neverMarkMediaSensitiveInput.checked).notOk()
    .click(neverMarkMediaSensitiveInput)
    .expect(markMediaSensitiveInput.checked).notOk()
    .expect(neverMarkMediaSensitiveInput.checked).ok()
    .click(markMediaSensitiveInput)
    .expect(markMediaSensitiveInput.checked).ok()
    .expect(neverMarkMediaSensitiveInput.checked).notOk()
    .click(markMediaSensitiveInput)
    .expect(markMediaSensitiveInput.checked).notOk()
    .expect(neverMarkMediaSensitiveInput.checked).notOk()
})
