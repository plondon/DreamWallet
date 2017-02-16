import 'isomorphic-fetch'
import Promise from 'es6-promise'
import { futurizeP } from 'futurize'
Promise.polyfill()

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
const id = x => x

const createApi = ({ rootUrl = BLOCKCHAIN_INFO
                   , apiUrl = API_BLOCKCHAIN_INFO
                   , apiCode = API_CODE } = {}, returnType) => {

  const future = returnType ? futurizeP(returnType) : id
  const request = (action, method, data, extraHeaders) => {
    // options
    let options = {
      method: action,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'omit'
    }
    if (extraHeaders) {
      if (extraHeaders.sessionToken) {
        options.headers['Authorization'] = 'Bearer ' + extraHeaders.sessionToken
      }
    }
    // body
    const body = encodeFormData(apiCode ? {...data, ...{ api_code: apiCode }} : {...data})
    switch (action) {
      case 'GET':
        const urlGET = `${rootUrl}${method}?${body}`
        return fetch(urlGET, options).then(checkStatus).then(extractData)
      case 'POST':
        const urlPOST = `${rootUrl}${method}`
        options.body = body
        return fetch(urlPOST, options).then(checkStatus).then(extractData)
      default:
        return Promise.reject({error: 'HTTP_ACTION_NOT_SUPPORTED'})
    }
  }

  // checkStatus :: Response -> Promise Response
  const checkStatus = (r) => {
    return r.ok ? Promise.resolve(r)
                : Promise.reject({ status: r.status, statusText: r.statusText})
  }

  // extractData :: Response -> Promise (JSON | BLOB | TEXT)
  const extractData = (r) => {
    const responseOfType = (t) =>
      r.headers.get('content-type') &&
      r.headers.get('content-type').indexOf(t) > -1

    switch (true) {
      case responseOfType('application/json'):
        return r.json()
      case responseOfType('image/jpeg'):
        return r.blob()
      default:
        return r.text()
    }
  }

  // encodeFormData :: Object -> String
  const encodeFormData = (data) => {
    return data

      ? Object.keys(data)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
        .join('&')
      : ''
  }

  // fetchWalletWithSharedKey :: () -> Promise JSON
  const fetchWalletWithSharedKey = (guid, sharedKey) => {
    var data = { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
    return request('POST', 'wallet', data)
  }

  return {
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey)
  }
}

export default createApi
