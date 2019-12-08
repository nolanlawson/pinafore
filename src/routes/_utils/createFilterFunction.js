// create a function for filtering timeline item summaries

function noFilter () {
  return true
}

export function createFilterFunction (showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls) {
  if (showReblogs && showReplies && showFollows && showFavs && showMentions && showPolls) {
    return noFilter // fast path for the default setting
  }
  return item => {
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
