import { store } from '../_store/store'
import { uploadMedia } from '../_api/media'
import { toast } from '../_components/toast/toast'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { setCachedMediaFile } from '../_utils/mediaUploadFileCache'
import { formatIntl } from '../_utils/formatIntl'

export async function doMediaUpload (realm, file) {
  const { currentInstance, accessToken } = store.get()
  store.set({ uploadingMedia: true })
  try {
    const response = await uploadMedia(currentInstance, accessToken, file)
    const composeMedia = store.getComposeData(realm, 'media') || []
    if (composeMedia.length === 4) {
      throw new Error('Only 4 media max are allowed')
    }
    await setCachedMediaFile(response.id, file)
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
    /* no await */ toast.say(formatIntl('intl.failedToUploadMedia', { error: (e.message || '') }))
  } finally {
    store.set({ uploadingMedia: false })
  }
}

export function deleteMedia (realm, i) {
  const composeMedia = store.getComposeData(realm, 'media')
  composeMedia.splice(i, 1)

  store.setComposeData(realm, {
    media: composeMedia
  })
  if (!composeMedia.length) {
    const contentWarningShown = store.getComposeData(realm, 'contentWarningShown')
    const contentWarning = store.getComposeData(realm, 'contentWarning')
    store.setComposeData(realm, {
      sensitive: contentWarningShown && contentWarning // reset sensitive if the last media is deleted
    })
  }
  scheduleIdleTask(() => store.save())
}
