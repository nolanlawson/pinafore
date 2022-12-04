import { ClientFunction as exec, Selector as $ } from 'testcafe'
import * as images from './images'
import * as blobUtils from './blobUtils'

export const timeline = $('[role=feed]')
export const settingsButton = $('nav a[aria-label=Settings]')
export const instanceInput = $('#instanceInput')
export const modalDialog = $('.modal-dialog')
export const visibleModalDialog = $('.modal-dialog:not([aria-hidden="true"])')
export const modalDialogContents = $('.modal-dialog-contents')
export const modalDialogBackdrop = $('.modal-dialog-backdrop')
export const closeDialogButton = $('.modal-dialog:not([aria-hidden="true"]) .close-dialog-button')
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
export const composeLengthIndicator = $('.length-indicator')
export const emojiButton = $('.compose-box-toolbar button:first-child')
export const mediaButton = $('.compose-box-toolbar button:nth-child(2)')
export const pollButton = $('.compose-box-toolbar button:nth-child(3)')
export const postPrivacyButton = $('.compose-box-toolbar button:nth-child(4)')
export const contentWarningButton = $('.compose-box-toolbar button:nth-child(5)')
export const emailInput = $('input#user_email')
export const passwordInput = $('input#user_password')
export const authorizeInput = $('button[type=submit]:not(.negative)')
export const logInToInstanceLink = $('a[href="/settings/instances/add"]')
export const copyPasteModeButton = $('.copy-paste-mode-button')
export const oauthCodeInput = $('#oauthCodeInput')
export const searchInput = $('.search-input')
export const searchButton = $('button[aria-label=Search]')
export const postStatusButton = $('.compose-box-button')
export const showMoreButton = $('.more-items-header button')
export const accountProfileName = $('.account-profile .account-profile-name')
export const accountProfileUsername = $('.account-profile .account-profile-username')
export const accountProfileFollowedBy = $('.account-profile .account-profile-followed-by')
export const accountProfileFollowButton = $('.account-profile .account-profile-follow button')
export const goBackButton = $('.dynamic-page-go-back')
export const accountProfileMoreOptionsButton = $('.account-profile-more-options button')
export const addInstanceButton = $('#submitButton')
export const submitOauthButton = $('#submitOauthButton')
export const mastodonLogInButton = $('button[type="submit"]')
export const followsButton = $('.account-profile-details > *:nth-child(2)')
export const followersButton = $('.account-profile-details > *:nth-child(3)')
export const avatarInComposeBox = $('.compose-box-avatar')
export const displayNameInComposeBox = $('.compose-box-display-name')
export const generalSettingsButton = $('a[href="/settings/general"]')
export const markMediaSensitiveInput = $('#choice-mark-media-sensitive')
export const neverMarkMediaSensitiveInput = $('#choice-never-mark-media-sensitive')
export const removeEmojiFromDisplayNamesInput = $('#choice-omit-emoji-in-display-names')
export const disableInfiniteScroll = $('#choice-disable-infinite-scroll')
export const disableUnreadNotifications = $('#choice-disable-unread-notification-counts')
export const disableRelativeTimestamps = $('#choice-disable-relative-timestamps')
export const leftRightChangesFocus = $('#choice-left-right-focus')
export const disableHotkeys = $('#choice-disable-hotkeys')
export const dialogOptionsOption = $('.modal-dialog button')
export const confirmationDialogOKButton = $('.confirmation-dialog-form-flex button:nth-child(1)')
export const confirmationDialogCancelButton = $('.confirmation-dialog-form-flex button:nth-child(2)')

export const loadMoreButton = $('.loading-footer button')

export const composeModalInput = $('.modal-dialog .compose-box-input')
export const composeModalComposeButton = $('.modal-dialog .compose-box-button')
export const composeModalContentWarningInput = $('.modal-dialog .content-warning-input')
export const composeModalEmojiButton = $('.modal-dialog .compose-box-toolbar button:nth-child(1)')
export const composeModalPostPrivacyButton = $('.modal-dialog .compose-box-toolbar button:nth-child(4)')
export const composeModalMediaSensitiveCheckbox = $('.modal-dialog .compose-media-sensitive input')

export const composePoll = $('.compose-poll')
export const composePollMultipleChoice = $('.compose-poll input[type="checkbox"]')
export const composePollMultipleChoiceInDialog = $('.modal-dialog .compose-poll input[type="checkbox"]')
export const composePollExpiry = $('.compose-poll select')
export const composePollExpiryOption = $('.compose-poll select option')
export const composePollExpiryInDialog = $('.modal-dialog .compose-poll select')
export const composePollAddButton = $('.compose-poll button:last-of-type')

export const composeMediaSensitiveCheckbox = $('.compose-media-sensitive input')

