export async function post(url, body) {
  return await (await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })).json()
}

export function paramsString(paramsObject) {
  let params = new URLSearchParams()
  Object.keys(paramsObject).forEach(key => {
    params.set(key, paramsObject[key])
  })
  return params.toString()
}

export async function get(url, headers = {}) {
  return await (await fetch(url, {
    method: 'GET',
    headers: Object.assign(headers, {
      'Accept': 'application/json',
    })
  })).json()
}