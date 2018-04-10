const TIMEOUT = process.browser ? 60000 : 120000

function fetchWithTimeout (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options).then(resolve, reject)
    setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT / 1000} seconds`)), TIMEOUT)
  })
}

async function throwErrorIfInvalidResponse (response) {
  let json = await response.json()
  if (response.status >= 200 && response.status < 300) {
    return json
  }
  if (json && json.error) {
    throw new Error(response.status + ': ' + json.error)
  }
  throw new Error('Request failed: ' + response.status)
}

async function _post (url, body, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let opts = {
    method: 'POST'
  }
  if (body) {
    let isFormData = body instanceof FormData
    opts.headers = Object.assign(headers, isFormData ? {
      'Accept': 'application/json'
    } : {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    opts.body = isFormData ? body : JSON.stringify(body)
  } else {
    opts.headers = Object.assign(headers, {
      'Accept': 'application/json'
    })
  }
  let response = await fetchFunc(url, opts)
  return throwErrorIfInvalidResponse(response)
}

async function _put (url, body, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let opts = {
    method: 'PUT'
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
  let response = await fetchFunc(url, opts)
  return throwErrorIfInvalidResponse(response)
}

async function _get (url, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let response = await fetchFunc(url, {
    method: 'GET',
    headers: Object.assign(headers, {
      'Accept': 'application/json'
    })
  })
  return throwErrorIfInvalidResponse(response)
}

async function _delete (url, headers, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let response = await fetchFunc(url, {
    method: 'DELETE',
    headers: Object.assign(headers, {
      'Accept': 'application/json'
    })
  })
  return throwErrorIfInvalidResponse(response)
}

export async function put (url, body, headers = {}) {
  return _put(url, body, headers, false)
}

export async function putWithTimeout (url, body, headers = {}) {
  return _put(url, body, headers, true)
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

export async function deleteWithTimeout (url, headers = {}) {
  return _delete(url, headers, true)
}

export function paramsString (paramsObject) {
  let res = ''
  Object.keys(paramsObject).forEach((key, i) => {
    if (i > 0) {
      res += '&'
    }
    res += encodeURIComponent(key) + '=' + encodeURIComponent(paramsObject[key])
  })
  return res
}
