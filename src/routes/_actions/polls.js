import { getPoll as getPollApi, voteOnPoll as voteOnPollApi } from '../_api/polls'
import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'

export async function getPoll (pollId) {
  const { currentInstance, accessToken } = store.get()
  try {
    const poll = await getPollApi(currentInstance, accessToken, pollId)
    return poll
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToRefreshPoll', { error: (e.message || '') }))
  }
}

export async function voteOnPoll (pollId, choices) {
  const { currentInstance, accessToken } = store.get()
  try {
    const poll = await voteOnPollApi(currentInstance, accessToken, pollId, choices.map(_ => _.toString()))
    return poll
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToVoteInPoll', { error: (e.message || '') }))
  }
}
