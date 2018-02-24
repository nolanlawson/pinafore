const TIMEOUT = 15000

function fetchWithTimeout (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options).then(resolve, reject)
    setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT / 1000} seconds`)), TIMEOUT)
  })
}

async function _post (url, body, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let opts = {
    method: 'POST'
  }
  if (body) {
    opts.headers = Object.assign(headers, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    opts.body = JSON.stringify(body)
  } else {
    opts.headers = Object.assign(headers, {
      'Accept': 'application/json'
    })
  }
  return (await fetchFunc(url, opts)).json()
}

async function _get (url, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  return (await fetchFunc(url, {
    method: 'GET',
    headers: Object.assign(headers, {
      'Accept': 'application/json'
    })
  })).json()
}

export async function post (url, body, headers = {}) {
  return _post(url, body, headers, false)
}

export async function postWithTimeout (url, body, headers = {}) {
  return _post(url, body, headers, true)
}

export async function getWithTimeout (url, headers = {}) {
  return _get(url, headers, true)
}

export async function get (url, headers = {}) {
  return _get(url, headers, false)
}

export function paramsString (paramsObject) {
  let params = new URLSearchParams()
  Object.keys(paramsObject).forEach(key => {
    params.set(key, paramsObject[key])
  })
  return params.toString()
}
