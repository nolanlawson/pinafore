import { ClientFunction as exec, Selector as $ } from 'testcafe'
import * as images from './images'
import * as blobUtils from './blobUtils'

export const settingsButton = $('nav a[aria-label=Settings]')
export const instanceInput = $('#instanceInput')
export const modalDialog = $('.modal-dialog')
export const modalDialogContents = $('.modal-dialog-contents')
export const closeDialogButton = $('.close-dialog-button')
export const notificationsNavButton = $('nav a[href="/notifications"]')
export const homeNavButton = $('nav a[href="/"]')
export const localTimelineNavButton = $('nav a[href="/local"]')
export const searchNavButton = $('nav a[href="/search"]')
export const communityNavButton = $('nav a[href="/community"]')
export const settingsNavButton = $('nav a[href="/settings"]')
export const formError = $('.form-error-user-error')
export const composeInput = $('.compose-box-input')
export const composeContentWarning = $('.content-warning-input')
export const composeButton = $('.compose-box-button')
export const composeLengthIndicator = $('.compose-box-length')
export const emojiButton = $('.compose-box-toolbar button:first-child')
export const mediaButton = $('.compose-box-toolbar button:nth-child(2)')
export const postPrivacyButton = $('.compose-box-toolbar button:nth-child(3)')
export const contentWarningButton = $('.compose-box-toolbar button:nth-child(4)')
export const emailInput = $('input#user_email')
export const passwordInput = $('input#user_password')
export const authorizeInput = $('button[type=submit]:not(.negative)')
export const logInToInstanceLink = $('a[href="/settings/instances/add"]')
export const searchInput = $('.search-input')
export const postStatusButton = $('.compose-box-button')
export const showMoreButton = $('.more-items-header button')
export const accountProfileName = $('.account-profile .account-profile-name')
export const accountProfileUsername = $('.account-profile .account-profile-username')
export const accountProfileFollowedBy = $('.account-profile .account-profile-followed-by')
export const accountProfileFollowButton = $('.account-profile .account-profile-follow button')
export const goBackButton = $('.dynamic-page-go-back')
export const accountProfileMoreOptionsButton = $('.account-profile-more-options button')
export const addInstanceButton = $('#submitButton')
export const mastodonLogInButton = $('button[type="submit"]')
export const followsButton = $('.account-profile-details > *:nth-child(2)')
export const followersButton = $('.account-profile-details > *:nth-child(3)')
export const avatarInComposeBox = $('.compose-box-avatar')
export const displayNameInComposeBox = $('.compose-box-display-name')
export const generalSettingsButton = $('a[href="/settings/general"]')
export const markMediaSensitiveInput = $('#choice-mark-media-sensitive')
export const neverMarkMediaSensitiveInput = $('#choice-never-mark-media-sensitive')
export const removeEmojiFromDisplayNamesInput = $('#choice-omit-emoji-in-display-names')
export const dialogOptionsOption = $(`.modal-dialog button`)

export const composeModalInput = $('.modal-dialog .compose-box-input')
export const composeModalComposeButton = $('.modal-dialog .compose-box-button')
export const composeModalContentWarningInput = $('.modal-dialog .content-warning-input')
export const composeModalEmojiButton = $('.modal-dialog .compose-box-toolbar button:nth-child(1)')
export const composeModalPostPrivacyButton = $('.modal-dialog .compose-box-toolbar button:nth-child(3)')

export function getComposeModalNthMediaAltInput (n) {
  return $(`.modal-dialog .compose-media:nth-child(${n}) .compose-media-alt input`)
}

export function getComposeModalNthMediaImg (n) {
  return $(`.modal-dialog .compose-media:nth-child(${n}) img`)
}

export const favoritesCountElement = $('.status-favs').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const reblogsCountElement = $('.status-reblogs').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export const getUrl = exec(() => window.location.href)

export const getActiveElementClass = exec(() =>
  (document.activeElement && document.activeElement.getAttribute('class')) || ''
)

export const getActiveElementTagName = exec(() =>
  (document.activeElement && document.activeElement.tagName) || ''
)