export const postPrivacyDialogButtonUnlisted = $('[aria-label="Post privacy"] li:nth-child(2) button')

export const accountProfileFilterStatuses = $('.account-profile-filters li:nth-child(1)')
export const accountProfileFilterStatusesAndReplies = $('.account-profile-filters li:nth-child(2)')
export const accountProfileFilterMedia = $('.account-profile-filters li:nth-child(3)')

export const notificationsTabAll = $('.notification-filters li:nth-child(1)')
export const notificationsTabMentions = $('.notification-filters li:nth-child(2)')

export const instanceSettingHomeReblogs = $('#instance-option-homeReblogs')
export const instanceSettingNotificationFollows = $('#instance-option-notificationFollows')
export const instanceSettingNotificationFavs = $('#instance-option-notificationFavs')
export const instanceSettingNotificationReblogs = $('#instance-option-notificationReblogs')
export const instanceSettingNotificationMentions = $('#instance-option-notificationMentions')

export const notificationBadge = $('#main-nav li:nth-child(2) .nav-link-badge')

export const focalPointXInput = $('.media-focal-point-inputs *:nth-child(1) input')
export const focalPointYInput = $('.media-focal-point-inputs *:nth-child(2) input')

export function getComposeModalNthMediaAltInput (n) {
  return $(`.modal-dialog .compose-media:nth-child(${n}) .compose-media-alt textarea`)
}

export function getComposeModalNthMediaListItem (n) {
  return $(`.modal-dialog .compose-media:nth-child(${n})`)
}

export const favoritesCountElement = $('.status-favs').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const reblogsCountElement = $('.status-reblogs').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export const getUrl = exec(() => window.location.href)

/* global emojiPickerSelector */
const emojiPicker = $('emoji-picker')
export const emojiSearchInput = $(() => {
  return emojiPickerSelector().shadowRoot.querySelector('input')
}, { dependencies: { emojiPickerSelector: emojiPicker } })

export const firstEmojiInPicker = $(() => {
  return emojiPickerSelector().shadowRoot.querySelector('.emoji-menu button')
}, { dependencies: { emojiPickerSelector: emojiPicker } })

export const getNumSyntheticListeners = exec(() => {
  return Object.keys(window.__eventBus.$e).map(key => window.__eventBus.listenerCount(key))
    .concat(window.__resizeListeners.size)
    .concat(Object.keys(window.__delegateCallbacks).length)
    .reduce((a, b) => a + b, 0)
})

export const getNumStoreListeners = exec(() => {
  function getStoreHandlers (storeName) {
    return window[storeName] ? window[storeName]._handlers : {}
  }

  const values = 'values' // prevent Babel from transpiling Object.values
  return Object[values](getStoreHandlers('__store'))
    .concat(Object[values](getStoreHandlers('__listStore')))
    .concat(Object[values](getStoreHandlers('__virtualListStore')))
    .map(arr => arr.length)
    .reduce((a, b) => a + b, 0)
})

export const getMediaScrollLeft = exec(() => document.querySelector('.media-scroll').scrollLeft || 0)

export const getActiveElementClassList = exec(() =>
  (document.activeElement && (document.activeElement.getAttribute('class') || '').split(/\s+/)) || []
)

export const getActiveElementHref = exec(() =>
  (document.activeElement && (document.activeElement.getAttribute('href') || ''))
)

export const getActiveElementTagName = exec(() =>
  (document.activeElement && document.activeElement.tagName) || ''
)

export const getActiveElementInnerText = exec(() =>
  (document.activeElement && document.activeElement.innerText) || ''
)

export const getActiveElementId = exec(() =>
  (document.activeElement && document.activeElement.id) || ''
)

export const getActiveElementRectTop = exec(() => (
  (document.activeElement && document.activeElement.getBoundingClientRect().top) || -1
))

export const getActiveElementAriaPosInSet = exec(() => (
  (document.activeElement && document.activeElement.getAttribute('aria-posinset')) || ''
))

export const getActiveElementAriaLabel = exec(() => (
  (document.activeElement && document.activeElement.getAttribute('aria-label')) || ''
))

export const getCommunityPinRadioButtonIds = exec(() => {
  const buttons = document.querySelectorAll('.page-list-item button')
  const res = []
  for (let i = 0; i < buttons.length; i++) {
    res.push(buttons[i].id)
  }
  return res
})

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

export const getNthStatusId = n => exec(() => {
  return document.querySelector(getNthStatusSelector(n))
    .getAttribute('id')
    .split('/')
    .slice(-1)[0]
}, {
  dependencies: {
    getNthStatusSelector,
    n
  }
})

export const getStatusContents = exec(() => {
  const res = []
  const elements = document.querySelectorAll('.list-item > article .status-content')
  for (let i = 0; i < elements.length; i++) {
    res.push(elements[i].innerText)
  }
  return res
})

