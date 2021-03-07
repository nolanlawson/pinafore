// create a function for filtering timeline item summaries

const noFilter = () => true

export const createFilterFunction = (
  showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls, wordFilterRegex
) => {
  if (showReblogs && showReplies && showFollows && showFavs && showMentions && showPolls && !wordFilterRegex) {
    return noFilter // fast path for the default setting
  }
  return item => {
    if (wordFilterRegex && wordFilterRegex.test(item.searchIndex)) {
      return false
    }

    switch (item.type) {
      case 'poll':
        return showPolls
      case 'favourite':
        return showFavs
      case 'reblog':
        return showReblogs
      case 'mention':
        return showMentions
      case 'follow':
        return showFollows
    }
    if (item.reblogId) {
      return showReblogs
    } else if (item.replyId) {
      return showReplies
    } else {
      return true
    }
  }
}
