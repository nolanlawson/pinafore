import { store } from '../_store/store'
import { uploadMedia } from '../_api/media'
import { toast } from '../_utils/toast'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

export async function doMediaUpload (realm, file) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  store.set({uploadingMedia: true})
  try {
    let response = await uploadMedia(instanceName, accessToken, file)
    let composeMedia = store.getComposeData(realm, 'media') || []
    composeMedia.push({
      data: response,
      file: { name: file.name }
    })
    let composeText = store.getComposeData(realm, 'text') || ''
    composeText += ' ' + response.text_url
    store.setComposeData(realm, {
      media: composeMedia,
      text: composeText
    })
    scheduleIdleTask(() => store.save())
  } catch (e) {
    console.error(e)
    toast.say('Failed to upload media: ' + (e.message || ''))
  } finally {
    store.set({uploadingMedia: false})
  }
}

export function deleteMedia (realm, i) {
  let composeMedia = store.getComposeData(realm, 'media')
  let deletedMedia = composeMedia.splice(i, 1)[0]

  let composeText = store.getComposeData(realm, 'text') || ''
  composeText = composeText.replace(' ' + deletedMedia.data.text_url, '')

  let mediaDescriptions = store.getComposeData(realm, 'mediaDescriptions') || []
  if (mediaDescriptions[i]) {
    mediaDescriptions[i] = null
  }

  store.setComposeData(realm, {
    media: composeMedia,
    text: composeText,
    mediaDescriptions: mediaDescriptions
  })
  scheduleIdleTask(() => store.save())
}
