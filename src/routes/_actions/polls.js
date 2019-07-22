import { getPoll as getPollApi, voteOnPoll as voteOnPollApi } from '../_api/polls'
import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'

export async function getPoll (pollId) {
  const { currentInstance, accessToken } = store.get()
  try {
    const poll = await getPollApi(currentInstance, accessToken, pollId)
    return poll
  } catch (e) {
    console.error(e)
    toast.say('Unable to refresh poll: ' + (e.message || ''))
  }
}

export async function voteOnPoll (pollId, choices) {
  const { currentInstance, accessToken } = store.get()
  try {
    const poll = await voteOnPollApi(currentInstance, accessToken, pollId, choices.map(_ => _.toString()))
    return poll
  } catch (e) {
    console.error(e)
    toast.say('Unable to vote in poll: ' + (e.message || ''))
  }
}
