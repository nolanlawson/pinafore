import { store } from '../_store/store'
import { uploadMedia } from '../_api/media'
import { toast } from '../_utils/toast'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

export async function doMediaUpload (realm, file) {
  let { currentInstance, accessToken } = store.get()
  store.set({ uploadingMedia: true })
  try {
    let response = await uploadMedia(currentInstance, accessToken, file)
    let composeMedia = store.getComposeData(realm, 'media') || []
    if (composeMedia.length === 4) {
      throw new Error('Only 4 media max are allowed')
    }
    composeMedia.push({
      data: response,
      file: { name: file.name },
      description: ''
    })
    store.setComposeData(realm, {
      media: composeMedia
    })
    scheduleIdleTask(() => store.save())
  } catch (e) {
    console.error(e)
    toast.say('Failed to upload media: ' + (e.message || ''))
  } finally {
    store.set({ uploadingMedia: false })
  }
}

export function deleteMedia (realm, i) {
  let composeMedia = store.getComposeData(realm, 'media')
  composeMedia.splice(i, 1)

  store.setComposeData(realm, {
    media: composeMedia
  })
  scheduleIdleTask(() => store.save())
}
