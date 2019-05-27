import { getPoll as getPollApi } from '../_api/polls'
import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'

export async function getPoll (pollId) {
  let { currentInstance, accessToken } = store.get()
  try {
    let poll = await getPollApi(currentInstance, accessToken, pollId)
    return poll
  } catch (e) {
    console.error(e)
    toast.say(`Unable to refresh poll`)
  }
}
