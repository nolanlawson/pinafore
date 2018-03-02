import { store } from '../_store/store'
import { uploadMedia } from '../_api/media'
import { toast } from '../_utils/toast'

export async function doMediaUpload(file) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  store.set({uploadingMedia: true})
  try {
    let response = await uploadMedia(instanceName, accessToken, file)
    let mediaToUpload = store.get('mediaToUpload') || []
    mediaToUpload.push({
      data: response,
      file: file
    })
    store.set({ mediaToUpload })
  } catch (e) {
    console.error(e)
    toast.say('Failed to upload media: ' + (e.message || ''))
  } finally {
    store.set({uploadingMedia: false})
  }
}