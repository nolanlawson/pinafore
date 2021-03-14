// copy-pasta'd from mastodon
// https://github.com/tootsuite/mastodon/blob/2ff01f7/app/javascript/mastodon/selectors/index.js#L40-L63
const escapeRegExp = string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

export const createRegexFromFilters = filters => {
  return new RegExp(filters.map(filter => {
    let expr = escapeRegExp(filter.phrase)

    if (filter.whole_word) {
      if (/^[\w]/.test(expr)) {
        expr = `\\b${expr}`
      }

      if (/[\w]$/.test(expr)) {
        expr = `${expr}\\b`
      }
    }

    return expr
  }).join('|'), 'i')
}