export const getTitleText = exec(() => document.head.querySelector('title') && document.head.querySelector('title').innerHTML)

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
  const themeLink = document.head.querySelector('link[rel=stylesheet][href^="/theme-"]')
  if (themeLink) {
    return themeLink.getAttribute('href').match(/^\/theme-(.*)\.css$/, '')[1]
  }
  return 'default'
})

export const uploadKittenImage = i => (exec(() => {
  const image = images[`kitten${i}`]
  const blob = blobUtils.base64StringToBlob(image.data, 'image/png')
  blob.name = image.name
  const fileDrop = document.querySelector('file-drop')
  const event = new Event('filedrop', { bubbles: false })
  event.files = [blob]
  fileDrop.dispatchEvent(event)
}, {
  dependencies: {
    images,
    blobUtils,
    i
  }
}))

export const simulateWebShare = ({ title, text, url, file }) => (exec(() => {
  let blob
  return Promise.resolve().then(() => {
    if (file) {
      return fetch(file).then(resp => resp.blob()).then(theBlob => {
        blob = theBlob
      })
    }
  }).then(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('keyval-store')
      request.onerror = (event) => {
        console.error(event)
        reject(new Error('idb error'))
      }
      request.onupgradeneeded = () => {
        request.result.createObjectStore('keyval')
      }
      request.onsuccess = (event) => {
        const db = event.target.result
        const txn = db.transaction('keyval', 'readwrite')
        txn.onerror = () => reject(new Error('idb error'))
        txn.oncomplete = () => {
          db.close()
          resolve()
        }
        txn.objectStore('keyval').put({
          title,
          text,
          url,
          file: blob
        }, 'web-share-data')
      }
    })
  })
}, {
  dependencies: {
    title,
    text,
    url,
    file
  }
}))

export const focus = (selector) => (exec(() => {
  document.querySelector(selector).focus()
}, {
  dependencies: {
    selector
  }
}))

export const isNthStatusActive = (idx) => (exec(() => {
  return document.activeElement &&
    document.activeElement.getAttribute('aria-posinset') === idx.toString()
}, {
  dependencies: { idx }
}))

export const isActiveStatusPinned = exec(() => {
  const el = document.activeElement
  return el &&
    (
      (el.parentElement.getAttribute('class') || '').includes('pinned') ||
      (el.parentElement.parentElement.getAttribute('class') || '').includes('pinned')
    )
})

export const scrollToBottom = exec(() => {
  document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
})

export const scrollToTop = exec(() => {
  document.scrollingElement.scrollTop = 0
})

export const getScrollTop = exec(() => {
  return document.scrollingElement.scrollTop || 0
})

export function getFirstModalMedia () {
  return $('.modal-dialog .media-container img')
}

export function getNthMediaAltInput (n) {
  return $(`.compose-box .compose-media:nth-child(${n}) .compose-media-alt textarea`)
}

export function getNthComposeReplyInput (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-input`)
}

export function getNthComposeReplyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-button`)
}

