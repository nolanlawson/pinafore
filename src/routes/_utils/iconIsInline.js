export function iconIsInline (href) {
  // TODO: have to manually keep this list in sync with /bin/svgs.js
  return [
    '#pinafore-logo',
    '#fa-bell',
    '#fa-users',
    '#fa-gear',
    '#fa-search',
    '#fa-comments'
  ].includes(href)
}
