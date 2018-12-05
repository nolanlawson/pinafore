/**
 * Detect if the browser is running in Private Browsing mode
 *
 * Via https://gist.github.com/jherax/a81c8c132d09cc354a0e2cb911841ff1
 */

async function checkPrivateBrowsing () {
  // Safari
  try {
    localStorage.test = '1'
    if (!localStorage.length || localStorage.getItem('test') !== '1') {
      return true
    }
    localStorage.removeItem('test')
  } catch (e) {
    return true
  }

  if (!navigator.cookieEnabled) {
    return true
  }

  // IE10+ & Edge
  if (!window.indexedDB) {
    return true
  }

  // Chrome & Opera
  if (window.webkitRequestFileSystem) {
    let fsFailed = await new Promise(resolve => {
      window.webkitRequestFileSystem(0, 0, () => resolve(false), () => resolve(true))
    })
    if (fsFailed) {
      return true
    }
  }

  let idbFailed = await new Promise(resolve => {
    let db = indexedDB.open('test')
    db.onerror = () => resolve(true)
    db.onsuccess = () => {
      indexedDB.deleteDatabase('test')
      resolve(false)
    }
  })

  if (idbFailed) {
    return true
  }

  // others
  return false
}

let cachedValue

export async function isPrivateBrowsing () {
  if (typeof cachedValue === 'undefined') {
    cachedValue = await checkPrivateBrowsing()
  }
  return cachedValue
}
