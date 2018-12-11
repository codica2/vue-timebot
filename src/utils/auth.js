import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, exp) {
  return Cookies.set(TokenKey, token, { expires: exp / (3600 * 24) }) // Hours to day
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
