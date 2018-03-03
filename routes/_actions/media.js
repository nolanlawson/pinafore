import { store } from '../_store/store'
import { uploadMedia } from '../_api/media'
import { toast } from '../_utils/toast'

export async function doMediaUpload (realm, file) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  store.set({uploadingMedia: true})
  try {
    let response = await uploadMedia(instanceName, accessToken, file)
    let uploadedMedia = store.get('uploadedMedia')
    uploadedMedia[instanceName] = uploadedMedia[instanceName] || {}
    uploadedMedia[instanceName][realm] = uploadedMedia[instanceName][realm] || []
    uploadedMedia[instanceName][realm].push({
      data: response,
      file: file
    })
    store.set({ uploadedMedia })
  } catch (e) {
    console.error(e)
    toast.say('Failed to upload media: ' + (e.message || ''))
  } finally {
    store.set({uploadingMedia: false})
  }
}

export function deleteMedia (realm, i) {
  let uploadedMedia = store.get('uploadedMedia')
  let instanceName = store.get('currentInstance')
  let uploadedMediaArray = uploadedMedia[instanceName][realm]

  uploadedMediaArray.splice(i, 1)
  store.set({uploadedMedia})
}
