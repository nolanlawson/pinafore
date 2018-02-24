import { ClientFunction as exec, Selector as $ } from 'testcafe'

const SCROLL_INTERVAL = 3

export const settingsButton = $('nav a[aria-label=Settings]')
export const instanceInput = $('#instanceInput')
export const addInstanceButton = $('.add-new-instance button')
export const modalDialogContents = $('.modal-dialog-contents')
export const closeDialogButton = $('.close-dialog-button')
export const notificationsNavButton = $('nav a[href="/notifications"]')
export const homeNavButton = $('nav a[href="/"]')
export const formError = $('.form-error-user-error')

export const favoritesCountElement = $('.status-favs-reblogs:nth-child(3)').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const reblogsCountElement = $('.status-favs-reblogs:nth-child(2)').addCustomDOMProperties({
  innerCount: el => parseInt(el.innerText, 10)
})

export const getUrl = exec(() => window.location.href)

export const getActiveElementClass = exec(() =>
  document.activeElement ? document.activeElement.getAttribute('class') : ''
)

export const goBack = exec(() => window.history.back())

export function getNthStatus (n) {
  return $(`div[aria-hidden="false"] > article[aria-posinset="${n}"]`)
}

export function getLastVisibleStatus () {
  return $(`div[aria-hidden="false"] > article[aria-posinset]`).nth(-1)
}

export function getFirstVisibleStatus () {
  return $(`div[aria-hidden="false"] > article[aria-posinset]`).nth(0)
}

export function getNthFavoriteButton (n) {
  return getNthStatus(n).find('.status-toolbar button:nth-child(3)')
}

export function getNthFavorited (n) {
  return getNthFavoriteButton(n).getAttribute('aria-pressed')
}

export function getFavoritesCount () {
  return favoritesCountElement.innerCount
}

export function getReblogsCount () {
  return reblogsCountElement.innerCount
}

export async function validateTimeline (t, timeline) {
  for (let i = 0; i < timeline.length; i++) {
    let status = timeline[i]
    if (status.content) {
      await t.expect(getNthStatus(i).find('.status-content p').innerText)
        .contains(status.content)
    }
    if (status.spoiler) {
      await t.expect(getNthStatus(i).find('.status-spoiler p').innerText)
        .contains(status.spoiler)
    }
    if (status.followedBy) {
      await t.expect(getNthStatus(i).find('.status-header span').innerText)
        .contains(status.followedBy + ' followed you')
    }
    if (status.rebloggedBy) {
      await t.expect(getNthStatus(i).find('.status-header span').innerText)
        .contains(status.rebloggedBy + ' boosted your status')
    }
    if (status.favoritedBy) {
      await t.expect(getNthStatus(i).find('.status-header span').innerText)
        .contains(status.favoritedBy + ' favorited your status')
    }

    // hovering forces TestCafé to scroll to that element: https://git.io/vABV2
    if (i % SCROLL_INTERVAL === (SCROLL_INTERVAL - 1)) { // only scroll every nth element
      await t.hover(getNthStatus(i))
        .expect($('.loading-footer').exist).notOk()
    }
  }
}

export async function scrollTimelineUp (t) {
  let oldFirstItem = await getFirstVisibleStatus().getAttribute('aria-posinset')
  await t.hover(getFirstVisibleStatus())
  let newFirstItem
  while (true) {
    newFirstItem = await getFirstVisibleStatus().getAttribute('aria-posinset')
    if (newFirstItem === '0' || newFirstItem !== oldFirstItem) {
      break
    }
  }
}

export async function scrollToTopOfTimeline (t) {
  let i = await getFirstVisibleStatus().getAttribute('aria-posinset')
  while (true) {
    await t.hover(getNthStatus(i))
      .expect($('.loading-footer').exist).notOk()
    i -= SCROLL_INTERVAL
    if (i <= 0) {
      break
    }
  }
}

export async function scrollToBottomOfTimeline (t) {
  let i = 0
  while (true) {
    await t.hover(getNthStatus(i))
      .expect($('.loading-footer').exist).notOk()
    let size = await getNthStatus(i).getAttribute('aria-setsize')
    i += SCROLL_INTERVAL
    if (i >= size - 1) {
      break
    }
  }
}

export async function scrollToStatus (t, n) {
  for (let i = 0; i < n; i += 2) {
    await t.hover(getNthStatus(n))
  }
  await t.hover(getNthStatus(n))
}
