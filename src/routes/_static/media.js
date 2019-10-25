import { isIOSPre13 } from '../_utils/userAgent/isIOSPre13'

export const DEFAULT_MEDIA_WIDTH = 300
export const DEFAULT_MEDIA_HEIGHT = 250

export const ONE_TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const MEDIA_ALT_CHAR_LIMIT = 420

const acceptedFileTypes = [
  '.3gp',
  '.aac',
  '.flac',
  '.gif',
  '.jpeg',
  '.jpg',
  '.m4a',
  '.m4v',
  '.mov',
  '.mp3',
  '.mp4',
  '.oga',
  '.ogg',
  '.opus',
  '.png',
  '.wav',
  '.webm',
  '.wma',
  'audio/3gpp',
  'audio/aac',
  'audio/flac',
  'audio/m4a',
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/wave',
  'audio/webm',
  'audio/x-aac',
  'audio/x-m4a',
  'audio/x-mp4',
  'audio/x-pn-wave',
  'audio/x-wav',
  'image/gif',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-ms-asf'
]

// TODO: iOS has a bug where it does not allow audio uploads unless you either *only* accept audio, or
// you accept everything. Since this is not a great user experience (e.g. it could lead someone trying
// to upload a PDF, which is not allowed), then we only use the */* for iOS.
// WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=190982#c2
export const mediaAccept = isIOSPre13() ? '*/*' : acceptedFileTypes.join(',')
