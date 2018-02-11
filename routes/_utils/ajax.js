const TIMEOUT = 15000

function fetchWithTimeout (url, options) {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT / 1000} seconds`)), TIMEOUT)
    })
  ])
}

export async function post (url, body) {
  return (await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })).json()
}

export function paramsString (paramsObject) {
  let params = new URLSearchParams()
  Object.keys(paramsObject).forEach(key => {
    params.set(key, paramsObject[key])
  })
  return params.toString()
}

export async function get (url, headers = {}) {
  return (await fetchWithTimeout(url, {
    method: 'GET',
    headers: Object.assign(headers, {
      'Accept': 'application/json'
    })
  })).json()
}
