let domParser

// copy-pasta'd from
// https://github.com/tootsuite/mastodon/blob/2ff01f7/app/javascript/mastodon/actions/importer/normalizer.js#L58-L75
export const createSearchIndexFromStatus = status => {
  domParser = domParser || new DOMParser()
  const spoilerText = status.spoiler_text || ''
  const searchContent = ([spoilerText, status.content]
    .concat((status.poll && status.poll.options) ? status.poll.options.map(option => option.title) : []))
    .join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n')
  return domParser.parseFromString(searchContent, 'text/html').documentElement.textContent
}