export function getNthPostPrivacyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(4)`)
}

export function getNthStatusPollOption (n, i) {
  return $(`${getNthStatusSelector(n)} .poll li:nth-child(${i}) input`)
}

export function getNthStatusPollVoteButton (n) {
  return $(`${getNthStatusSelector(n)} .poll button`)
}

export function getNthStatusPollForm (n) {
  return $(`${getNthStatusSelector(n)} .poll form`)
}

export function getNthStatusPollResult (n, i) {
  return $(`${getNthStatusSelector(n)} .poll li:nth-child(${i})`)
}

export function getNthStatusPollRefreshButton (n) {
  return $(`${getNthStatusSelector(n)} .poll-stat button`)
}

export function getNthStatusPollVoteCount (n) {
  return $(`${getNthStatusSelector(n)} .poll .poll-stat:nth-child(1) .poll-stat-text`)
}

export function getNthStatusPollExpiry (n) {
  return $(`${getNthStatusSelector(n)} .poll .poll-stat-expiry`)
}

export function getComposePollNthInput (n) {
  return $(`.compose-poll input[type="text"]:nth-of-type(${n})`)
}

export function getComposePollNthInputInDialog (n) {
  return $(`.modal-dialog .compose-poll input[type="text"]:nth-of-type(${n})`)
}

export function getComposePollRemoveNthButton (n) {
  return $(`.compose-poll button:nth-of-type(${n})`)
}

export function getNthAutosuggestionResult (n) {
  return $(`.compose-autosuggest-list-item:nth-child(${n})`)
}

export function getSearchResultByHref (href) {
  return $(`.search-result a[href="${href}"]`)
}

export function getNthSearchResult (n) {
  return $(`.search-result:nth-child(${n}) a`)
}

export function getNthMediaListItem (n) {
  return $(`.compose-media:nth-child(${n})`)
}

export function getNthMedia (n) {
  return $(`.compose-media:nth-child(${n}) img`)
}

export function getNthDeleteMediaButton (n) {
  return $(`.compose-media:nth-child(${n}) .compose-media-delete-button`)
}

export function getNthMediaFocalPointButton (n) {
  return $(`.compose-media:nth-child(${n}) .compose-media-focal-button`)
}

export function getAriaSetSize () {
  return getNthStatus(1 + 0).getAttribute('aria-setsize')
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

export function getNthStatusMediaButton (n) {
  return $(`${getNthStatusSelector(n)} .status-media button`)
}

export function getNthStatusRelativeDate (n) {
  return $(`${getNthStatusSelector(n)} .status-relative-date`)
}

export function getNthStatusRelativeDateTime (n) {
  return $(`${getNthStatusSelector(n)} .status-relative-date time`)
}

export function getNthStatusMediaImg (n) {
  return $(`${getNthStatusSelector(n)} .status-media img`)
}

export function getNthStatusHeader (n) {
  return $(`${getNthStatusSelector(n)} .status-header`)
}

export function getNthStatusAndImage (nStatus, nImage) {
  return $(`${getNthStatusSelector(nStatus)} .status-media .show-image-button:nth-child(${nImage}) img`)
}

export function getNthStatusAndSensitiveButton (nStatus, nImage) {
  return $(`${getNthStatusSelector(nStatus)} .status-sensitive-media-button:nth-child(${nImage})`)
}

export function getNthStatusAndSensitiveImage (nStatus, nImage) {
  return $(`${getNthStatusSelector(nStatus)} .status-media button:nth-child(${nImage}) img`)
}

export function getFirstVisibleStatus () {
  return $('.list-item > article[aria-posinset]').nth(0)
}

export function getNthReplyButton (n) {
  return $(`${getNthStatusSelector(n)} .status-toolbar button:nth-child(1)`)
}

export function getNthReplyContentWarningInput (n) {
  return $(`${getNthStatusSelector(n)} .content-warning-input`)
}

export function getNthReplyContentWarningButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(5)`)
}

export function getNthReplyPostPrivacyButton (n) {
  return $(`${getNthStatusSelector(n)} .compose-box-toolbar button:nth-child(4)`)
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

export function getNthStatusAccountLinkSelector (n) {
  return `${getNthStatusSelector(n)} .status-author-name`
}

export function getNthStatusAccountLink (n) {
  return $(getNthStatusAccountLinkSelector(n))
}

export function getNthFavoritedLabel (n) {
  return getNthFavoriteButton(n).getAttribute('aria-label')
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

export function getNthRebloggedLabel (n) {
  return getNthReblogButton(n).getAttribute('aria-label')
}

export function getNthDialogOptionsOption (n) {
  return $(`.modal-dialog li:nth-child(${n}) button`)
}

export function getDialogOptionWithText (text) {
  return $('.modal-dialog li button').withText(text)
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

export const getNumElementsMatchingSelector = (selector) => (exec(() => {
  return document.querySelectorAll(selector).length
}, {
  dependencies: { selector }
}))

export async function validateTimeline (t, timeline) {
  const timeout = 30000
  for (let i = 0; i < timeline.length; i++) {
    const status = timeline[i]
    // hovering forces TestCafé to scroll to that element: https://git.io/vABV2
    await t.hover(getNthStatus(1 + i))
    if (status.content) {
      await t.expect(getNthStatusContent(1 + i).innerText)
        .contains(status.content, { timeout })
    }
    if (status.spoiler) {
      await t.expect(getNthStatusSpoiler(1 + i).innerText)
        .contains(status.spoiler, { timeout })
    }
    if (status.followedBy) {
      await t.expect(getNthStatusHeader(1 + i).innerText)
        .match(new RegExp(status.followedBy + '\\s+followed you'), { timeout })
    }
    if (status.rebloggedBy) {
      await t.expect(getNthStatusHeader(1 + i).innerText)
        .match(new RegExp(status.rebloggedBy + '\\s+boosted your toot'), { timeout })
    }
    if (status.favoritedBy) {
      await t.expect(getNthStatusHeader(1 + i).innerText)
        .match(new RegExp(status.favoritedBy + '\\s+favorited your toot'), { timeout })
    }
  }
}

export async function scrollToStatus (t, n) {
  return scrollFromStatusToStatus(t, 1, n)
}

export async function scrollFromStatusToStatus (t, start, end) {
  const timeout = 20000
  for (let i = start; i < end + 1; i++) {
    await t
      .expect(getNthStatus(i).exists).ok({ timeout })
      .hover(getNthStatus(i))
  }
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
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(cb(i))
  }
  return arr
}
