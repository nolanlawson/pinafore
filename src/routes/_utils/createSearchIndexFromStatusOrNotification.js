let domParser

// copy-pasta'd from
// https://github.com/tootsuite/mastodon/blob/2ff01f7/app/javascript/mastodon/actions/importer/normalizer.js#L58-L75
export const createSearchIndexFromStatusOrNotification = statusOrNotification => {
  const status = statusOrNotification.status || statusOrNotification // status on a notification
  const originalStatus = status.reblog || status
  domParser = domParser || new DOMParser()
  const spoilerText = originalStatus.spoiler_text || ''
  const searchContent = ([spoilerText, originalStatus.content]
    .concat(
      (originalStatus.poll && originalStatus.poll.options)
        ? originalStatus.poll.options.map(option => option.title)
        : []
    ))
    .join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n')
  return domParser.parseFromString(searchContent, 'text/html').documentElement.textContent
}
