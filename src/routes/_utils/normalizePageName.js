// return the page name for purposes of figuring out which part of the nav
// is highlighted/selected
export function normalizePageName (page) {
  // notifications/mentions and settings/foo are a special case; they show as selected in the nav
  return page === 'notifications/mentions'
    ? 'notifications'
    : (page && page.startsWith('settings/'))
        ? 'settings'
        : page
}
