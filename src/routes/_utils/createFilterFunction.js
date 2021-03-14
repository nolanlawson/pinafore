// create a function for filtering timeline item summaries

export const createFilterFunction = (
  showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls, wordFilterContext
) => {
  return item => {
    if (item.filterContexts && item.filterContexts.includes(wordFilterContext)) {
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
