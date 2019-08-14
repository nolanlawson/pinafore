import { loginAsFoobar } from '../roles'
import {
  generalSettingsButton,
  getNthStatus, getNthStatusMediaImg, getNthStatusSensitiveMediaButton, homeNavButton, markMediaSensitiveInput,
  scrollToStatus, settingsNavButton, neverMarkMediaSensitiveInput
} from '../utils'

import { homeTimeline } from '../fixtures'

fixture`023-mark-media-as-sensitive.js`
  .page`http://localhost:4002`

async function checkSensitivityForStatus (t, idx, sensitive) {
  if (sensitive) {
    await t
      .expect(getNthStatusSensitiveMediaButton(1 + idx).exists).ok()
      .expect(getNthStatusMediaImg(1 + idx).getAttribute('src')).match(/^blob:http:\/\/localhost/)
  } else {
    await t
      .expect(getNthStatusSensitiveMediaButton(1 + idx).exists).notOk()
      .expect(getNthStatusMediaImg(1 + idx).getAttribute('src')).match(/^http:\/\//)
  }
}

async function checkSensitivity (t, shouldBeSensitive) {
  const sensitiveKittenIdx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  const sensitiveVideoIdx = homeTimeline.findIndex(_ => _.content === 'secret video')
  const videoIdx = homeTimeline.findIndex(_ => _.content === "here's a video")
  const sensitiveAnimatedKittenIdx = homeTimeline.findIndex(_ => _.content === "here's a secret animated kitten gif")
  const animatedKittenIdx = homeTimeline.findIndex(_ => _.content === "here's an animated kitten gif")

  await t.hover(getNthStatus(1))

  const expected = [
    [sensitiveKittenIdx, shouldBeSensitive(true)],
    [sensitiveVideoIdx, shouldBeSensitive(true)],
    [videoIdx, shouldBeSensitive(false)],
    [sensitiveAnimatedKittenIdx, shouldBeSensitive(true)],
    [animatedKittenIdx, shouldBeSensitive(false)]
  ]

  for (const [idx, sensitive] of expected) {
    await scrollToStatus(t, 1 + sensitiveKittenIdx)
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