export const getActiveElementInnerText = exec(() =>
  (document.activeElement && document.activeElement.innerText) || ''
)

export const getActiveElementInsideNthStatus = exec(() => {
  let element = document.activeElement
  while (element) {
    if (element.hasAttribute('aria-posinset')) {
      return element.getAttribute('aria-posinset')
    }
    element = element.parentElement
  }
  return ''
})

export const getTitleText = exec(() => document.head.querySelector('title').innerHTML)

export const goBack = exec(() => window.history.back())

export const goForward = exec(() => window.history.forward())

export const reload = exec(() => window.location.reload())

export const forceOffline = exec(() => window.__forceOnline(false))

export const forceOnline = exec(() => window.__forceOnline(true))

export const getComposeSelectionStart = exec(() => composeInput().selectionStart, {
  dependencies: { composeInput }
})

export const getOpacity = selector => exec(() => window.getComputedStyle(document.querySelector(selector)).opacity, {
  dependencies: { selector }
})

export const getCurrentTheme = exec(() => {
  let themeLink = document.head.querySelector('link[rel=stylesheet][href^="/theme-"]')
  if (themeLink) {
    return themeLink.getAttribute('href').match(/^\/theme-(.*)\.css$/, '')[1]
  }
  return 'default'
})

export const uploadKittenImage = i => (exec(() => {
  let image = images[`kitten${i}`]
  let blob = blobUtils.base64StringToBlob(image.data, 'image/png')
  blob.name = image.name
  window.__fakeFileInput(blob)
}, {
  dependencies: {
    images,
    blobUtils,
    i
  }
}))

export const focus = (selector) => (exec(() => {
  document.querySelector(selector).focus()
}, {
  dependencies: {
    selector
  }
}))

export const scrollToBottom = exec(() => {
  document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
})

export const scrollToTop = exec(() => {
  document.scrollingElement.scrollTop = 0
})

export function getNthMediaAltInput (n) {
  return $(`.compose-box .compose-media:nth-child(${n}) .compose-media-alt input`)
}

export function getNthComposeReplyInput (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-input`)
}

export function getNthComposeReplyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-button`)
}

export function getNthPostPrivacyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(3)`)
}

export function getNthAutosuggestionResult (n) {
  return $(`.compose-autosuggest-list-item:nth-child(${n}) button`)
}

export function getSearchResultByHref (href) {
  return $(`.search-result a[href="${href}"]`)
}

export function getNthSearchResult (n) {
  return $(`.search-result:nth-child(${n}) a`)
}

export function getNthMedia (n) {
  return $(`.compose-media:nth-child(${n}) img`)
}

export function getNthDeleteMediaButton (n) {
  return $(`.compose-media:nth-child(${n}) .compose-media-delete-button`)
}

export function getAriaSetSize () {
  return getNthStatus(0).getAttribute('aria-setsize')
}

export function getNthStatus (n) {
  return $(getNthStatusSelector(n))
}

export function getNthStatusSelector (n) {
  return `.list-item > article[aria-posinset="${n}"]`
}

export function getNthStatusContent (n) {
  return $(`${getNthStatusSelector(n)} .status-content`)
}

export function getNthStatusSpoiler (n) {
  return $(`${getNthStatusSelector(n)} .status-spoiler`)
}

export function getNthStatusSensitiveMediaButton (n) {
  return $(`${getNthStatusSelector(n)} .status-sensitive-media-button`)
}

export function getNthStatusMedia (n) {
  return $(`${getNthStatusSelector(n)} .status-media`)
}

export function getNthStatusRelativeDate (n) {
  return $(`${getNthStatusSelector(n)} .status-relative-date`)
}

export function getNthStatusMediaImg (n) {
  return $(`${getNthStatusSelector(n)} .status-media img`)
}

export function getNthStatusHeader (n) {
  return $(`${getNthStatusSelector(n)} .status-header`)
}

export function getNthStatusAndImage (nStatus, nImage) {
  return $(`${getNthStatusSelector(nStatus)} .status-media .show-image-button:nth-child(${nImage + 1}) img`)
}

export function getFirstVisibleStatus () {
  return $(`.list-item > article[aria-posinset]`).nth(0)
}

export function getNthReplyButton (n) {
  return $(`${getNthStatusSelector(n)} .status-toolbar button:nth-child(1)`)
}

export function getNthReplyContentWarningInput (n) {
  return $(`${getNthStatusSelector(n)} .content-warning-input`)
}

export function getNthReplyContentWarningButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(4)`)
}

export function getNthReplyPostPrivacyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(3)`)
}

export function getNthPostPrivacyOptionInDialog (n) {
  return $(`.generic-dialog-list li:nth-child(${n}) button`)
}

export function getNthFavoriteButton (n) {
  return $(`${getNthStatusSelector(n)} .status-toolbar button:nth-child(3)`)
}

export function getNthStatusOptionsButton (n) {
  return $(`${getNthStatusSelector(n)} .status-toolbar button:nth-child(4)`)
}

export function getNthFavorited (n) {
  return getNthFavoriteButton(n).getAttribute('aria-pressed')
}

export function getNthShowOrHideButton (n) {
  return $(`${getNthStatusSelector(n)} .status-spoiler-button button`)
}

export function getFavoritesCount () {
  return favoritesCountElement.innerCount
}

export function getNthReblogButton (n) {
  return $(`${getNthStatusSelector(n)} .status-toolbar button:nth-child(2)`)
}

export function getNthReblogged (n) {
  return getNthReblogButton(n).getAttribute('aria-pressed')
}

export function getNthDialogOptionsOption (n) {
  return $(`.modal-dialog li:nth-child(${n}) button`)
}

export function getReblogsCount () {
  return reblogsCountElement.innerCount
}

function getNthPinnedStatusSelector (n) {
  return `.pinned-statuses article[aria-posinset="${n}"]`
}

export function getNthPinnedStatus (n) {
  return $(getNthPinnedStatusSelector(n))
}

export function getNthPinnedStatusFavoriteButton (n) {
  return $(`${getNthPinnedStatusSelector(n)} .status-toolbar button:nth-child(3)`)
}

export async function validateTimeline (t, timeline) {
  const timeout = 30000
  for (let i = 0; i < timeline.length; i++) {
    let status = timeline[i]
    // hovering forces TestCafé to scroll to that element: https://git.io/vABV2
    await t.hover(getNthStatus(i))
    if (status.content) {
      await t.expect(getNthStatusContent(i).innerText)
        .contains(status.content, { timeout })
    }
    if (status.spoiler) {
      await t.expect(getNthStatusSpoiler(i).innerText)
        .contains(status.spoiler, { timeout })
    }
    if (status.followedBy) {
      await t.expect(getNthStatusHeader(i).innerText)
        .match(new RegExp(status.followedBy + '\\s+followed you'), { timeout })
    }
    if (status.rebloggedBy) {
      await t.expect(getNthStatusHeader(i).innerText)
        .match(new RegExp(status.rebloggedBy + '\\s+boosted your status'), { timeout })
    }
    if (status.favoritedBy) {
      await t.expect(getNthStatusHeader(i).innerText)
        .match(new RegExp(status.favoritedBy + '\\s+favorited your status'), { timeout })
    }
  }
}

export async function scrollToStatus (t, n) {
  let timeout = 20000
  for (let i = 0; i <= n; i++) {
    await t.expect(getNthStatus(i).exists).ok({ timeout })
      .hover(getNthStatus(i))
      .expect($('.loading-footer').exist).notOk()
    if (i < n) {
      await t.hover($(`${getNthStatusSelector(i)} .status-toolbar`))
        .expect($('.loading-footer').exist).notOk()
    }
  }
  await t.hover(getNthStatus(n))
}

export async function clickToNotificationsAndBackHome (t) {
  await t.click(notificationsNavButton)
    .expect(getUrl()).eql('http://localhost:4002/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
}

// like lodash.times but I don't want to try to figure out esm
// just to import lodash-es
export function times (n, cb) {
  let arr = []
  for (let i = 0; i < n; i++) {
    arr.push(cb(i))
  }
  return arr
}
