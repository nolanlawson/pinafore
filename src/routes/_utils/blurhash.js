import BlurhashWorker from 'worker-loader!../_workers/blurhash' // eslint-disable-line

const RESOLUTION = 32
let worker
let canvas
let canvasContext2D

export function init () {
  worker = worker || new BlurhashWorker()
}

export async function decode (blurhash) {
  return new Promise((resolve, reject) => {
    try {
      init()

      const onMessage = ({ data: { encoded, decoded, imageData, error } }) => {
        if (encoded !== blurhash) {
          return
        }

        worker.removeEventListener('message', onMessage)

        if (error) {
          return reject(error)
        }

        if (decoded) {
          resolve(decoded)
        } else {
          if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.height = RESOLUTION
            canvas.width = RESOLUTION
            canvasContext2D = canvas.getContext('2d')
          }

          canvasContext2D.putImageData(imageData, 0, 0)
          canvas.toBlob(blob => {
            resolve(URL.createObjectURL(blob))
          })
        }
      }

      worker.addEventListener('message', onMessage)
      worker.postMessage({ encoded: blurhash })
    } catch (e) {
      reject(e)
    }
  })
}
